import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TaskI } from 'src/common/interface/basic.interface';
import { TaskStatus } from 'src/utils/enums';

// Request
export class CreateTaskDto {
  @ApiProperty()
  @IsNumber()
  workerUserId: number;

  @ApiProperty()
  @IsNumber()
  createdBy: number;

  @ApiProperty()
  @IsDateString()
  dueDate: string;
}

export class UpdateTaskDto {
  @ApiProperty({ enum: TaskStatus, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  doneAt?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  workerUserId?: number;

  @ApiProperty()
  @IsNumber()
  createdBy: number;
}

export class GetTasksForStaff {
  @ApiProperty()
  workerUserId: number;

  @ApiProperty({
    enum: TaskStatus,
  })
  status: TaskStatus;
}

// Response

export class FindTaskDto implements TaskI {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  workerUserId: number;

  @ApiProperty()
  createdBy: number;

  @ApiProperty()
  dueDate: string;

  @ApiProperty()
  doneAt: string;
}
