import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import { OrganizationStatDto, ProjectStatDto, StatDto } from './statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly knexService: KnexService) {}

  async getStatOrganizationById(
    organizationId: string,
  ): Promise<OrganizationStatDto | { message: string }> {
    const stat = await this.knexService
      .knex('organizations as o')
      .leftJoin('projects as p', 'o.id', 'p.org_id')
      .leftJoin('tasks as t', 'p.id', 't.project_id')
      .select<OrganizationStatDto>(
        'o.id',
        'o.name as organizationName',
        this.knexService.knex.raw('COUNT(DISTINCT p.id) as "projectCount"'),
        this.knexService.knex.raw('COUNT(t.id) as "taskCount"'),
      )
      .where({ id: organizationId })
      .first();

    if (!stat) {
      return { message: 'Either organization not found or there are no tasks' };
    }

    return stat;
  }

  async getStatProjectById(
    projectId: string,
  ): Promise<ProjectStatDto | { message: string }> {
    const stat = await this.knexService
      .knex('projects as p')
      .leftJoin('organizations as o', 'o.id', 'p.org_id')
      .leftJoin('tasks as t', 'p.id', 't.project_id')
      .select(
        'p.id',
        'p.name as projectName',
        'o.name as organizationName',
        this.knexService.knex.raw('COUNT(t.id) as "taskCount"'),
      )
      .where('p.id', projectId)
      .groupBy<ProjectStatDto>('o.id', 'o.name', 'p.id', 'p.name')
      .first();

    if (!stat) {
      return { message: 'Either project not found or there are no tasks' };
    }

    return stat;
  }

  async getAllStat(): Promise<StatDto | { message: string }> {
    const stat = await this.knexService
      .knex('organizations as o')
      .leftJoin('projects as p', 'o.id', 'p.org_id')
      .leftJoin('tasks as t', 'p.id', 't.project_id')
      .select<StatDto>(
        this.knexService.knex.raw(
          'COUNT(DISTINCT o.id) as "organizationCount"',
        ),
        this.knexService.knex.raw('COUNT(DISTINCT p.id) as "projectCount"'),
        this.knexService.knex.raw('COUNT(t.id) as "taskCount"'),
      )
      .first();

    if (!stat) {
      return { message: 'Either organization not found or there are no tasks' };
    }

    return stat;
  }
}
