import { Controller, HttpStatus, HttpCode, Post, Body } from '@nestjs/common';
import { PaymentsStripeService } from './payments-stripe.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('PaymentsStripe')
@Controller({
  path: 'payments-stripe',
  version: '1',
})
export class PaymentsStripeController {
  constructor(private readonly paymentsStripeService: PaymentsStripeService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  webhook(@Body() data): void {
    return this.paymentsStripeService.webhook(data);
  }
}
