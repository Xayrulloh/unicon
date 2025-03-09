import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import {
  AttachStaffOrganizationDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './organization.dto';
import { Role } from 'src/utils/enums';
import {
  OrganizationI,
  OrganizationUserI,
} from 'src/common/interface/basic.interface';

@Injectable()
export class OrganizationService {
  constructor(private readonly knexService: KnexService) {}

  async getAllOrganizations(): Promise<OrganizationI[]> {
    return this.knexService.knex('organizations').select<OrganizationI[]>({
      id: 'organizations.id',
      name: 'organizations.name',
      createdBy: 'organizations.created_by',
    });
  }

  async createOrganization(
    organization: CreateOrganizationDto,
  ): Promise<CreateOrganizationDto> {
    const admin = await this.knexService.findUserById(
      organization.createdBy,
      'Admin not found',
    );

    if (admin.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can create organization');
    }

    const [organizationData] = await this.knexService
      .knex('organizations')
      .insert({
        name: organization.name,
        created_by: organization.createdBy,
      })
      .returning<OrganizationI[]>(['id', 'name', 'created_by as createdBy']);

    return organizationData;
  }

  async attachStaffOrganization(
    data: AttachStaffOrganizationDto,
  ): Promise<AttachStaffOrganizationDto> {
    const admin = await this.knexService.findUserById(
      data.createdBy,
      'Admin not found',
    );

    if (admin.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can attach staff');
    }

    const staff = await this.knexService.findUserById(
      data.userId,
      'Stuff not found',
    );

    if (staff.role === Role.ADMIN) {
      throw new BadRequestException('Admin cannot be attached');
    }

    await this.knexService.findOrganizationById(data.organizationId);

    const isOrganizationStaffExist = await this.knexService
      .knex('organization_user')
      .where({ organization_id: data.organizationId, user_id: data.userId })
      .first<OrganizationUserI>();

    if (isOrganizationStaffExist) {
      throw new BadRequestException('Organization staff already exist');
    }

    const [organizationStuff] = await this.knexService
      .knex('organization_user')
      .insert({
        organization_id: data.organizationId,
        user_id: data.userId,
      })
      .returning<AttachStaffOrganizationDto[]>([
        'organization_id as organizationId',
        'user_id as userId',
      ]);

    return organizationStuff;
  }

  async updateOrganization(
    organizationId: number,
    organization: UpdateOrganizationDto,
  ): Promise<OrganizationI> {
    const admin = await this.knexService.findUserById(
      organization.createdBy,
      'Admin not found',
    );

    if (admin.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can update organization');
    }

    await this.knexService.findOrganizationById(organizationId);

    const [updatedOrganizationData] = await this.knexService
      .knex('organizations')
      .where({ id: organizationId })
      .update({
        name: organization.name,
      })
      .returning<OrganizationI[]>(['id', 'name', 'created_by as createdBy']);

    return updatedOrganizationData;
  }

  async deleteOrganization(
    organizationId: number,
    createdBy: number,
  ): Promise<void> {
    const admin = await this.knexService.findUserById(
      createdBy,
      'Admin not found',
    );

    if (admin.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only Admin can delete organization');
    }

    await this.knexService.findOrganizationById(organizationId);

    await this.knexService
      .knex<OrganizationI>('organizations')
      .where({ id: organizationId })
      .delete();
  }
}
