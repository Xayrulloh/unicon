import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { FindUserDto } from '../user/user.dto';
import { Role } from 'src/utils/enums';
import { ProjectI } from 'src/common/interface/basic.interface';

@Injectable()
export class ProjectService {
  constructor(private readonly knexService: KnexService) {}

  async createProject(data: CreateProjectDto): Promise<ProjectI> {
    const user = await this.knexService
      .knex<FindUserDto>('users')
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
    const project = await this.knexService
      .knex<ProjectI>('projects')
      .where({ id: projectId })
      .first();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const [updatedProject] = await this.knexService
      .knex<ProjectI>('projects')
      .where({ id: projectId })
      .update(data)
      .returning('*');

    return updatedProject;
  }

  async deleteProject(projectId: string): Promise<void> {
    const project = await this.knexService
      .knex<ProjectI>('projects')
      .where({ id: projectId })
      .first();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.knexService
      .knex<ProjectI>('projects')
      .where({ id: projectId })
      .delete();
  }
}
