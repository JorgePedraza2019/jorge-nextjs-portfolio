import { Injectable, BadRequestException } from '@nestjs/common';

interface GoogleRecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

@Injectable()
export class CaptchaService {
  private readonly secretKey = process.env.RECAPTCHA_SECRET_KEY;

  async validateCaptcha(token: string): Promise<void> {
    if (!token) {
      throw new BadRequestException('Captcha token is missing');
    }

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${this.secretKey}&response=${token}`,
      {
        method: 'POST',
      },
    );

    if (!response.ok) {
      throw new BadRequestException('Failed to verify captcha');
    }

    const data = (await response.json()) as GoogleRecaptchaResponse;

    if (!data.success) {
      throw new BadRequestException('Captcha verification failed');
    }

    const score = data.score !== undefined ? data.score : 0;

    if (score < 0.5) {
      throw new BadRequestException('Captcha score too low');
    }
  }
}
