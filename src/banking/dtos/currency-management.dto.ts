
export class CreateCurrencyDto {
    currencyCode!: string
    digitalCode?: string
    name!: string
    symbol?: string
    fraction!: number
    scale!: number
    active?: boolean
    snPrefix?: string
    availableForExchange?: boolean
    type!: 'FIAT' | 'CRYPTO' | 'BONUS' | 'VIRTUAL'
  }
  
  export class UpdateCurrencyDto {
    currencyCode?: string
    digitalCode?: string
    name?: string
    symbol?: string
    fraction?: number
    scale?: number
    active?: boolean
    snPrefix?: string
    availableForExchange?: boolean
    type?: 'FIAT' | 'CRYPTO' | 'BONUS' | 'VIRTUAL'
  }
  
  export class CurrencyViewDto {
    pageNumber?: number
    pageSize?: number
    filters?: {
      name?: string
      currencyCode?: string
      active?: boolean
      isMain?: boolean
      type?: 'FIAT' | 'CRYPTO' | 'BONUS' | 'VIRTUAL'
      availableForExchange?: boolean
    }
    sort?: Array<{
      field: 'active' | 'name' | 'currencyCode' | 'type' | 'isMain'
      direction: 'ASC' | 'DESC'
    }>
  }
  