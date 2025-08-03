import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { chain } from 'lodash';

export interface PaginationType {
  page: number;
  size: number;
  limit: number;
}

export const Pagination = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const page = chain(request.query).get('page', 1).toNumber().value();
    const size = chain(request.query).get('size', 10).toNumber().value();

    const limit = size * (page - 1);

    return {
      page,
      size,
      limit,
    };
  },
);
