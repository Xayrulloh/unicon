import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { OrganizationI } from 'src/common/interface/basic.interface';

// Request
export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  createdBy: number;
}

export class UpdateOrganizationDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsNumber()
  createdBy: number;
}

export class AttachStaffOrganizationDto {
  @ApiProperty()
  @IsNumber()
  organizationId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  createdBy: number;
}

// Response
export class FindOrganizationDto implements OrganizationI {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdBy: number;
}
