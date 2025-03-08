import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto, CreateUserDto } from './user.dto';
import { KnexService } from 'src/database/knex.service';
import { Role } from 'src/utils/enums';
import { UserI } from 'src/common/interface/basic.interface';

@Injectable()
export class UserService {
  constructor(private readonly knexService: KnexService) {}

  async findOneUser(id: string): Promise<UserI> {
    return this.knexService.findUserById(id);
  }

  async createAdmin(data: CreateAdminDto): Promise<UserI> {
    const [admin] = await this.knexService
      .knex<UserI>('users')
      .insert({
        name: data.name,
        role: Role.ADMIN,
        created_by: undefined,
      })
      .returning('*');

    return admin;
  }

  async getAllUsers(): Promise<UserI[]> {
    return this.knexService.knex('users').select('*');
  }

  async createUser(data: CreateUserDto): Promise<UserI> {
    const admin = await this.knexService.findUserById(
      data.created_by,
      'Admin not found',
    );

    if (admin.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can create user');
    }

    const [user] = await this.knexService
      .knex<UserI>('users')
      .insert({
        name: data.name,
        role: data.role,
        created_by: data.created_by,
      })
      .returning('*');

    return user;
  }
}
