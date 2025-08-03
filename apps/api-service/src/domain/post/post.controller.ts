import { Controller, Get, Query } from '@nestjs/common';
import {
  Pagination,
  PaginationType,
} from 'libs/decorators/pagination.decorator';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private postService: PostService) {}

  @Get('data/posts')
  getPostsData(
    @Pagination() pagination: PaginationType,
    @Query('search') search: string,
  ) {
    return this.postService.getPostsPaginationData(pagination, search);
  }
}
