import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryPromptDto {
  @ApiProperty({ example: 'Dame un resumen de mi portafolio' })
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
