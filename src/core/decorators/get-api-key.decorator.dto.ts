import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const GetApiKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const apiKey = getApiKeyFromRequest(request);
    if (!apiKey) throw new UnauthorizedException();

    return apiKey;
  },
);

export function getApiKeyFromRequest(request: any): string {
  const authorizationHeader: string | undefined =
    request?.headers?.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException();
  }

  const apiKey = authorizationHeader.split(' ')[1];
  return apiKey;
}
