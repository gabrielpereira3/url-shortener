import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';

@Injectable()
export class UniqueRequestMiddleware implements NestMiddleware {
  private recentRequests = new Set<string>();

  use(req: Request, res: Response, next: NextFunction) {
    const {token} = req.params;
    const requestKey = `${req.ip}-${token}`;

    if (this.recentRequests.has(requestKey)) {
      return res.status(204).end();
    }

    this.recentRequests.add(requestKey);

    setTimeout(() => this.recentRequests.delete(requestKey), 2000);

    next();
  }
}
