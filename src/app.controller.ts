import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('facebook/webhook/feed')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): any {
    const VERIFY_TOKEN = 'verifytoken';
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        this.logger.debug('WEBHOOK_VERIFIED');
        return challenge;
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        throw new ForbiddenException();
      }
    }
  }

  @Post('facebook/webhook/feed')
  async handleWebhook(@Body() body: any) {
    this.logger.debug('body', body);
  }
}
