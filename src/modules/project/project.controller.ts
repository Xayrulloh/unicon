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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto, FindProjectDto } from './project.dto';
import { ProjectI } from 'src/common/interface/basic.interface';

@ApiTags('Project')
@Controller('organizations')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Get('/:organizationId/projects')
  @ApiOperation({ summary: 'Get organization projects' })
  @ApiResponse({ type: FindProjectDto, isArray: true })
  async getAllProjects(
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
  ): Promise<FindProjectDto[]> {
    return this.service.getAllProjects(organizationId);
  }

  @Post('/:organizationId/projects')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({ type: FindProjectDto })
  async createProject(
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
    @Body() project: CreateProjectDto,
  ): Promise<ProjectI> {
    return this.service.createProject(organizationId, project);
  }

  @Patch('/:organizationId/projects/:id')
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ type: FindProjectDto })
  async updateProject(
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
    @Param('id', new ParseIntPipe()) projectId: number,
    @Body() project: CreateProjectDto,
  ): Promise<ProjectI> {
    return this.service.updateProject(organizationId, projectId, project);
  }

  @Delete('/:organizationId/projects/:id')
  @ApiQuery({ name: 'createdBy', type: Number, required: true })
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ type: FindProjectDto })
  async deleteProject(
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
    @Param('id', new ParseIntPipe()) projectId: number,
    @Query('createdBy', new ParseIntPipe()) createdBy: number,
  ): Promise<void> {
    return this.service.deleteProject(organizationId, projectId, createdBy);
  }
}
