import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import {
  CreateTaskDto,
  GetTasksByProject,
  GetTasksForStaff,
  TaskDto,
  UpdateTaskDto,
} from './task.dto';

ApiTags('Task');
@Controller('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  async getTasksForStaff(@Query() query: GetTasksForStaff): Promise<TaskDto[]> {
    return this.service.getTasksForStaff(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create task' })
  async createTask(@Body() task: CreateTaskDto): Promise<TaskDto> {
    return this.service.createTask(task);
  }

  @Patch('/:taskId')
  @ApiOperation({ summary: 'Update task' })
  async updateTask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() task: UpdateTaskDto,
  ): Promise<TaskDto> {
    return this.service.updateTask(taskId, task);
  }

  @Post('/accomplish/:taskId')
  @ApiOperation({ summary: 'Accomplish task' })
  async accomplishTask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
  ): Promise<TaskDto | { message: string }> {
    return this.service.accomplishTask(taskId);
  }

  @Get('/:projectId')
  async getTaskByProject(@Query() query: GetTasksByProject) {
    return this.service.getTasksByProject(query);
  }

  @Delete('/:id/manager')
  async deleteTask(
    @Param('id', new ParseUUIDPipe()) taskId: string,
  ): Promise<void> {
    return this.service.deleteTask(taskId);
  }
}
