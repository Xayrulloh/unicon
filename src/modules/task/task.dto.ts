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
  created_by: string;

  @ApiProperty()
  @IsDateString()
  due_date: string;
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
  project_id: string;

  @ApiProperty()
  worker_user_id: string;

  @ApiProperty()
  created_by: string;

  @ApiProperty()
  due_date: string;

  @ApiProperty()
  done_at: string;
}
