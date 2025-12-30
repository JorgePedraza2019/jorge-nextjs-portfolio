import { Body, Controller, Post, Res } from '@nestjs/common';
import { RagService } from '../services/rag.service';
import { QueryPromptDto } from '../dto/query-prompt.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('RAG')
@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('query')
  @ApiOperation({
    summary: 'Enviar un prompt y obtener respuesta usando RAG + LLM',
  })
  async query(@Body() queryPromptDto: QueryPromptDto) {
    return this.ragService.query(queryPromptDto);
  }

  @Post('query/stream')
  streamQuery(
    @Body() queryPromptDto: QueryPromptDto,
    @Res() res: Response,
  ): void {
    this.ragService.stream(queryPromptDto, res);
  }
}
