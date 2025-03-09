## Description

# Project Management API

This API provides functionality for managing users, organizations, projects, tasks, and statistics. It supports role-based access control (RBAC) with different permissions for **Admin**, **Manager**, and **Staff** roles.

---

## Overview

The system is structured as follows:

- **Users**: Manage users and their roles.
- **Organizations**: Organizations can be created and managed by Admins. Staff can be attached to organizations.
- **Projects**: Projects belong to organizations and can be managed by Managers.
- **Tasks**: Tasks belong to projects and can be created, updated, or deleted by Managers. Staff can update task statuses.
- **Statistics**: Admins can view statistics for organizations, projects, and overall system usage.

---

## Endpoints

### Users
- **POST** `/users/admin`  
  Create an admin user. (*)
- **GET** `/users`  
  Get all users. (*)
- **POST** `/users`  
  Create a staff user. (ADMIN)

### Organizations
- **POST** `/organizations`  
  Create an organization. (ADMIN)
- **GET** `/organizations`  
  Get all organizations. (*)
- **POST** `/organizations/staff`  
  Attach staff to an organization. (ADMIN)
- **PATCH** `/organizations`  
  Update an organization. (ADMIN)
- **DELETE** `/organizations`  
  Delete an organization. (ADMIN)

### Projects
- **POST** `/organizations/:organizationId/projects`  
  Create a project. (MANAGER)
- **GET** `/organizations/:organizationId/projects`  
  Get all projects in an organization. (MANAGER)
- **PATCH** `/organizations/:organizationId/projects/:projectId`  
  Update a project. (MANAGER)
- **DELETE** `/organizations/:organizationId/projects/:projectId`  
  Delete a project. (MANAGER)

### Tasks
- **POST** `/organizations/:organizationId/projects/:projectId/tasks`  
  Create a task. (MANAGER)
- **GET** `/organizations/:organizationId/projects/:projectId/tasks`  
  Get all tasks in a project. (MANAGER)
- **PATCH** `/organizations/:organizationId/projects/:projectId/tasks/:taskId`  
  Update a task. (MANAGER)
- **DELETE** `/organizations/:organizationId/projects/:projectId/tasks/:taskId`  
  Delete a task. (MANAGER)
- **GET** `/organizations/:organizationId/projects/:projectId/tasks/staff?status=string`  
  Get all tasks for staff based on status. (STAFF)
- **POST** `/organizations/:organizationId/projects/:projectId/tasks/staff/finished`  
  Update task status (e.g., mark as finished). (STAFF)

### Statistics
- **GET** `/statistics/organizations/:organizationId`  
  Get statistics for an organization. (ADMIN)
- **GET** `/statistics/organizations/:organizationId/projects/:projectId`  
  Get statistics for a project. (ADMIN)
- **GET** `/statistics`  
  Get overall system statistics. (ADMIN)

---

## Roles & Permissions

- **Admin**:
  - Can create and manage organizations.
  - Can create and manage users.
  - Can view statistics for organizations, projects, and overall system usage.

- **Manager**:
  - Can create, update, and delete projects.
  - Can create, update, and delete tasks.
  - Can assign tasks to staff.

- **Staff**:
  - Can view tasks assigned to them.
  - Can update the status of tasks (e.g., mark as finished).

- **Public (*)**:
  - Some endpoints are accessible without authentication (e.g., creating an admin user or listing organizations).

---

## Notes
- Replace `:organizationId`, `:projectId`, and `:taskId` with actual IDs in the URLs.

---

# Project setup

```bash
$ pnpm install
```

# Env

Copy `.env.example` to `.env` file

```bash
$ cp .env.example .env
```

# Docker Compose

Run the following command to start the container

```bash
$ docker compose up -d
```

Run the following command to stop the container

```bash
$ docker compose down
```

# Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

# Docs Swagger

**http://localhost:8080/docs** or **http://localhost:${PORT}/docs/**