/* npm imports */
import { Module } from '@nestjs/common';

/* local imports */
import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';

@Module({
  controllers: [BankingController],
  providers: [BankingService],
})
export class BankingModule {}
