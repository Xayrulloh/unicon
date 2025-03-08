import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto, CreateUserDto, FindAllUsersDto } from './user.dto';
import { KnexService } from 'src/database/knex.service';
import { Role } from 'src/utils/enums';

@Injectable()
export class UserService {
  constructor(private readonly knexService: KnexService) {}

  async findOneUser(id: string): Promise<FindAllUsersDto> {
    const user = (await this.knexService
      .knex('users')
      .where({ id })
      .first()) as FindAllUsersDto;

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async createAdmin(data: CreateAdminDto): Promise<FindAllUsersDto> {
    const [admin] = (await this.knexService
      .knex('users')
      .insert({
        name: data.name,
        role: Role.ADMIN,
        created_by: null,
      })
      .returning('*')) as FindAllUsersDto[];

    return admin;
  }

  async getAllUsers(): Promise<FindAllUsersDto[]> {
    const users = (await this.knexService
      .knex('users')
      .select('*')) as FindAllUsersDto[];

    return users;
  }

  async createUser(data: CreateUserDto): Promise<FindAllUsersDto> {
    const admin = (await this.knexService
      .knex('users')
      .where({ id: data.created_by })
      .first()) as FindAllUsersDto;

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (admin.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admin can create user');
    }

    const [user] = (await this.knexService
      .knex('users')
      .insert({
        name: data.name,
        role: data.role,
        created_by: data.created_by,
      })
      .returning('*')) as FindAllUsersDto[];

    return user;
  }
}
