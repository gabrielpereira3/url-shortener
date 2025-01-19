import {Request} from 'express';
import {Url} from 'src/urls/entities/url.entity';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    urls: Url[];
  };
}
