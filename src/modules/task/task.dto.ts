import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsUUID } from 'class-validator';
import { TaskI } from 'src/common/interface/basic.interface';
import { TaskStatus } from 'src/utils/enums';

// Request
export class CreateFindTaskDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsUUID()
  workerUserId: string;

  @ApiProperty()
  @IsUUID()
  createdBy: string;

  @ApiProperty()
  @IsDateString()
  dueDate: string;
}

export class UpdateFindTaskDto {
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
  workerUserId?: string;

  @ApiProperty({
    required: false,
    enum: TaskStatus,
  })
  status?: TaskStatus;
}

export class GetTasksByProject {
  @ApiProperty({ required: false })
  projectId?: string;
}

// Response

export class FindTaskDto implements TaskI {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  workerUserId: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  dueDate: string;

  @ApiProperty()
  doneAt: string;
}
