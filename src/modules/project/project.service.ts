import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { Role } from 'src/utils/enums';
import {
  OrganizationUserI,
  ProjectI,
} from 'src/common/interface/basic.interface';

@Injectable()
export class ProjectService {
  constructor(private readonly knexService: KnexService) {}

  async createProject(
    organizationId: number,
    data: CreateProjectDto,
  ): Promise<ProjectI> {
    await this.checkOrganizationManager(organizationId, data.createdBy);

    const [project] = await this.knexService
      .knex('projects')
      .insert({
        name: data.name,
        organization_id: organizationId,
        created_by: data.createdBy,
      })
      .returning<ProjectI[]>([
        'id',
        'name',
        'created_by as createdBy',
        'organization_id as organizationId',
      ]);

    return project;
  }

  async getAllProjects(organizationId: number): Promise<ProjectI[]> {
    await this.knexService.findOrganizationById(organizationId);

    return this.knexService
      .knex('projects')
      .select<
        ProjectI[]
      >({ id: 'projects.id', name: 'projects.name', createdBy: 'projects.created_by', organizationId: 'projects.organization_id' })
      .where({ organization_id: organizationId });
  }

  async updateProject(
    organizationId: number,
    projectId: number,
    data: UpdateProjectDto,
  ): Promise<ProjectI> {
    await this.checkOrganizationManager(organizationId, data.createdBy);

    const project = await this.knexService.findProjectById(projectId);

    if (project.organizationId !== organizationId) {
      throw new BadRequestException(
        "This project doesn't exist in this organization",
      );
    }

    const [updatedProject] = await this.knexService
      .knex('projects')
      .where({ id: projectId })
      .update({
        name: data.name,
      })
      .returning<ProjectI[]>([
        'id',
        'name',
        'created_by as createdBy',
        'organization_id as organizationId',
      ]);

    return updatedProject;
  }

  async deleteProject(
    organizationId: number,
    projectId: number,
    createdBy: number,
  ): Promise<void> {
    await this.checkOrganizationManager(organizationId, createdBy);

    const project = await this.knexService.findProjectById(projectId);

    if (project.organizationId !== organizationId) {
      throw new BadRequestException(
        "This project doesn't exist in this organization",
      );
    }

    await this.knexService
      .knex<ProjectI>('projects')
      .where({ id: projectId })
      .delete();
  }

  async checkOrganizationManager(organizationId: number, managerId: number) {
    const manager = await this.knexService.findUserById(
      managerId,
      'Manager not found',
    );

    if (manager.role !== Role.MANAGER) {
      throw new UnauthorizedException('Only manager can create project');
    }

    const organizationUsers = await this.knexService
      .knex('organization_user')
      .where({ organization_id: organizationId })
      .select<
        OrganizationUserI[]
      >(['id', 'user_id as userId', 'organization_id as organizationId']);

    const isManager = organizationUsers.find(
      (orgUser) =>
        orgUser.userId === managerId && manager.role === Role.MANAGER,
    );

    if (!isManager) {
      throw new UnauthorizedException("This project doesn't belong to you");
    }
  }
}
