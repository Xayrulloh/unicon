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

  @Post('create/admin')
  @ApiOperation({ summary: 'admin create' })
  @ApiCreatedResponse({ type: FindAllUsersDto })
  createAdmin(@Body() data: CreateAdminDto): Promise<FindAllUsersDto> {
    return this.service.createAdmin(data);
  }

  @Get('get/list')
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({ type: FindAllUsersDto, isArray: true })
  getAllUsers(): Promise<FindAllUsersDto[]> {
    return this.service.getAllUsers();
  }

  @Post('create')
  @ApiOperation({ summary: 'user create' })
  @ApiCreatedResponse({ type: FindAllUsersDto })
  createUser(@Body() data: CreateUserDto): Promise<FindAllUsersDto> {
    return this.service.createUser(data);
  }
}
