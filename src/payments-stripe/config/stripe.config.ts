import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { StripeConfig } from './stripe-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  STRIPE_SECRET_KEY: string;
}

export default registerAs<StripeConfig>('stripe', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
  };
});
