import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { AuthUser } from '../interfaces/auth-user';

@Injectable()
export class SetUserMetadataPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly req: Request) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      console.log(this.req.method);
      const user = (this.req as any).user as AuthUser; // assuming req.user has a username field
      if (this.req.method === 'POST') {
        // New entity being created
        value.createdBy = user.userId;
      }
      value.updatedBy = user.userId;
    }
    return value;
  }
}
