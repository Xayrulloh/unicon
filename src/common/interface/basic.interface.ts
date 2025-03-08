import { Role, TaskStatus } from 'src/utils/enums';

export interface UserI {
  id: string;
  name: string;
  role: Role;
  created_by: string;
}

export interface TaskI {
  id: string;
  status: TaskStatus;
  project_id: string;
  worker_user_id: string;
  created_by: string;
  due_date: string;
  done_at: string;
}

export interface ProjectI {
  id: string;
  name: string;
  organizationId: string;
  created_by: string;
}

export interface OrganizationI {
  id: string;
  name: string;
  created_by: string;
}
