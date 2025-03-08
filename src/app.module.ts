import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/knex.module';
import { EnvModule } from './config/env/env.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [EnvModule, DatabaseModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
