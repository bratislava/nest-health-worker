import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@prisma/client';
import { HealthCheckService } from './health-check.service';
import {
  GetHealthChecksDto,
  GetHealthChecksResponseDto,
} from './health-check.dto';

@ApiTags('health-checks')
@Controller()
export class HealthCheckController {
  constructor(private healthService: HealthCheckService) {}

  @Get('health-check/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'get health info',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized into Parksys or into backend',
  })
  async getHealth(@Param('id') id: string): Promise<HealthCheck> {
    return this.healthService.getHealthCheck({ id: id });
  }

  @Get('health-check')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'get list of all health url checks',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized into Parksys or into backend',
  })
  async getHealths(
    @Query() query: GetHealthChecksDto
  ): Promise<GetHealthChecksResponseDto> {
    return this.healthService.getHealthChecks(query);
  }

  @Post('health-check')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'add new health url check',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized into Parksys or into backend',
  })
  async createHealth(@Body() data): Promise<HealthCheck> {
    return this.healthService.createHealthCheck(data);
  }

  @Patch('health-check/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'change health url check',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized into Parksys or into backend',
  })
  async updateHealth(
    @Param('id') id: string,
    @Body() data
  ): Promise<HealthCheck> {
    return this.healthService.updateHealthCheck({
      where: { id: id },
      data: data,
    });
  }

  @Delete('health-check/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'change health url check',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized into Parksys or into backend',
  })
  async deleteHealth(@Param('id') id: string): Promise<HealthCheck> {
    return this.healthService.deleteHealthCheck({
      where: { id: id },
    });
  }
}
