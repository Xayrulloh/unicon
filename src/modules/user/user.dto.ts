import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { UserI } from 'src/common/interface/basic.interface';
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
  createdBy: string;
}

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  name: string;
}

// Response
export class FindUserDto implements UserI {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  createdBy: string;
}
