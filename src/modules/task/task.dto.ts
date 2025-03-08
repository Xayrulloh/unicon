import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber } from 'class-validator';
import { TaskI } from 'src/common/interface/basic.interface';
import { TaskStatus } from 'src/utils/enums';

// Request
export class CreateTaskDto {
  @ApiProperty()
  @IsNumber()
  projectId: number;

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
  @ApiProperty({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty()
  @IsDateString()
  doneAt: string;
}

export class GetTasksForStaff {
  @ApiProperty({
    required: false,
  })
  workerUserId?: number;

  @ApiProperty({
    required: false,
    enum: TaskStatus,
  })
  status?: TaskStatus;
}

export class GetTasksByProject {
  @ApiProperty({ required: false })
  projectId?: number;
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
