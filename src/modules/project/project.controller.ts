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
import { CreateProjectDto, FindProjectDto } from './project.dto';
import { ProjectI } from 'src/common/interface/basic.interface';

@ApiTags('Project')
@Controller('projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ type: FindProjectDto, isArray: true })
  async getAllProjects(): Promise<FindProjectDto[]> {
    return this.service.getAllProjects();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({ type: FindProjectDto })
  async createProject(@Body() project: CreateProjectDto): Promise<ProjectI> {
    return this.service.createProject(project);
  }

  @Patch('/:id/manager')
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ type: FindProjectDto })
  async updateProject(
    @Param('id', new ParseUUIDPipe()) projectId: string,
    @Body() project: CreateProjectDto,
  ): Promise<ProjectI> {
    return this.service.updateProject(projectId, project);
  }

  @Delete('/:id/manager')
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ type: FindProjectDto })
  async deleteProject(
    @Param('id', new ParseUUIDPipe()) projectId: string,
  ): Promise<void> {
    return this.service.deleteProject(projectId);
  }
}
