import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BkashService {
  private readonly bkashBaseUrl = process.env.BKASH_BASE_URL;
  private accessToken: string | null = null;

  constructor() {}

  // Step 4.1: Authenticate and get an access token
  async authenticate(): Promise<void> {
    try {
      const response = await axios.post(
        `${this.bkashBaseUrl}/token/grant`,
        {
          app_key: process.env.BKASH_APP_KEY,
          app_secret: process.env.BKASH_APP_SECRET,
        },
        {
          auth: {
            username: process.env.BKASH_USERNAME,
            password: process.env.BKASH_PASSWORD,
          },
        },
      );
      this.accessToken = response.data.id_token;
    } catch (error) {
      throw new HttpException('Failed to authenticate with bKash', 500);
    }
  }

  // Step 4.2: Initiate a payment
  async createPayment(
    amount: number,
    merchantInvoiceNumber: string,
  ): Promise<any> {
    if (!this.accessToken) await this.authenticate();

    try {
      const response = await axios.post(
        `${this.bkashBaseUrl}/payment/create`,
        {
          amount,
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber,
        },
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to create payment', 500);
    }
  }

  // Step 4.3: Execute the payment
  async executePayment(paymentID: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.bkashBaseUrl}/payment/execute/${paymentID}`,
        {},
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to execute payment', 500);
    }
  }

  // Step 4.4: Query the payment status
  async queryPayment(paymentID: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.bkashBaseUrl}/payment/query/${paymentID}`,
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to query payment', 500);
    }
  }
}
