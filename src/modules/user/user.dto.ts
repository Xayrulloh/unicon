import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { Role } from 'src/utils/enums';

// Request
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  @IsUUID()
  created_by: string;
}

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  name: string;
}

// Response
export class FindAllUsersDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  created_by: string;
}
