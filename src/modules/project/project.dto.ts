import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { ProjectI } from 'src/common/interface/basic.interface';

// Request
export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  organizationId: number;

  @ApiProperty()
  @IsNumber()
  createdBy: number;
}

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['organizationId'] as const),
) {}

// Response
export class FindProjectDto implements ProjectI {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  organizationId: number;

  @ApiProperty()
  createdBy: number;
}
