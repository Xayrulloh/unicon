import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';
import {
  OrganizationI,
  ProjectI,
  TaskI,
  UserI,
} from 'src/common/interface/basic.interface';

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy {
  public knex: Knex;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.knex = knex({
      client: 'pg',
      connection: this.configService.get('DATABASE_URL'),
    });

    await this.createTablesIfNotExist();

    Logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.knex.destroy();
  }

  async createTablesIfNotExist() {
    await this.knex.raw(`
      DO $$ BEGIN
        CREATE TYPE enum_role AS ENUM ('ADMIN', 'MANAGER', 'STAFF');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await this.knex.raw(`
      DO $$ BEGIN
        CREATE TYPE enum_status AS ENUM ('CREATED', 'IN_PROCESS', 'DONE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    if (!(await this.knex.schema.hasTable('users'))) {
      await this.knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name', 32).notNullable();
        table.specificType('role', 'enum_role').notNullable();
        table
          .integer('created_by')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('SET NULL');
      });
    }

    if (!(await this.knex.schema.hasTable('organizations'))) {
      await this.knex.schema.createTable('organizations', (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table
          .integer('created_by')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('SET NULL');
      });
    }

    if (!(await this.knex.schema.hasTable('organization_user'))) {
      await this.knex.schema.createTable('organization_user', (table) => {
        table.increments('id').primary();
        table
          .integer('organization_id')
          .unsigned()
          .references('id')
          .inTable('organizations')
          .onDelete('CASCADE');
        table
          .integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
      });
    }

    if (!(await this.knex.schema.hasTable('projects'))) {
      await this.knex.schema.createTable('projects', (table) => {
        table.increments('id').primary();
        table
          .integer('organization_id')
          .unsigned()
          .references('id')
          .inTable('organizations')
          .onDelete('CASCADE');
        table
          .integer('created_by')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('SET NULL');
        table.string('name', 255).notNullable();
      });
    }

    if (!(await this.knex.schema.hasTable('tasks'))) {
      await this.knex.schema.createTable('tasks', (table) => {
        table.increments('id').primary();
        table
          .integer('created_by')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('SET NULL');
        table
          .integer('project_id')
          .unsigned()
          .references('id')
          .inTable('projects')
          .onDelete('CASCADE');
        table
          .integer('worker_user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('SET NULL');
        table
          .specificType('status', 'enum_status')
          .notNullable()
          .defaultTo('CREATED');
        table.timestamp('due_date');
        table.timestamp('done_at');
      });
    }
  }

  // DRY PRINCIPLE

  // USER
  async findUserById(id: number, errorMessage?: string): Promise<UserI> {
    const user = await this.knex('users')
      .select<UserI>({
        id: 'users.id',
        name: 'users.name',
        role: 'users.role',
        createdBy: 'users.created_by',
      })
      .where({ id })
      .first();

    if (!user) {
      throw new NotFoundException(errorMessage || 'User not found');
    }

    return user;
  }

  // ORGANIZATION
  async findOrganizationById(
    id: number,
    errorMessage?: string,
  ): Promise<OrganizationI> {
    const organization = await this.knex<OrganizationI>('organizations')
      .where({ id })
      .first();

    if (!organization) {
      throw new NotFoundException(errorMessage || 'Organization not found');
    }

    return organization;
  }

  // PROJECT
  async findProjectById(id: number, errorMessage?: string): Promise<ProjectI> {
    const project = await this.knex('projects')
      .where({ id })
      .select<ProjectI>({
        id: 'projects.id',
        name: 'projects.name',
        createdBy: 'projects.created_by',
        organizationId: 'projects.organization_id',
      })
      .first();

    if (!project) {
      throw new NotFoundException(errorMessage || 'Project not found');
    }

    return project;
  }

  // TASK
  async findTaskById(id: number, errorMessage?: string): Promise<TaskI> {
    const task = await this.knex<TaskI>('tasks')
      .select({
        id: 'tasks.id',
        status: 'tasks.status',
        projectId: 'tasks.project_id',
        workerUserId: 'tasks.worker_user_id',
        createdBy: 'tasks.created_by',
        dueDate: 'tasks.due_date',
        doneAt: 'tasks.done_at',
      })
      .where({ id })
      .first();

    if (!task) {
      throw new NotFoundException(errorMessage || 'Task not found');
    }

    return task;
  }
}
