import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './domain/post/post.module';
import { SharedModule } from './domain/shared/shared.module';

@Module({
  imports: [SharedModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
