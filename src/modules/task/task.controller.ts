import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  CreateTaskDto,
  GetTasksForStaff,
  FindTaskDto,
  UpdateTaskDto,
} from './task.dto';
import { TaskI } from 'src/common/interface/basic.interface';

ApiTags('Task');
@Controller('organizations')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Get(':organizationId/projects/:projectId/tasks')
  @ApiOperation({ summary: 'Get tasks by project' })
  @ApiResponse({ type: FindTaskDto, isArray: true })
  async getTaskByProject(
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
    @Param('projectId', new ParseIntPipe()) projectId: number,
    @Query('createdBy', new ParseIntPipe()) createdBy: number,
  ): Promise<TaskI[]> {
    return this.service.getTasksByProject(organizationId, projectId, createdBy);
  }

  @Post(':organizationId/projects/:projectId/tasks')
  @ApiOperation({ summary: 'Create task' })
  @ApiCreatedResponse({ type: FindTaskDto })
  async createTask(
    @Param('projectId', new ParseIntPipe()) projectId: number,
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
    @Body() task: CreateTaskDto,
  ): Promise<TaskI> {
    return this.service.createTask(task, projectId, organizationId);
  }

  @Patch(':organizationId/projects/:projectId/tasks/:taskId')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ type: FindTaskDto })
  async updateTask(
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
    @Param('projectId', new ParseIntPipe()) projectId: number,
    @Param('taskId', new ParseIntPipe()) taskId: number,
    @Body() task: UpdateTaskDto,
  ): Promise<TaskI> {
    return this.service.updateTask(organizationId, projectId, taskId, task);
  }

  @Delete(':organizationId/projects/:projectId/tasks/:taskId')
  @ApiOperation({ summary: 'Delete task' })
  async deleteTask(
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
    @Param('projectId', new ParseIntPipe()) projectId: number,
    @Param('taskId', new ParseIntPipe()) taskId: number,
    @Query('createdBy', new ParseIntPipe()) createdBy: number,
  ): Promise<void> {
    return this.service.deleteTask(
      organizationId,
      projectId,
      taskId,
      createdBy,
    );
  }

  @Get(':organizationId/projects/:projectId/tasks/staff')
  @ApiOperation({ summary: 'Get staff project tasks' })
  @ApiResponse({ type: FindTaskDto, isArray: true })
  async getTasksForStaff(
    @Query() query: GetTasksForStaff,
    @Param('projectId', new ParseIntPipe()) projectId: number,
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
  ): Promise<TaskI[]> {
    return this.service.getTasksForStaff(query, projectId, organizationId);
  }

  @Post(':organizationId/projects/:projectId/tasks/:taskId/staff/accomplish')
  @ApiOperation({ summary: 'Accomplish task' })
  @ApiCreatedResponse({ type: FindTaskDto })
  async accomplishTask(
    @Param('projectId', new ParseIntPipe()) projectId: number,
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
    @Param('taskId', new ParseIntPipe()) taskId: number,
    @Query('staffId', new ParseIntPipe()) staffId: number,
  ): Promise<TaskI | { message: string }> {
    return this.service.accomplishTask(
      organizationId,
      projectId,
      taskId,
      staffId,
    );
  }
}
