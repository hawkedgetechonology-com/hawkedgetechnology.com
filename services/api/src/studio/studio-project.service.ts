import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class StudioProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async listProjects(userId: string) {
    return this.prisma.project.findMany({
      where: { clientId: userId },
      include: {
        milestones: { orderBy: { createdAt: 'asc' } },
        invoices: true,
        files: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getProject(userId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, clientId: userId },
      include: {
        milestones: { orderBy: { createdAt: 'asc' } },
        invoices: { orderBy: { createdAt: 'desc' } },
        files: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!project) throw new NotFoundException('Project not found.');
    return project;
  }

  async getProjectFiles(userId: string, projectId: string, category?: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, clientId: userId },
    });
    if (!project) throw new NotFoundException('Project not found.');

    const where: Record<string, unknown> = { projectId };
    if (category) where.category = category;

    return this.prisma.projectFile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
