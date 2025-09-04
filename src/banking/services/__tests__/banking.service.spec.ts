/* npm imports */
import { Test, TestingModule } from '@nestjs/testing'

/* local imports */
import { BankingService } from '../banking.service'

describe('BankingService', () => {
  let service: BankingService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankingService],
    }).compile()
    service = module.get<BankingService>(BankingService)
  })

  it('should return pong message', () => {
    expect(service.ping()).toEqual({ message: 'pong' })
  })
})
