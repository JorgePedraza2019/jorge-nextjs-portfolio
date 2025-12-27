import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppController {
  @Get('hello')
  hello() {
    return {
      message: 'Hello from backend 👋',
      timestamp: new Date().toISOString(),
    };
  }
}