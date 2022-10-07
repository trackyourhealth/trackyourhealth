import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private prisma: PrismaService) {
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    let details = {};
    let isHealthy = false;

    try {
      await this.prisma.$queryRaw`SELECT 1;`;
      isHealthy = true;
    } catch (exception) {
      details = {
        message: 'Cannot connect to the database!',
      };
    }
    return this.getStatus(key, isHealthy, details);
  }
}
