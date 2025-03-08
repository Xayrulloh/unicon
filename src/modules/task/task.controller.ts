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
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import {
  CreateFindTaskDto,
  GetTasksByProject,
  GetTasksForStaff,
  FindTaskDto,
  UpdateFindTaskDto,
} from './task.dto';
import { TaskI } from 'src/common/interface/basic.interface';

ApiTags('Task');
@Controller('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ type: FindTaskDto, isArray: true })
  async getTasksForStaff(@Query() query: GetTasksForStaff): Promise<TaskI[]> {
    return this.service.getTasksForStaff(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiCreatedResponse({ type: FindTaskDto })
  async createTask(@Body() task: CreateFindTaskDto): Promise<TaskI> {
    return this.service.createTask(task);
  }

  @Patch('/:taskId')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ type: FindTaskDto })
  async updateTask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() task: UpdateFindTaskDto,
  ): Promise<TaskI> {
    return this.service.updateTask(taskId, task);
  }

  @Post('/accomplish/:taskId')
  @ApiOperation({ summary: 'Accomplish task' })
  @ApiCreatedResponse({ type: FindTaskDto })
  async accomplishTask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
  ): Promise<TaskI | { message: string }> {
    return this.service.accomplishTask(taskId);
  }

  @Get('/:projectId')
  @ApiOperation({ summary: 'Get tasks by project' })
  @ApiResponse({ type: FindTaskDto, isArray: true })
  async getTaskByProject(@Query() query: GetTasksByProject): Promise<TaskI[]> {
    return this.service.getTasksByProject(query);
  }

  @Delete('/:id/manager')
  @ApiOperation({ summary: 'Delete task' })
  async deleteTask(
    @Param('id', new ParseUUIDPipe()) taskId: string,
  ): Promise<void> {
    return this.service.deleteTask(taskId);
  }
}
