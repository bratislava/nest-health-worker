import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { HealthCheckCronModuleModule } from './health-check-cron/health-check-cron.module';
import { ScheduleModule} from "@nestjs/schedule";

@Module({
  imports: [PrismaModule, HealthCheckModule, ScheduleModule.forRoot(), HealthCheckCronModuleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}