import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { OrganizationStatDto, ProjectStatDto, StatDto } from './statistics.dto';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  @Get()
  @ApiOperation({ summary: 'get all statistics' })
  @ApiResponse({ type: StatDto })
  getAllStat(
    @Query('adminId', new ParseIntPipe()) adminId: number,
  ): Promise<StatDto | { message: string }> {
    return this.service.getAllStat(adminId);
  }

  @Get('organizations/:id')
  @ApiOperation({ summary: 'Get statistics for organization' })
  @ApiResponse({ type: OrganizationStatDto })
  getStatOrganizationById(
    @Param('id', new ParseIntPipe()) organizationId: number,
    @Query('adminId', new ParseIntPipe()) adminId: number,
  ): Promise<OrganizationStatDto | { message: string }> {
    return this.service.getStatOrganizationById(organizationId, adminId);
  }

  @Get('organizations/:organizationId/projects/:id')
  @ApiOperation({ summary: 'get statistics for project' })
  @ApiResponse({ type: ProjectStatDto })
  getStatProjectById(
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
    @Param('id', new ParseIntPipe()) projectId: number,
    @Query('adminId', new ParseIntPipe()) adminId: number,
  ): Promise<ProjectStatDto | { message: string }> {
    return this.service.getStatProjectById(organizationId, projectId, adminId);
  }
}
