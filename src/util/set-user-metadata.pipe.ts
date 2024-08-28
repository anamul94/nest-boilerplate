import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ReqUser } from './entity/req-user.interface';

@Injectable()
export class SetUserMetadataPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly req: Request) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      console.log(this.req.method);
      const user = (this.req as any).user as ReqUser; // assuming req.user has a username field
      if (!value.id) {
        // New entity being created
        value.createdBy = user.userId;
      }
      value.updatedBy = user.userId;
    }
    return value;
  }
}
