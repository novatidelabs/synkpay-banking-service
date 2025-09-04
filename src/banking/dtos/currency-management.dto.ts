export class CreateCurrencyDto {
  code!: string
  digitalCode!: string
  name!: string
  description!: string
  symbol!: string
  fraction?: number
  scale?: number
  active?: boolean
  snPrefix!: string
  availableForExchange?: boolean
  type?: 'FIAT' | 'CRYPTO' | 'BONUS' | 'VIRTUAL'
}

export class UpdateCurrencyDto {
  name?: string
  description?: string
  active?: boolean
  availableForExchange?: boolean
  type?: 'FIAT' | 'CRYPTO' | 'BONUS' | 'VIRTUAL'
}

export type CurrencyType = 'FIAT' | 'CRYPTO' | 'BONUS' | 'VIRTUAL'
export type SortDirection = 'asc' | 'desc'

export class CurrencyViewDto {
  pageNumber?: number
  pageSize?: number
  filter!: {
    names?: string[]
    activationStatus?: 'active' | 'inactive'
    text?: string
    main?: boolean
    type?: CurrencyType
  }
  sort?: {
    active?: SortDirection
    name?: SortDirection
  }
}
