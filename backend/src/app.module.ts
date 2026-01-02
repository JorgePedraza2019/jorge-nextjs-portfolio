import { Module } from '@nestjs/common';
import { EmailModule } from './modules/email/email.module';
import { RagModule } from './modules/rag/rag.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // ventana de tiempo en segundos
          limit: 30, // máximo 30 requests por IP
        },
      ],
    }),
    EmailModule,
    RagModule,
  ],
})
export class AppModule {}
