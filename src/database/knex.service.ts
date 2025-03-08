import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy {
  public knex: Knex;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.knex = knex({
      client: 'pg',
      connection: this.configService.get('DATABASE_URL'),
    });
  }

  async onModuleDestroy() {
    await this.knex.destroy();
  }
}
