import { Controller, Get, Res, HttpStatus, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Version(VERSION_NEUTRAL)
  @Get('health')
  @ApiOperation({ summary: 'System health status validation' })
  @ApiResponse({ status: 200, description: 'Service operational.' })
  getHealth() {
    return this.appService.checkHealth();
  }

  @Version(VERSION_NEUTRAL)
  @Get('live')
  @ApiOperation({ summary: 'System liveness probe' })
  @ApiResponse({ status: 200, description: 'Service is alive.' })
  getLiveness() {
    return this.appService.checkLiveness();
  }

  @Version(VERSION_NEUTRAL)
  @Get('ready')
  @ApiOperation({ summary: 'System readiness probe' })
  @ApiResponse({ status: 200, description: 'All database and cache backends are fully operational.' })
  @ApiResponse({ status: 503, description: 'Dependencies operational check failed.' })
  async getReadiness(@Res() res: Response) {
    const result = await this.appService.checkReadiness();
    if (result.healthy) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json(result);
    }
  }
}
