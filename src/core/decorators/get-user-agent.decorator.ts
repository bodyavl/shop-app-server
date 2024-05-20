import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (
      request?.headers['x-client-user-agent'] ?? request?.headers['user-agent']
    );
  },
);
