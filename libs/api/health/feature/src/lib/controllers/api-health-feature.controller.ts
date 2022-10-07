import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

import { PrismaHealthIndicator } from '../health-indicator/prisma.health';

@Controller('.well-known/health')
export class ApiHealthFeatureController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prisma: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('google', 'https://www.google.com'),
      () => this.http.pingCheck('kratos', 'http://kratos:4433/health/alive'),
      () => this.prisma.pingCheck('database'),
    ]);
  }
}
