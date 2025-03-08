import { Injectable, NotFoundException } from '@nestjs/common';

import { KnexService } from 'src/database/knex.service';
import {
  CreateFindTaskDto,
  GetTasksByProject,
  GetTasksForStaff,
  UpdateFindTaskDto,
} from './task.dto';
import { FindUserDto } from '../user/user.dto';
import { TaskStatus } from 'src/utils/enums';
import { TaskI } from 'src/common/interface/basic.interface';

@Injectable()
export class TaskService {
  constructor(private readonly knexService: KnexService) {}

  async createTask(data: CreateFindTaskDto): Promise<TaskI> {
    const creator = await this.knexService
      .knex<FindUserDto>('users')
      .where({ id: data.created_by })
      .first();

    if (!creator) throw new NotFoundException('Manager not found');

    const project = await this.knexService
      .knex<TaskI>('projects')
      .where({ id: data.projectId })
      .first();

    if (!project) throw new NotFoundException('Project not found');

    const worker = await this.knexService
      .knex<FindUserDto>('users')
      .where({ id: data.workerUserId })
      .first();

    if (!worker) throw new NotFoundException('Worker not found');

    const [createdTask] = await this.knexService
      .knex<TaskI>('tasks')
      .insert(data)
      .returning('*');

    return createdTask;
  }

  async getTasksByProject(data: GetTasksByProject): Promise<TaskI[]> {
    return this.knexService.knex<TaskI>('tasks').where(data).returning('*');
  }

  async getTasksForStaff(data: GetTasksForStaff): Promise<TaskI[]> {
    return this.knexService.knex<TaskI>('tasks').where(data).returning('*');
  }

  async updateTask(taskId: string, data: UpdateFindTaskDto): Promise<TaskI> {
    const task = await this.knexService
      .knex<TaskI>('tasks')
      .where({ id: taskId })
      .first();

    if (!task) throw new NotFoundException('Task not found');

    const creator = await this.knexService
      .knex<FindUserDto>('users')
      .where({ id: task.created_by })
      .first();

    if (!creator) throw new NotFoundException('Manager not found');

    const project = await this.knexService
      .knex<TaskI>('projects')
      .where({ id: task.project_id })
      .first();

    if (!project) throw new NotFoundException('Project not found');

    const worker = await this.knexService
      .knex<FindUserDto>('users')
      .where({ id: task.worker_user_id })
      .first();

    if (!worker) throw new NotFoundException('Worker not found');

    const [updatedTask] = await this.knexService
      .knex<TaskI>('tasks')
      .where({ id: taskId })
      .update(data)
      .returning('*');

    return updatedTask;
  }

  async accomplishTask(taskId: string): Promise<TaskI | { message: string }> {
    const task = await this.knexService
      .knex<TaskI>('tasks')
      .where({ id: taskId })
      .first();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const dueDate = new Date(task.due_date);
    const time = Date.now() - dueDate.getMilliseconds();

    if (time <= 0) {
      return {
        message: 'Time is up',
      };
    }

    const [updatedTask] = await this.knexService
      .knex<TaskI>('tasks')
      .where({ id: taskId })
      .update({
        status: TaskStatus.DONE,
        done_at: new Date().toISOString(),
      })
      .returning('*');

    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.knexService.knex<TaskI>('tasks').where({ id: taskId }).delete();
  }
}
