/** npm imports */
import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response } from "express";

/* local imports */
import { ConfigKey } from "../../config/enum";

@Injectable()
export class InternalAuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const expectedSecret = this.configService.get<string>(
      ConfigKey.INTERNAL_AUTH_SECRET_BANKING_SERVICE,
    );
    if (!expectedSecret) {
      throw new InternalServerErrorException(
        "Missing INTERNAL_AUTH_SECRET_BANKING_SERVICE in Banking Service configuration",
      );
    }

    const securedHeader = req.headers["x-internal-auth"];
    if (securedHeader !== expectedSecret) {
      throw new UnauthorizedException(
        "Unauthorized internal request. This service should only be accessed by the API Gateway.",
      );
    }

    next();
  }
}
