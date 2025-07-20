import { Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private postService: PostService) {}

  @Post('data/vn-direct')
  getVnDirectData() {
    return this.postService.processVnDirectData();
  }
}
