import { Injectable } from '@nestjs/common';

import { KnexService } from 'src/database/knex.service';
import {
  CreateFindTaskDto,
  GetTasksByProject,
  GetTasksForStaff,
  UpdateFindTaskDto,
} from './task.dto';
import { TaskStatus } from 'src/utils/enums';
import { TaskI } from 'src/common/interface/basic.interface';

@Injectable()
export class TaskService {
  constructor(private readonly knexService: KnexService) {}

  async createTask(data: CreateFindTaskDto): Promise<TaskI> {
    await this.knexService.findUserById(data.createdBy, 'Manager not found');

    await this.knexService.findProjectById(data.projectId);

    await this.knexService.findUserById(data.workerUserId, 'Worker not found');

    const [createdTask] = await this.knexService
      .knex('tasks')
      .insert(data)
      .returning<
        TaskI[]
      >(['id', 'status', 'project_id as projectId', 'worker_user_id as workerUserId', 'created_by as createdBy', 'due_date as dueDate', 'done_at as doneAt']);

    return createdTask;
  }

  async getTasksByProject(data: GetTasksByProject): Promise<TaskI[]> {
    return this.knexService
      .knex('tasks')
      .where(data)
      .returning<
        TaskI[]
      >(['id', 'status', 'project_id as projectId', 'worker_user_id as workerUserId', 'created_by as createdBy', 'due_date as dueDate', 'done_at as doneAt']);
  }

  async getTasksForStaff(data: GetTasksForStaff): Promise<TaskI[]> {
    return this.knexService
      .knex('tasks')
      .where(data)
      .returning<
        TaskI[]
      >(['id', 'status', 'project_id as projectId', 'worker_user_id as workerUserId', 'created_by as createdBy', 'due_date as dueDate', 'done_at as doneAt']);
  }

  async updateTask(taskId: string, data: UpdateFindTaskDto): Promise<TaskI> {
    const task = await this.knexService.findTaskById(taskId);

    await this.knexService.findUserById(task.createdBy, 'Manager not found');

    await this.knexService.findProjectById(task.projectId);

    await this.knexService.findUserById(task.workerUserId, 'Worker not found');

    const [updatedTask] = await this.knexService
      .knex('tasks')
      .where({ id: taskId })
      .update(data)
      .returning<
        TaskI[]
      >(['id', 'status', 'project_id as projectId', 'worker_user_id as workerUserId', 'created_by as createdBy', 'due_date as dueDate', 'done_at as doneAt']);

    return updatedTask;
  }

  async accomplishTask(taskId: string): Promise<TaskI | { message: string }> {
    const task = await this.knexService.findTaskById(taskId);

    const dueDate = new Date(task.dueDate);
    const time = Date.now() - dueDate.getMilliseconds();

    if (time <= 0) {
      return {
        message: 'Time is up',
      };
    }

    const [updatedTask] = await this.knexService
      .knex('tasks')
      .where({ id: taskId })
      .update({
        status: TaskStatus.DONE,
        done_at: new Date().toISOString(),
      })
      .returning<TaskI[]>([
        'id',
        'status',
        'project_id as projectId',
        'worker_user_id as workerUserId',
        'created_by as createdBy',
        'due_date as dueDate',
        'done_at as doneAt',
      ]);

    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.knexService.findTaskById(taskId);

    await this.knexService.knex<TaskI>('tasks').where({ id: taskId }).delete();
  }
}
