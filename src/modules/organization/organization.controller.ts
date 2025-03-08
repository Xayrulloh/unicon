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
  FindOrganizationDto,
  UpdateOrganizationDto,
} from './organization.dto';
import { OrganizationI } from 'src/common/interface/basic.interface';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all organization' })
  @ApiResponse({ type: FindOrganizationDto, isArray: true })
  getAllOrganizations(): Promise<OrganizationI[]> {
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
  @ApiResponse({ type: FindOrganizationDto })
  updateOrganization(
    @Param('id', new ParseUUIDPipe()) organizationId: string,
    @Body() organization: UpdateOrganizationDto,
  ): Promise<OrganizationI> {
    return this.service.updateOrganization(organizationId, organization);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization' })
  @ApiResponse({ type: FindOrganizationDto })
  deleteOrganization(
    @Param('id', new ParseUUIDPipe()) organizationId: string,
  ): Promise<void> {
    return this.service.deleteOrganization(organizationId);
  }
}
