/* npm imports */
import { Injectable } from '@nestjs/common'

@Injectable()
export class BankingService {
  ping() {
    return { message: 'pong' }
  }
}
