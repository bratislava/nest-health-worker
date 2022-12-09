import { Module } from '@nestjs/common';
import { HealthCheckCronService } from './health-check-cron.service';
import { HealthCheckService } from '../health-check/health-check.service';

@Module({
  providers: [HealthCheckCronService, HealthCheckService]
})
export class HealthCheckCronModuleModule {}


