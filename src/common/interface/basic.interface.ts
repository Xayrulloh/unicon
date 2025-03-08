import { Role, TaskStatus } from 'src/utils/enums';

export interface UserI {
  id: number;
  name: string;
  role: Role;
  createdBy: number;
}

export interface TaskI {
  id: number;
  status: TaskStatus;
  projectId: number;
  workerUserId: number;
  createdBy: number;
  dueDate: string;
  doneAt: string;
}

export interface ProjectI {
  id: number;
  name: string;
  organizationId: number;
  createdBy: number;
}

export interface OrganizationI {
  id: number;
  name: string;
  createdBy: number;
}

export interface OrganizationUserI {
  id: number;
  organizationId: number;
  userId: number;
}
