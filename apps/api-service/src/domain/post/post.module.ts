import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { VnDirectIntegrationModule } from 'libs/vn-direct-integration/src';

@Module({
  imports: [VnDirectIntegrationModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
