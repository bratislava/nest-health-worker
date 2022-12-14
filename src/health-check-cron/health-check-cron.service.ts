import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { HealthCheckService } from '../health-check/health-check.service';

import DomParser = require('dom-parser');
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env['SENTRY_DSN'],
  debug: false,
  environment: 'production',
  release: '1.0.0', // must create a release in sentry.io dashboard
  tracesSampleRate: 1.0,
});

@Injectable()
export class HealthCheckCronService {
  constructor(private healthService: HealthCheckService) {}

  private readonly logger = new Logger(HealthCheckCronService.name);

  @Cron('*/90 * * * * *')
  async handleCron() {
    const healths = await this.healthService.getHealthChecks({});
    this.logger.log('running cron' );
    for (const health of healths.items) {
      const result = await axios
        .get(health.url, { timeout: 10000 })
        .then(async (response) => {
          let result = 'NOK';
          let checkText = String(health.result_rule['checkText']);
          let textContent: string;

          if (health.result_rule['type'] === 'fe') {
            const parser = new DomParser();
            const doc = parser.parseFromString(response.data, 'text/html');

            if (typeof health.result_rule['className'] !== 'undefined') {
              textContent = doc.getElementsByClassName(
                health.result_rule['className']
              )[0].textContent;
            } else if (typeof health.result_rule['tagName'] !== 'undefined') {
              textContent = doc.getElementsByTagName(
                health.result_rule['tagName']
              )[0].textContent;
            } else {
              throw 'Missing tagName or className for validation';
            }

            if (textContent === checkText) {
              result = 'OK';
              this.logger.log({ app: health.name, result: result });
            } else {
              this.logger.error({
                message: health.name,
                params: result,
                expected_value: checkText,
                retrieved_value: textContent,
              });

              Sentry.captureEvent({
                message: health.env + ': ' + health.name,
                platform: health.url,
                extra: {
                  a_name: health.name,
                  b_url: health.url,
                  c_env: health.env,
                  d_expected_value: checkText,
                  e_retrieved_value: textContent,
                  f_result_rule: health.result_rule,
                },
              });
            }
          } else if (health.result_rule['type'] === 'be') {
            let responseData: string;

            if (
              typeof health.result_rule['useResponseStatusCode'] !==
                'undefined' &&
              health.result_rule['useResponseStatusCode'] === true
            ) {
              responseData = String(response.status);
            } else {
              responseData = response.data;
            }

            if (responseData === checkText) {
              result = 'OK';
              this.logger.log({ app: health.name, result: result });
            } else {
              this.logger.error({
                app: health.name,
                result: result,
                expected_value: checkText,
                retrieved_value: responseData,
              });

              Sentry.captureEvent({
                message: health.env + ': ' + health.name,
                platform: health.url,
                extra: {
                  a_name: health.name,
                  b_url: health.url,
                  c_env: health.env,
                  d_expected_value: checkText,
                  e_retrieved_value: textContent,
                  f_result_rule: health.result_rule,
                },
              });
            }
          }
          await this.healthService.updateHealthCheck({
            where: { id: health.id },
            data: {
              expected_result: result,
            },
          });

          return response;
        })
        .catch((error) => {
          this.logger.error({ app: health.name, result: error });
          Sentry.captureEvent({
            message: health.env + ': ' + health.name,
            platform: health.url,
            extra: {
              a_name: health.name,
              b_url: health.url,
              c_env: health.env,
              f_result_rule: health.result_rule,
              g_error: error,
            },
          });
          return error.response;
        });
    }
  }
}
