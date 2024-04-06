import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as SSLCommerzPayment from 'sslcommerz-lts';
import { Request } from 'express';
import { Public } from 'src/auth/decorators';
import { JwtAuthGuards } from 'src/auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuards)
@Controller('payment')
export class PaymentController {
  private readonly storeId = 'anamu66113512deb64';
  private readonly storePassword = 'anamu66113512deb64@ssl';
  private readonly isLive = false; // true for live, false for sandbox

  constructor() {}

  @Get('/init/:orderId/:amount')
  //   @Redirect()
  async initializePayment(
    @Param('orderId') orderId: string,
    @Param('amount') amount: number,
    @Res() res,
  ): Promise<any> {
    const data = {
      total_amount: amount,
      currency: 'BDT',
      tran_id: orderId, // use unique tran_id for each API call
      success_url: 'http://localhost:8080/api/v1/payment/success',
      fail_url: 'http://localhost:8080/api/v1/payment/success',
      cancel_url: 'http://localhost:8080/api/v1/payment/cancel',
      ipn_url: 'http://localhost:8080/api/v1/payment/ipn',
      cus_email: 'a1@gmail.com',
      cus_phone: '01712345678',
      shipping_method: 'NO',
      product_name: 'Product Name',
      product_category: 'Goods',
      product_profile: 'general',
    };

    try {
      const sslcz = new SSLCommerzPayment(
        this.storeId,
        this.storePassword,
        this.isLive,
      );
      const apiResponse = await sslcz.init(data);
      console.log('apiResponse: ', apiResponse);
      const GatewayPageURL = apiResponse.GatewayPageURL;
      console.log('Redirecting to: ', GatewayPageURL);
      res.redirect(GatewayPageURL);
      //   return apiResponse;
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
  @Post('/success')
  async success(@Req() req: Request, @Res() res) {
    // console.log('success: ', req.body);
    res.status(HttpStatus.OK).send(req.body);
  }

  @Post('/cancel')
  async cancel(@Req() req: Request, @Res() res) {
    // console.log('success: ', req.body);
    res.status(HttpStatus.OK).send(req.body);
  }

  @Post('/ipn')
  async ipn(@Req() req: Request, @Res() res) {
    console.log('success: ', req.body);
    res.status(HttpStatus.OK).send(req.body);
  }
}
