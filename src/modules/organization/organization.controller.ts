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
import { OrganizationService } from './organization.service';
import {
  AttachStaffOrganizationDto,
  CreateOrganizationDto,
  FindAllOrganizationsDto,
  UpdateOrganizationDto,
} from './organization.dto';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all organization' })
  @ApiResponse({ type: FindAllOrganizationsDto, isArray: true })
  getAllOrganizations(): Promise<FindAllOrganizationsDto[]> {
    return this.service.getAllOrganizations();
  }

  @Post()
  @ApiOperation({ summary: 'Create organization' })
  @ApiCreatedResponse({ type: CreateOrganizationDto })
  createOrganization(
    @Body() data: CreateOrganizationDto,
  ): Promise<CreateOrganizationDto> {
    return this.service.createOrganization(data);
  }

  @Post('attach/staff')
  @ApiOperation({ summary: 'Attach staff to organization' })
  @ApiResponse({ type: AttachStaffOrganizationDto })
  attachStaffOrganization(
    @Body() organization: AttachStaffOrganizationDto,
  ): Promise<AttachStaffOrganizationDto> {
    return this.service.attachStaffOrganization(organization);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse({ type: FindAllOrganizationsDto })
  updateOrganization(
    @Param('id', new ParseUUIDPipe()) organizationId: string,
    @Body() organization: UpdateOrganizationDto,
  ): Promise<FindAllOrganizationsDto> {
    return this.service.updateOrganization(organizationId, organization);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization' })
  @ApiResponse({ type: FindAllOrganizationsDto })
  deleteOrganization(
    @Param('id', new ParseUUIDPipe()) organizationId: string,
  ): Promise<void> {
    return this.service.deleteOrganization(organizationId);
  }
}
