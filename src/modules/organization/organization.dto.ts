import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { OrganizationI } from 'src/common/interface/basic.interface';

// Request
export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  created_by: string;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}

export class AttachStaffOrganizationDto {
  @ApiProperty()
  @IsUUID()
  organizationId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  created_by: string;
}

// Response
export class FindOrganizationDto implements OrganizationI {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_by: string;
}
