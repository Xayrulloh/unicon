import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { KnexService } from 'src/database/knex.service';
import { CreateTaskDto, GetTasksForStaff, UpdateTaskDto } from './task.dto';
import { Role, TaskStatus } from 'src/utils/enums';
import { OrganizationUserI, TaskI } from 'src/common/interface/basic.interface';

@Injectable()
export class TaskService {
  constructor(private readonly knexService: KnexService) {}

  async createTask(
    data: CreateTaskDto,
    projectId: number,
    organizationId: number,
  ): Promise<TaskI> {
    await this.checkOrganizationManager(
      organizationId,
      projectId,
      data.createdBy,
    );

    const staff = await this.knexService.findUserById(
      data.workerUserId,
      'Worker not found',
    );

    if (staff.role !== Role.STAFF) {
      throw new BadRequestException('Only staff can be assigned to task');
    }

    const [createdTask] = await this.knexService
      .knex('tasks')
      .insert({
        worker_user_id: data.workerUserId,
        created_by: data.createdBy,
        due_date: data.dueDate,
        project_id: projectId,
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

    return createdTask;
  }

  async getTasksByProject(
    organizationId: number,
    projectId: number,
    createdBy: number,
  ): Promise<TaskI[]> {
    await this.checkOrganizationManager(organizationId, projectId, createdBy);

    return this.knexService
      .knex('tasks')
      .where({
        project_id: projectId,
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
  }

  async getTasksForStaff(
    data: GetTasksForStaff,
    projectId: number,
    organizationId: number,
  ): Promise<TaskI[]> {
    const user = await this.knexService.findUserById(data.workerUserId);

    if (user.role !== Role.STAFF) {
      throw new UnauthorizedException('Only staff can get tasks');
    }

    const project = await this.knexService.findProjectById(projectId);

    if (project.organizationId !== organizationId) {
      throw new UnauthorizedException(
        "This project doesn't exist in this organization",
      );
    }

    return this.knexService
      .knex('tasks')
      .where({
        project_id: projectId,
        status: data.status,
        worker_user_id: data.workerUserId,
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
  }

  async updateTask(
    organizationId: number,
    projectId: number,
    taskId: number,
    data: UpdateTaskDto,
  ): Promise<TaskI> {
    await this.checkOrganizationManager(
      organizationId,
      projectId,
      data.createdBy,
    );

    const task = await this.knexService.findTaskById(taskId);

    if (task.projectId !== projectId) {
      throw new BadRequestException("This task doesn't exist in this project");
    }

    const staff = await this.knexService.findUserById(
      data.workerUserId || task.workerUserId,
      'Worker not found',
    );

    if (staff.role !== Role.STAFF) {
      throw new BadRequestException('Only staff can be assigned to task');
    }

    const [updatedTask] = await this.knexService
      .knex('tasks')
      .where({ id: taskId })
      .update({
        worker_user_id: data.workerUserId || task.workerUserId,
        due_date: data.dueDate || task.dueDate,
        status: data.status || task.status,
        done_at: data.doneAt || task.doneAt,
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

  async accomplishTask(
    organizationId: number,
    projectId: number,
    taskId: number,
    staffId: number,
  ): Promise<TaskI | { message: string }> {
    const staff = await this.knexService.findUserById(
      staffId,
      'Worker not found',
    );

    if (staff.role !== Role.STAFF) {
      throw new UnauthorizedException('Only staff can accomplish task');
    }

    const project = await this.knexService.findProjectById(projectId);

    if (project.organizationId !== organizationId) {
      throw new BadRequestException(
        "This project doesn't exist in this organization",
      );
    }

    const organizationUsers = await this.knexService
      .knex('organization_user')
      .where({ organization_id: organizationId })
      .select<
        OrganizationUserI[]
      >(['id', 'user_id as userId', 'organization_id as organizationId']);

    const isStaff = organizationUsers.find(
      (orgUser) => orgUser.userId === staffId && staff.role === Role.STAFF,
    );

    if (!isStaff) {
      throw new UnauthorizedException("This project doesn't belong to you");
    }

    const task = await this.knexService.findTaskById(taskId);

    if (task.workerUserId !== staffId) {
      throw new UnauthorizedException("This task doesn't belong to you");
    }

    if (task.status === TaskStatus.DONE) {
      throw new BadRequestException('This task is already done');
    }

    const dueDate = new Date(task.dueDate);
    const time = dueDate.getMilliseconds() - Date.now();

    if (time <= 0) {
      return {
        message: 'The time is up',
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

  async deleteTask(
    organizationId: number,
    projectId: number,
    taskId: number,
    createdBy: number,
  ): Promise<void> {
    await this.checkOrganizationManager(organizationId, projectId, createdBy);

    const task = await this.knexService.findTaskById(taskId);

    if (task.projectId !== projectId) {
      throw new BadRequestException("This task doesn't exist in this project");
    }

    await this.knexService.knex<TaskI>('tasks').where({ id: taskId }).delete();
  }

  async checkOrganizationManager(
    organizationId: number,
    projectId: number,
    managerId: number,
  ) {
    const manager = await this.knexService.findUserById(
      managerId,
      'Manager not found',
    );

    if (manager.role !== Role.MANAGER) {
      throw new UnauthorizedException('Only manager can create project');
    }

    const project = await this.knexService.findProjectById(projectId);

    if (project.organizationId !== organizationId) {
      throw new BadRequestException(
        "This project doesn't exist in this organization",
      );
    }

    const organizationUsers = await this.knexService
      .knex('organization_user')
      .where({ organization_id: organizationId })
      .select<
        OrganizationUserI[]
      >(['id', 'user_id as userId', 'organization_id as organizationId']);

    const isManager = organizationUsers.find(
      (orgUser) =>
        orgUser.userId === managerId && manager.role === Role.MANAGER,
    );

    if (!isManager) {
      throw new UnauthorizedException("This project doesn't belong to you");
    }
  }
}
