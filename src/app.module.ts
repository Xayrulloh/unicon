import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/knex.module';
import { EnvModule } from './config/env/env.module';

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
