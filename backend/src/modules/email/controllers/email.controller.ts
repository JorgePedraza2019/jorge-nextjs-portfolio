import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { SendEmailDto } from '../dto/send-email.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CaptchaService } from '../../captcha/services/captcha.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Post('send')
  @ApiOperation({ summary: 'Enviar un correo electrónico' })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    try {
      // Validar captcha antes de enviar
      await this.captchaService.validateCaptcha(sendEmailDto.captchaToken);

      const result = await this.emailService.sendEmail(sendEmailDto);

      return {
        success: true,
        message: 'Correo enviado correctamente',
        data: result,
      };
    } catch (error: unknown) {
      // Type guard para acceder a message de forma segura
      let message = 'Error desconocido';
      if (error instanceof Error) {
        message = error.message;
      }

      return {
        success: false,
        message,
        error: null, // opcional, evita usar any
      };
    }
  }
}
