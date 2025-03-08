import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/knex.module';
import { EnvModule } from './config/env/env.module';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';

@Module({
  imports: [EnvModule, DatabaseModule, UserModule, OrganizationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
