import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudioProjectService } from './studio-project.service';
import { AuthRank } from '../auth/decorators';

@ApiTags('Studio — Projects')
@ApiBearerAuth()
@Controller('studio/projects')
export class StudioProjectController {
  constructor(private readonly projectService: StudioProjectService) {}

  @Get()
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: List all projects' })
  async listProjects(@Request() req: { user: { id: string } }) {
    return this.projectService.listProjects(req.user.id);
  }

  @Get(':id')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Get project details' })
  async getProject(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.projectService.getProject(req.user.id, id);
  }

  @Get(':id/files')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: List project files' })
  async getFiles(
    @Request() req: { user: { id: string } },
    @Param('id') projectId: string,
    @Query('category') category?: string,
  ) {
    return this.projectService.getProjectFiles(req.user.id, projectId, category);
  }
}
