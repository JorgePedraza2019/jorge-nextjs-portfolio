// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

// import { Module } from '@nestjs/common';
// import { EmailModule } from './modules/email/email.module';
// import { RagModule } from './modules/rag/rag.module';

// @Module({
//   imports: [EmailModule, RagModule],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EmailModule } from './modules/email/email.module';
import { RagModule } from './modules/rag/rag.module';

@Module({
  imports: [EmailModule, RagModule],
  controllers: [AppController],
})
export class AppModule {}