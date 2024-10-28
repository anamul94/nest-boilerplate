import { SSLCommerzPayment } from 'sslcommerz-lts';
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { BkashService } from './bkash/bkash.service';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [BkashService],
})
export class PaymentModule {}
