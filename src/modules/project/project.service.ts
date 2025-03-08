import { Injectable, UnauthorizedException } from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { Role } from 'src/utils/enums';
import { ProjectI } from 'src/common/interface/basic.interface';

@Injectable()
export class ProjectService {
  constructor(private readonly knexService: KnexService) {}

  async createProject(data: CreateProjectDto): Promise<ProjectI> {
    const user = await this.knexService.findUserById(
      data.created_by,
      'User not found',
    );

    const organizationUsers = await this.knexService
      .knex<{
        id: string;
        org_id: string;
        user_id: string;
      }>('organization_user')
      .where({ org_id: data.organizationId });

    const isManager = organizationUsers.find(
      (orgUser) =>
        orgUser.user_id === data.created_by && user.role === Role.MANAGER,
    );

    if (!isManager) throw new UnauthorizedException();

    const [project] = await this.knexService
      .knex<ProjectI>('projects')
      .insert(data)
      .returning('*');

    return project;
  }

  async getAllProjects(): Promise<ProjectI[]> {
    return this.knexService.knex<ProjectI>('projects').select('*');
  }

  async updateProject(
    projectId: string,
    data: UpdateProjectDto,
  ): Promise<ProjectI> {
    await this.knexService.findProjectById(projectId);

    const [updatedProject] = await this.knexService
      .knex<ProjectI>('projects')
      .where({ id: projectId })
      .update(data)
      .returning('*');

    return updatedProject;
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.knexService.findProjectById(projectId);

    await this.knexService
      .knex<ProjectI>('projects')
      .where({ id: projectId })
      .delete();
  }
}
