import { Injectable, UnauthorizedException } from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import {
  AttachStaffOrganizationDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './organization.dto';
import { Role } from 'src/utils/enums';
import { OrganizationI } from 'src/common/interface/basic.interface';

@Injectable()
export class OrganizationService {
  constructor(private readonly knexService: KnexService) {}

  async getAllOrganizations(): Promise<OrganizationI[]> {
    return this.knexService.knex('organizations').select('*');
  }

  async createOrganization(
    organization: CreateOrganizationDto,
  ): Promise<CreateOrganizationDto> {
    const user = await this.knexService.findUserById(organization.created_by);

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can create organization');
    }

    const [organizationData] = await this.knexService
      .knex<OrganizationI>('organizations')
      .insert(organization)
      .returning('*');

    return organizationData;
  }

  async attachStaffOrganization(
    data: AttachStaffOrganizationDto,
  ): Promise<AttachStaffOrganizationDto> {
    const user = await this.knexService.findUserById(data.created_by);

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can attach staff');
    }

    await this.knexService.findUserById(data.userId, 'Stuff not found');

    const [organizationStuff] = await this.knexService
      .knex<AttachStaffOrganizationDto>('organization_user')
      .insert(data)
      .returning('*');

    return organizationStuff;
  }

  async updateOrganization(
    organizationId: string,
    organization: UpdateOrganizationDto,
  ): Promise<OrganizationI> {
    const user = await this.knexService.findUserById(organization.created_by);

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can update organization');
    }

    await this.knexService.findOrganizationById(organizationId);

    const [updatedOrganizationData] = await this.knexService
      .knex<OrganizationI>('organizations')
      .where({ id: organizationId })
      .update(organization)
      .returning('*');

    return updatedOrganizationData;
  }

  async deleteOrganization(organizationId: string): Promise<void> {
    await this.knexService.findOrganizationById(organizationId);

    await this.knexService
      .knex<OrganizationI>('organizations')
      .where({ id: organizationId })
      .delete();
  }
}
