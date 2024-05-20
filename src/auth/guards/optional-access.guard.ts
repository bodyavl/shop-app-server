import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAccessTokenGuard extends AuthGuard('optional-jwt') {
  handleRequest(err, user) {
    // If there's an error or the user is not authenticated, return undefined (i.e., treat the request as unauthenticated)
    if (err || !user) {
      return undefined;
    }

    // Otherwise, return the user
    return user;
  }
}
