import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';

import { ConfigService } from '@nestjs/config';
import { User } from '../../users/domain/user';

type JwtPayload = Pick<User, 'id' | 'role'> & { iat: number; exp: number };

@Injectable()
export class OptionalAuthStrategy extends PassportStrategy(
  Strategy,
  'optional-jwt',
) {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  public validate(payload: JwtPayload) {
    if (!payload.id) {
      return false;
    }

    return payload;
  }
}
