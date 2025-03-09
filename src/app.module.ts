import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/knex.module';
import { EnvModule } from './config/env/env.module';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ProjectModule } from './modules/project/project.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    UserModule,
    OrganizationModule,
    ProjectModule,
    TaskModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
