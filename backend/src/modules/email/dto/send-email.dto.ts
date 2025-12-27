import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({ example: 'jorge.pedraza.valdez@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Jorge' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pedraza' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'https://linkedin.com/in/jorge' })
  @IsString()
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @ApiProperty({ example: 'Empresa S.A.' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ example: 'Developer' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({ example: 'Hola, me interesa contactarte...' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'captcha-token-aqui' })
  @IsString()
  @IsNotEmpty()
  captchaToken: string;
}
