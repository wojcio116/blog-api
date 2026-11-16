import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

abstract class AbstractGuard implements CanActivate {
  protected constructor(private authToken: string | undefined) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    return this.isTokenValid(token);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (
      type !== 'Bearer' ||
      !token ||
      token === 'null' ||
      token === 'undefined'
    ) {
      return undefined;
    }

    return token;
  }

  isTokenValid(token: string): boolean {
    if (!this.authToken) {
      return false;
    }

    return token === this.authToken;
  }
}

@Injectable()
export class AdminGuard extends AbstractGuard {
  constructor(configService: ConfigService) {
    super(configService.get<string>('ADMIN_TOKEN'));
  }
}

@Injectable()
export class DestructiveActionsGuard extends AbstractGuard {
  constructor(configService: ConfigService) {
    super(configService.get<string>('DESTRUCTIVE_ACTIONS_TOKEN'));
  }
}
