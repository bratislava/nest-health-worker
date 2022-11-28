import { Prisma, HealthCheck } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service';
import {
  GetHealthChecksDto,
  GetHealthChecksResponseDto
} from './health-check.dto';

export class HealthCheckService {
  constructor(private prisma = new PrismaService()) {}

  async createHealthCheck(
    data: Prisma.HealthCheckCreateInput
  ): Promise<HealthCheck> {
    return this.prisma.healthCheck.create({
      data,
    });
  }

  async getHealthCheck(
    healthWhereUniqueInput: Prisma.HealthCheckWhereUniqueInput
  ): Promise<HealthCheck> {
    return this.prisma.healthCheck.findUnique({
      where: healthWhereUniqueInput,
    });
  }

  async getHealthChecks(
    getHealthChecks: GetHealthChecksDto
  ): Promise<GetHealthChecksResponseDto> {
    const where = {};
    const emails = await this.prisma.healthCheck.findMany({
      where: where,
      orderBy: [
        {
          updated_at: 'desc',
        },
      ],
    });

    const total = await this.prisma.healthCheck.count({ where: where });
    const currentPage = 1;
    const pageSize = total;

    return {
      items: emails,
      pagination: {
        total: total,
        currentPage: currentPage,
        pageSize: pageSize,
      },
    };
  }

  async updateHealthCheck(params: {
    where: Prisma.HealthCheckWhereUniqueInput;
    data: Prisma.HealthCheckUpdateInput;
  }): Promise<HealthCheck> {
    const { where, data } = params;
    return this.prisma.healthCheck.update({
      data,
      where,
    });
  }

  async deleteHealthCheck(params: {
    where: Prisma.HealthCheckWhereUniqueInput;
  }): Promise<HealthCheck> {
    const { where } = params;
    return this.prisma.healthCheck.delete({
      where,
    });
  }
}
