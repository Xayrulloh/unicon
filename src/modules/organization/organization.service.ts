import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import {
  AttachStaffOrganizationDto,
  CreateOrganizationDto,
  FindAllOrganizationsDto,
  UpdateOrganizationDto,
} from './organization.dto';
import { FindAllUsersDto } from '../user/user.dto';
import { Role } from 'src/utils/enums';

@Injectable()
export class OrganizationService {
  constructor(private readonly knexService: KnexService) {}

  async getAllOrganizations(): Promise<FindAllOrganizationsDto[]> {
    return this.knexService.knex('organizations').select('*');
  }

  async createOrganization(
    organization: CreateOrganizationDto,
  ): Promise<CreateOrganizationDto> {
    const user = await this.knexService
      .knex<FindAllUsersDto>('users')
      .where({ id: organization.created_by })
      .first();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can create organization');
    }

    const [organizationData] = await this.knexService
      .knex<FindAllOrganizationsDto>('organizations')
      .insert(organization)
      .returning('*');

    return organizationData;
  }

  async attachStaffOrganization(
    data: AttachStaffOrganizationDto,
  ): Promise<AttachStaffOrganizationDto> {
    const user = await this.knexService
      .knex<FindAllUsersDto>('users')
      .where({ id: data.created_by })
      .first();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can attach staff');
    }

    const stuff = await this.knexService
      .knex<FindAllUsersDto>('users')
      .where({ id: data.userId })
      .first();

    if (!stuff) {
      throw new NotFoundException('Stuff not found');
    }

    const [organizationStuff] = await this.knexService
      .knex<AttachStaffOrganizationDto>('organization_user')
      .insert(data)
      .returning('*');

    return organizationStuff;
  }

  async updateOrganization(
    organizationId: string,
    organization: UpdateOrganizationDto,
  ): Promise<FindAllOrganizationsDto> {
    const user = await this.knexService
      .knex<FindAllUsersDto>('users')
      .where({ id: organization.created_by })
      .first();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can update organization');
    }

    const organizationData = await this.knexService
      .knex<FindAllOrganizationsDto>('organizations')
      .where({ id: organizationId })
      .first();

    if (!organizationData) {
      throw new NotFoundException('Organization not found');
    }

    const [updatedOrganizationData] = await this.knexService
      .knex<FindAllOrganizationsDto>('organizations')
      .where({ id: organizationId })
      .update(organization)
      .returning('*');

    return updatedOrganizationData;
  }

  async deleteOrganization(organizationId: string): Promise<void> {
    const organizationData = await this.knexService
      .knex<FindAllOrganizationsDto>('organizations')
      .where({ id: organizationId })
      .first();

    if (!organizationData) {
      throw new NotFoundException('Organization not found');
    }

    await this.knexService
      .knex<FindAllOrganizationsDto>('organizations')
      .where({ id: organizationId })
      .delete();
  }
}
