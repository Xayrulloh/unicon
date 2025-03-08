import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto, ProjectDto } from './project.dto';

@ApiTags('Project')
@Controller('projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'get all projects' })
  @ApiResponse({ type: ProjectDto, isArray: true })
  async getAllProjects(): Promise<ProjectDto[]> {
    return this.service.getAllProjects();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({ type: ProjectDto })
  async createProject(@Body() project: CreateProjectDto): Promise<ProjectDto> {
    return this.service.createProject(project);
  }

  @Patch('/:id/manager')
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ type: ProjectDto })
  async updateProject(
    @Param('id', new ParseUUIDPipe()) projectId: string,
    @Body() project: CreateProjectDto,
  ): Promise<ProjectDto> {
    return this.service.updateProject(projectId, project);
  }

  @Delete('/:id/manager')
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ type: ProjectDto })
  async deleteProject(
    @Param('id', new ParseUUIDPipe()) projectId: string,
  ): Promise<void> {
    return this.service.deleteProject(projectId);
  }
}
