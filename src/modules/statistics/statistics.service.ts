import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import { OrganizationStatDto, ProjectStatDto, StatDto } from './statistics.dto';
import { Role } from 'src/utils/enums';

@Injectable()
export class StatisticsService {
  constructor(private readonly knexService: KnexService) {}

  async getStatOrganizationById(
    organizationId: number,
    adminId: number,
  ): Promise<OrganizationStatDto | { message: string }> {
    await this.checkAdmin(adminId);

    const stat = await this.knexService
      .knex('organizations as o')
      .leftJoin('projects as p', 'o.id', 'p.organization_id')
      .leftJoin('tasks as t', 'p.id', 't.project_id')
      .select<OrganizationStatDto>(
        'o.id',
        'o.name as organizationName',
        this.knexService.knex.raw(
          'COUNT(DISTINCT p.id)::int as "projectCount"',
        ),
        this.knexService.knex.raw('COUNT(t.id)::int as "taskCount"'),
      )
      .where({ 'o.id': organizationId })
      .groupBy('o.id', 'o.name')
      .first();

    if (!stat) {
      return { message: "There's no statistic yet" };
    }

    return stat;
  }

  async getStatProjectById(
    organizationId: number,
    projectId: number,
    adminId: number,
  ): Promise<ProjectStatDto | { message: string }> {
    await this.checkAdmin(adminId);

    const project = await this.knexService.findProjectById(projectId);

    if (project.organizationId !== organizationId) {
      throw new BadRequestException(
        "This project doesn't exist in this organization",
      );
    }

    const stat = await this.knexService
      .knex('projects as p')
      .leftJoin('organizations as o', 'o.id', 'p.organization_id')
      .leftJoin('tasks as t', 'p.id', 't.project_id')
      .select(
        'p.id',
        'p.name as projectName',
        'o.name as organizationName',
        this.knexService.knex.raw('COUNT(t.id)::int as "taskCount"'),
      )
      .where('p.id', projectId)
      .groupBy<ProjectStatDto>('o.id', 'o.name', 'p.id', 'p.name')
      .first();

    if (!stat) {
      return { message: "There's no statistic yet" };
    }

    return stat;
  }

  async getAllStat(adminId: number): Promise<StatDto | { message: string }> {
    await this.checkAdmin(adminId);

    const stat = await this.knexService
      .knex('organizations as o')
      .leftJoin('projects as p', 'o.id', 'p.organization_id')
      .leftJoin('tasks as t', 'p.id', 't.project_id')
      .select<StatDto>(
        this.knexService.knex.raw(
          'COUNT(DISTINCT o.id)::int as "organizationCount"',
        ),
        this.knexService.knex.raw(
          'COUNT(DISTINCT p.id)::int as "projectCount"',
        ),
        this.knexService.knex.raw('COUNT(t.id)::int as "taskCount"'),
      )
      .first();

    if (!stat) {
      return { message: "There's no statistic yet" };
    }

    return stat;
  }

  async checkAdmin(adminId: number) {
    const admin = await this.knexService.findUserById(
      adminId,
      'Admin not found',
    );

    if (admin.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can get organization stat');
    }
  }
}
