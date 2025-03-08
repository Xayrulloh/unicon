import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { OrganizationStatDto, ProjectStatDto, StatDto } from './statistics.dto';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  @Get('organization/:id')
  @ApiOperation({ summary: 'get statistics by organization id' })
  @ApiResponse({ type: OrganizationStatDto })
  getStatOrganizationById(
    @Param('id', new ParseUUIDPipe()) organizationId: string,
  ): Promise<OrganizationStatDto | { message: string }> {
    return this.service.getStatOrganizationById(organizationId);
  }

  @Get('project/:id')
  @ApiOperation({ summary: 'get statistics by project id' })
  @ApiResponse({ type: ProjectStatDto })
  getStatProjectById(
    @Param('id', new ParseUUIDPipe()) projectId: string,
  ): Promise<ProjectStatDto | { message: string }> {
    return this.service.getStatProjectById(projectId);
  }

  @Get('all')
  @ApiOperation({ summary: 'get all statistics' })
  @ApiResponse({ type: StatDto })
  getAllStat(): Promise<StatDto | { message: string }> {
    return this.service.getAllStat();
  }
}
