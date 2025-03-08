import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import { CreateProjectDto, ProjectDto, UpdateProjectDto } from './project.dto';
import { FindAllUsersDto } from '../user/user.dto';
import { Role } from 'src/utils/enums';

@Injectable()
export class ProjectService {
  constructor(private readonly knexService: KnexService) {}

  async createProject(data: CreateProjectDto): Promise<ProjectDto> {
    const user = await this.knexService
      .knex<FindAllUsersDto>('users')
      .where({ id: data.created_by })
      .first();

    if (!user) throw new NotFoundException('User not found');

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
      .knex<ProjectDto>('projects')
      .insert(data)
      .returning('*');

    return project;
  }

  async getAllProjects(): Promise<ProjectDto[]> {
    return this.knexService.knex<ProjectDto>('projects').select('*');
  }

  async updateProject(
    projectId: string,
    data: UpdateProjectDto,
  ): Promise<ProjectDto> {
    const project = await this.knexService
      .knex<ProjectDto>('projects')
      .where({ id: projectId })
      .first();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const [updatedProject] = await this.knexService
      .knex<ProjectDto>('projects')
      .where({ id: projectId })
      .update(data)
      .returning('*');

    return updatedProject;
  }

  async deleteProject(projectId: string): Promise<void> {
    const project = await this.knexService
      .knex<ProjectDto>('projects')
      .where({ id: projectId })
      .first();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.knexService
      .knex<ProjectDto>('projects')
      .where({ id: projectId })
      .delete();
  }
}
