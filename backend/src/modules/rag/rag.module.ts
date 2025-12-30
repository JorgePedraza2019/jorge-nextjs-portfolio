import { Module } from '@nestjs/common';
import { RagService } from './services/rag.service';
import { RagController } from './controllers/rag.controller';

@Module({
  controllers: [RagController],
  providers: [RagService],
})
export class RagModule {}
