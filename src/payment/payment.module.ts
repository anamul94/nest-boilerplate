import { SSLCommerzPayment } from 'sslcommerz-lts';
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [],
})
export class PaymentModule {}
