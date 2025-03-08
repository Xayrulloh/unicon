import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';
import { ProjectI } from 'src/common/interface/basic.interface';

// Request
export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  @IsUUID()
  created_by: string;
}

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['organizationId'] as const),
) {}

// Response
export class FindProjectDto implements ProjectI {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  created_by: string;
}
