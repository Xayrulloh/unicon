import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async createProject(data: CreateProjectDto): Promise<ProjectI> {
    const user = await this.knexService.findUserById(
      data.createdBy,
      'User not found',
    );

    const organizationUsers = await this.knexService
      .knex<OrganizationUserI>('organization_user')
      .where({ organizationId: data.organizationId });

    const isManager = organizationUsers.find(
      (orgUser) =>
        orgUser.userId === data.createdBy && user.role === Role.MANAGER,
    );

    if (!isManager) throw new UnauthorizedException();

    const [project] = await this.knexService
      .knex('projects')
      .insert(data)
      .returning<
        ProjectI[]
      >(['id', 'name', 'created_by as createdBy', 'organization_id as organizationId']);

    return project;
  }

  async getAllProjects(): Promise<ProjectI[]> {
    return this.knexService.knex<ProjectI>('projects').select('*');
  }

  async updateProject(
    projectId: number,
    data: UpdateProjectDto,
  ): Promise<ProjectI> {
    await this.knexService.findProjectById(projectId);

    const [updatedProject] = await this.knexService
      .knex('projects')
      .where({ id: projectId })
      .update(data)
      .returning<
        ProjectI[]
      >(['id', 'name', 'created_by as createdBy', 'organization_id as organizationId']);

    return updatedProject;
  }

  async deleteProject(projectId: number): Promise<void> {
    await this.knexService.findProjectById(projectId);

    await this.knexService
      .knex<ProjectI>('projects')
      .where({ id: projectId })
      .delete();
  }
}
