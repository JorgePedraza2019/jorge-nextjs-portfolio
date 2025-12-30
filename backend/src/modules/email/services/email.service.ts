import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../dto/send-email.dto';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class EmailService {
  private sesClient = new SESClient({ region: process.env.AWS_REGION });

  async sendEmail(sendEmailDto: SendEmailDto) {
    const appEnv = process.env.APP_ENV || 'dev';
    const subjectPrefix = appEnv === 'prod' ? '' : `[${appEnv.toUpperCase()}] `;

    const { firstName, lastName, email, linkedin, company, position, message } =
      sendEmailDto;
    const sourceEmail = process.env.EMAIL_FROM;
    const destinationEmail = process.env.EMAIL_TO;

    if (!sourceEmail || !destinationEmail) {
      throw new Error(
        'EMAIL_FROM or EMAIL_TO environment variables are not defined',
      );
    }

    const params = {
      Source: sourceEmail,
      Destination: { ToAddresses: [destinationEmail] },
      ReplyToAddresses: [email],
      Message: {
        Subject: {
          Data: `${subjectPrefix}Contacto desde portafolio: ${firstName}`,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: `
            Nombre: ${firstName} ${lastName || ''}
            Email: ${email}
            LinkedIn: ${linkedin || ''}
            Empresa: ${company || ''}
            Posición: ${position || ''}
            Mensaje: ${message}
          `,
            Charset: 'UTF-8',
          },
        },
      },
    };

    const command = new SendEmailCommand(params);
    const response = await this.sesClient.send(command);

    return { messageId: response.MessageId };
  }
}
