import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/knex.module';
import { EnvModule } from './config/env/env.module';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ProjectModule } from './modules/project/project.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    UserModule,
    OrganizationModule,
    ProjectModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
