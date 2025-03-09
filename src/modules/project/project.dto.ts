import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ProjectI } from 'src/common/interface/basic.interface';

// Request
export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  createdBy: number;
}

export class UpdateProjectDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNumber()
  createdBy: number;
}

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
