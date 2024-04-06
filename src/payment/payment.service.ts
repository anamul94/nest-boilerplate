import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SSLCommerzPayment } from 'sslcommerz-lts';

@Injectable()
export class PaymentService {
  constructor(private readonly sslCommerzPayment: SSLCommerzPayment) {}

  async initializePayment(data): Promise<string> {
    try {
      const apiResponse = await this.sslCommerzPayment.init(data);
      return apiResponse.GatewayPageURL;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
