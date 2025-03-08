import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAdminDto, CreateUserDto, FindUserDto } from './user.dto';
import { UserService } from './user.service';
import { UserI } from 'src/common/interface/basic.interface';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('admin')
  @ApiOperation({ summary: 'Create admin' })
  @ApiCreatedResponse({ type: FindUserDto })
  createAdmin(@Body() data: CreateAdminDto): Promise<UserI> {
    return this.service.createAdmin(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ type: FindUserDto, isArray: true })
  getAllUsers(): Promise<UserI[]> {
    return this.service.getAllUsers();
  }

  @Post()
  @ApiOperation({ summary: 'Create user if you are admin' })
  @ApiCreatedResponse({ type: FindUserDto })
  createUser(@Body() data: CreateUserDto): Promise<UserI> {
    return this.service.createUser(data);
  }
}
