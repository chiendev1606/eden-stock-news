import { DatabaseService } from '@app/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationType } from 'libs/decorators/pagination.decorator';

@Injectable()
export class PostService {
  constructor(private databaseService: DatabaseService) {}

  async findPostById(id: string) {
    const post = await this.databaseService.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async getPostsPaginationData(pagination: PaginationType, search: string) {
    const [posts, total] = await Promise.all([
      this.databaseService.post.findMany({
        skip: pagination.limit,
        take: pagination.size,
        where: {
          title: {
            contains: search,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          stock: true,
        },
      }),
      this.databaseService.post.count({
        where: {
          title: {
            contains: search,
          },
          content: {
            contains: search,
          },
        },
      }),
    ]);

    return {
      posts,
      total,
      page: pagination.page,
      size: pagination.size,
    };
  }
}
