import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { EmailController } from './controllers/email.controller';
import { CaptchaModule } from '../captcha/captcha.module';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [CaptchaModule],
})
export class EmailModule {}
