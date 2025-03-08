import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy {
  public knex: Knex;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.knex = knex({
      client: 'pg',
      connection: this.configService.get('DATABASE_URL'),
    });

    // Create tables if they don't exist
    await this.createTablesIfNotExist();

    console.info('KnexService onModuleInit initialized');
  }

  async onModuleDestroy() {
    await this.knex.destroy();
  }

  async createTablesIfNotExist() {
    // Create enum types if they don't exist
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

    // Create uuid-ossp extension if it doesn't exist
    await this.knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Create users table if it doesn't exist
    if (!(await this.knex.schema.hasTable('users'))) {
      await this.knex.schema.createTable('users', (table) => {
        table
          .uuid('id')
          .primary()
          .defaultTo(this.knex.raw('uuid_generate_v4()'));
        table.string('name', 32).notNullable();
        table.specificType('role', 'enum_role').notNullable();
        table
          .uuid('created_by')
          .references('id')
          .inTable('users')
          .onDelete('SET NULL');
        table.timestamp('created_at').defaultTo(this.knex.fn.now());
      });
    }

    // Create organizations table if it doesn't exist
    if (!(await this.knex.schema.hasTable('organizations'))) {
      await this.knex.schema.createTable('organizations', (table) => {
        table
          .uuid('id')
          .primary()
          .defaultTo(this.knex.raw('uuid_generate_v4()'));
        table.string('name', 255).notNullable();
        table
          .uuid('created_by')
          .references('id')
          .inTable('users')
          .onDelete('SET NULL');
        table.timestamp('created_at').defaultTo(this.knex.fn.now());
      });
    }

    // Create organization_user table if it doesn't exist
    if (!(await this.knex.schema.hasTable('organization_user'))) {
      await this.knex.schema.createTable('organization_user', (table) => {
        table
          .uuid('id')
          .primary()
          .defaultTo(this.knex.raw('uuid_generate_v4()'));
        table
          .uuid('org_id')
          .references('id')
          .inTable('organizations')
          .onDelete('CASCADE');
        table
          .uuid('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(this.knex.fn.now());
      });
    }

    // Create projects table if it doesn't exist
    if (!(await this.knex.schema.hasTable('projects'))) {
      await this.knex.schema.createTable('projects', (table) => {
        table
          .uuid('id')
          .primary()
          .defaultTo(this.knex.raw('uuid_generate_v4()'));
        table
          .uuid('org_id')
          .references('id')
          .inTable('organizations')
          .onDelete('CASCADE');
        table
          .uuid('created_by')
          .references('id')
          .inTable('users')
          .onDelete('SET NULL');
        table.string('name', 255).notNullable();
        table.timestamp('created_at').defaultTo(this.knex.fn.now());
      });
    }

    // Create tasks table if it doesn't exist
    if (!(await this.knex.schema.hasTable('tasks'))) {
      await this.knex.schema.createTable('tasks', (table) => {
        table
          .uuid('id')
          .primary()
          .defaultTo(this.knex.raw('uuid_generate_v4()'));
        table
          .uuid('created_by')
          .references('id')
          .inTable('users')
          .onDelete('SET NULL');
        table
          .uuid('project_id')
          .references('id')
          .inTable('projects')
          .onDelete('CASCADE');
        table
          .uuid('worker_user_id')
          .references('id')
          .inTable('users')
          .onDelete('SET NULL');
        table
          .specificType('status', 'enum_status')
          .notNullable()
          .defaultTo('CREATED');
        table.timestamp('due_date');
        table.timestamp('done_at');
        table.timestamp('created_at').defaultTo(this.knex.fn.now());
      });
    }
  }
}
