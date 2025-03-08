import { Role, TaskStatus } from 'src/utils/enums';

export interface UserI {
  id: string;
  name: string;
  role: Role;
  createdBy: string;
}

export interface TaskI {
  id: string;
  status: TaskStatus;
  projectId: string;
  workerUserId: string;
  createdBy: string;
  dueDate: string;
  doneAt: string;
}

export interface ProjectI {
  id: string;
  name: string;
  organizationId: string;
  createdBy: string;
}

export interface OrganizationI {
  id: string;
  name: string;
  createdBy: string;
}

export interface OrganizationUserI {
  id: string;
  organizationId: string;
  userId: string;
}
