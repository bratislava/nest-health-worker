import { HealthCheck } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger';

export class GetHealthChecksDto {
    @ApiProperty({
        description: 'Name of health app',
        default: 'Dane backend',
    })
    name?: string;

    @ApiProperty({
        description: 'Url of health check app',
        default: 'https://platba-dani-be.dev.bratislava.sk/api/health',
    })
    url?: string;

    @ApiProperty({
        description: 'String, which is an expected result of healthCheck',
        default: 'OK',
    })
    expected_result?: string = 'OK';

    @ApiProperty({
        description: 'what is the limit',
        default: '10',
    })
    limit?: number = 10;

    @ApiProperty({
        description: 'what is the limit',
        default: '10',
    })
    currentPage?: number = 0;

    @ApiProperty({
        description: 'what is the limit',
        default: '10',
    })
    pageSize?: number = 10;
    skip?: number;
}

export class GetHealthChecksResponseDto {
    items: HealthCheck[];
    @ApiProperty({
        description: 'what is the limit',
        default: { total: 100, currentPage: 1, pageSize: 10 },
    })
    pagination: {
        total: number;
        currentPage: number;
        pageSize: number;
    };
}
