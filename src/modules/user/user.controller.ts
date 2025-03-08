import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAdminDto, CreateUserDto, FindAllUsersDto } from './user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('admin')
  @ApiOperation({ summary: 'Create admin' })
  @ApiCreatedResponse({ type: FindAllUsersDto })
  createAdmin(@Body() data: CreateAdminDto): Promise<FindAllUsersDto> {
    return this.service.createAdmin(data);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ type: FindAllUsersDto, isArray: true })
  getAllUsers(): Promise<FindAllUsersDto[]> {
    return this.service.getAllUsers();
  }

  @Post()
  @ApiOperation({ summary: 'Create user if you are admin' })
  @ApiCreatedResponse({ type: FindAllUsersDto })
  createUser(@Body() data: CreateUserDto): Promise<FindAllUsersDto> {
    return this.service.createUser(data);
  }
}
