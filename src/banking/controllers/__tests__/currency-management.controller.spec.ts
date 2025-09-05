import { Test, TestingModule } from '@nestjs/testing'
import { CurrenciesManagementController } from '../currency-management.controller'
import { CurrenciesManagementService } from '../../services/currency-management.service'
import { CreateCurrencyDto, UpdateCurrencyDto, CurrencyViewDto } from '../../dtos/currency-management.dto'
import { Response, Request } from 'express'

/* eslint-disable @typescript-eslint/unbound-method */
describe('CurrenciesManagementController', () => {
  let controller: CurrenciesManagementController
  let service: CurrenciesManagementService

  const mockCurrenciesManagementService = {
    getCurrencies: jest.fn(),
    createCurrency: jest.fn(),
    getCurrenciesView: jest.fn(),
    updateCurrency: jest.fn(),
    setMainCurrency: jest.fn(),
  }

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response

  const mockRequest = {
    headers: {
      authorization: 'Bearer test-token',
    },
  } as unknown as Request

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesManagementController],
      providers: [
        {
          provide: CurrenciesManagementService,
          useValue: mockCurrenciesManagementService,
        },
      ],
    }).compile()

    controller = module.get<CurrenciesManagementController>(CurrenciesManagementController)
    service = module.get<CurrenciesManagementService>(CurrenciesManagementService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getCurrencies', () => {
    const callerId = 'test-caller-id'

    it('should return currencies successfully', async () => {
      const mockResult = {
        status: 200,
        data: [
          { id: '1', code: 'USD', name: 'US Dollar' },
          { id: '2', code: 'EUR', name: 'Euro' },
        ],
      }

      mockCurrenciesManagementService.getCurrencies.mockResolvedValue(mockResult)

      await controller.getCurrencies(callerId, mockRequest, mockResponse)

      expect(service.getCurrencies).toHaveBeenCalledWith(callerId, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult.data)
    })

    it('should return 403 error when service returns null', async () => {
      mockCurrenciesManagementService.getCurrencies.mockResolvedValue(null)

      await controller.getCurrencies(callerId, mockRequest, mockResponse)

      expect(service.getCurrencies).toHaveBeenCalledWith(callerId, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(403)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Could not get currencies',
      })
    })

    it('should return error status and data from service', async () => {
      const mockResult = {
        status: 400,
        data: { message: 'Bad request' },
      }

      mockCurrenciesManagementService.getCurrencies.mockResolvedValue(mockResult)

      await controller.getCurrencies(callerId, mockRequest, mockResponse)

      expect(service.getCurrencies).toHaveBeenCalledWith(callerId, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Bad request',
      })
    })

    it('should return unknown error message when data is null', async () => {
      const mockResult = {
        status: 500,
        data: null,
      }

      mockCurrenciesManagementService.getCurrencies.mockResolvedValue(mockResult)

      await controller.getCurrencies(callerId, mockRequest, mockResponse)

      expect(service.getCurrencies).toHaveBeenCalledWith(callerId, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unknown error from SDK Finance',
      })
    })

    it('should handle request without authorization header', async () => {
      const requestWithoutAuth = {
        headers: {},
      } as unknown as Request

      const mockResult = {
        status: 200,
        data: [{ id: '1', code: 'USD', name: 'US Dollar' }],
      }

      mockCurrenciesManagementService.getCurrencies.mockResolvedValue(mockResult)

      await controller.getCurrencies(callerId, requestWithoutAuth, mockResponse)

      expect(service.getCurrencies).toHaveBeenCalledWith(callerId, undefined)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult.data)
    })
  })

  describe('createCurrency', () => {
    const callerId = 'test-caller-id'
    const createCurrencyDto: CreateCurrencyDto = {
      code: 'USD',
      digitalCode: '840',
      name: 'US Dollar',
      description: 'United States Dollar',
      symbol: '$',
      fraction: 100,
      scale: 2,
      active: true,
      snPrefix: 'USD',
      availableForExchange: true,
      type: 'FIAT',
    }

    it('should create currency successfully', async () => {
      const mockResult = {
        status: 200,
        data: { id: '1', code: 'USD', name: 'US Dollar' },
      }

      mockCurrenciesManagementService.createCurrency.mockResolvedValue(mockResult)

      await controller.createCurrency(callerId, createCurrencyDto, mockRequest, mockResponse)

      expect(service.createCurrency).toHaveBeenCalledWith(callerId, createCurrencyDto, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult.data)
    })

    it('should return 403 error when service returns null', async () => {
      mockCurrenciesManagementService.createCurrency.mockResolvedValue(null)

      await controller.createCurrency(callerId, createCurrencyDto, mockRequest, mockResponse)

      expect(service.createCurrency).toHaveBeenCalledWith(callerId, createCurrencyDto, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(403)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Could not create currency',
      })
    })

    it('should return error status when status is not 200', async () => {
      const mockResult = {
        status: 400,
        data: { message: 'Bad request' },
      }

      mockCurrenciesManagementService.createCurrency.mockResolvedValue(mockResult)

      await controller.createCurrency(callerId, createCurrencyDto, mockRequest, mockResponse)

      expect(service.createCurrency).toHaveBeenCalledWith(callerId, createCurrencyDto, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Bad request',
      })
    })

    it('should return error when status is 200 but data is null', async () => {
      const mockResult = {
        status: 200,
        data: null,
      }

      mockCurrenciesManagementService.createCurrency.mockResolvedValue(mockResult)

      await controller.createCurrency(callerId, createCurrencyDto, mockRequest, mockResponse)

      expect(service.createCurrency).toHaveBeenCalledWith(callerId, createCurrencyDto, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unknown error from SDK Finance',
      })
    })

    it('should handle request without authorization header', async () => {
      const requestWithoutAuth = {
        headers: {},
      } as unknown as Request

      const mockResult = {
        status: 200,
        data: { id: '1', code: 'USD', name: 'US Dollar' },
      }

      mockCurrenciesManagementService.createCurrency.mockResolvedValue(mockResult)

      await controller.createCurrency(callerId, createCurrencyDto, requestWithoutAuth, mockResponse)

      expect(service.createCurrency).toHaveBeenCalledWith(callerId, createCurrencyDto, undefined)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult.data)
    })
  })

  describe('getCurrenciesView', () => {
    const callerId = 'test-caller-id'
    const currencyViewDto: CurrencyViewDto = {
      pageNumber: 1,
      pageSize: 10,
      filter: {
        names: ['USD', 'EUR'],
        activationStatus: 'active',
      },
    }

    it('should get currencies view successfully', async () => {
      const mockResult = {
        status: 200,
        data: {
          currencies: [
            { id: '1', code: 'USD', name: 'US Dollar' },
            { id: '2', code: 'EUR', name: 'Euro' },
          ],
          total: 2,
        },
      }

      mockCurrenciesManagementService.getCurrenciesView.mockResolvedValue(mockResult)

      await controller.getCurrenciesView(callerId, currencyViewDto, mockRequest, mockResponse)

      expect(service.getCurrenciesView).toHaveBeenCalledWith(callerId, currencyViewDto, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult.data)
    })

    it('should return 403 error when service returns null', async () => {
      mockCurrenciesManagementService.getCurrenciesView.mockResolvedValue(null)

      await controller.getCurrenciesView(callerId, currencyViewDto, mockRequest, mockResponse)

      expect(service.getCurrenciesView).toHaveBeenCalledWith(callerId, currencyViewDto, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(403)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Could not get currencies view',
      })
    })

    it('should return error status and data from service', async () => {
      const mockResult = {
        status: 400,
        data: { message: 'Bad request' },
      }

      mockCurrenciesManagementService.getCurrenciesView.mockResolvedValue(mockResult)

      await controller.getCurrenciesView(callerId, currencyViewDto, mockRequest, mockResponse)

      expect(service.getCurrenciesView).toHaveBeenCalledWith(callerId, currencyViewDto, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Bad request',
      })
    })

    it('should handle request without authorization header', async () => {
      const requestWithoutAuth = {
        headers: {},
      } as unknown as Request

      const mockResult = {
        status: 200,
        data: {
          currencies: [{ id: '1', code: 'USD', name: 'US Dollar' }],
          total: 1,
        },
      }

      mockCurrenciesManagementService.getCurrenciesView.mockResolvedValue(mockResult)

      await controller.getCurrenciesView(callerId, currencyViewDto, requestWithoutAuth, mockResponse)

      expect(service.getCurrenciesView).toHaveBeenCalledWith(callerId, currencyViewDto, undefined)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult.data)
    })
  })

  describe('updateCurrency', () => {
    const currencyId = 'test-currency-id'
    const callerId = 'test-caller-id'
    const updateCurrencyDto: UpdateCurrencyDto = {
      name: 'Updated US Dollar',
      active: true,
    }

    it('should update currency successfully', async () => {
      const mockResult = {
        status: 200,
        data: { id: currencyId, code: 'USD', name: 'Updated US Dollar' },
      }

      mockCurrenciesManagementService.updateCurrency.mockResolvedValue(mockResult)

      await controller.updateCurrency(currencyId, callerId, updateCurrencyDto, mockRequest, mockResponse)

      expect(service.updateCurrency).toHaveBeenCalledWith(callerId, currencyId, updateCurrencyDto, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult.data)
    })

    it('should return 403 error when service returns null', async () => {
      mockCurrenciesManagementService.updateCurrency.mockResolvedValue(null)

      await controller.updateCurrency(currencyId, callerId, updateCurrencyDto, mockRequest, mockResponse)

      expect(service.updateCurrency).toHaveBeenCalledWith(callerId, currencyId, updateCurrencyDto, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(403)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Could not update currency',
      })
    })

    it('should return error status when status is not 200', async () => {
      const mockResult = {
        status: 400,
        data: { message: 'Bad request' },
      }

      mockCurrenciesManagementService.updateCurrency.mockResolvedValue(mockResult)

      await controller.updateCurrency(currencyId, callerId, updateCurrencyDto, mockRequest, mockResponse)

      expect(service.updateCurrency).toHaveBeenCalledWith(callerId, currencyId, updateCurrencyDto, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Bad request',
      })
    })

    it('should return error when status is 200 but data is null', async () => {
      const mockResult = {
        status: 200,
        data: null,
      }

      mockCurrenciesManagementService.updateCurrency.mockResolvedValue(mockResult)

      await controller.updateCurrency(currencyId, callerId, updateCurrencyDto, mockRequest, mockResponse)

      expect(service.updateCurrency).toHaveBeenCalledWith(callerId, currencyId, updateCurrencyDto, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Could not update currency',
      })
    })

    it('should handle request without authorization header', async () => {
      const requestWithoutAuth = {
        headers: {},
      } as unknown as Request

      const mockResult = {
        status: 200,
        data: { id: currencyId, code: 'USD', name: 'Updated US Dollar' },
      }

      mockCurrenciesManagementService.updateCurrency.mockResolvedValue(mockResult)

      await controller.updateCurrency(currencyId, callerId, updateCurrencyDto, requestWithoutAuth, mockResponse)

      expect(service.updateCurrency).toHaveBeenCalledWith(callerId, currencyId, updateCurrencyDto, undefined)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult.data)
    })
  })

  describe('setMainCurrency', () => {
    const currencyId = 'test-currency-id'
    const callerId = 'test-caller-id'

    it('should set main currency successfully', async () => {
      const mockResult = {
        status: 200,
        data: { id: currencyId, code: 'USD', name: 'US Dollar', main: true },
      }

      mockCurrenciesManagementService.setMainCurrency.mockResolvedValue(mockResult)

      await controller.setMainCurrency(currencyId, callerId, mockRequest, mockResponse)

      expect(service.setMainCurrency).toHaveBeenCalledWith(callerId, currencyId, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult.data)
    })

    it('should return 403 error when service returns null', async () => {
      mockCurrenciesManagementService.setMainCurrency.mockResolvedValue(null)

      await controller.setMainCurrency(currencyId, callerId, mockRequest, mockResponse)

      expect(service.setMainCurrency).toHaveBeenCalledWith(callerId, currencyId, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(403)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Could not set main currency',
      })
    })

    it('should return error status and data from service', async () => {
      const mockResult = {
        status: 400,
        data: { message: 'Bad request' },
      }

      mockCurrenciesManagementService.setMainCurrency.mockResolvedValue(mockResult)

      await controller.setMainCurrency(currencyId, callerId, mockRequest, mockResponse)

      expect(service.setMainCurrency).toHaveBeenCalledWith(callerId, currencyId, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Bad request',
      })
    })

    it('should handle request without authorization header', async () => {
      const requestWithoutAuth = {
        headers: {},
      } as unknown as Request

      const mockResult = {
        status: 200,
        data: { id: currencyId, code: 'USD', name: 'US Dollar', main: true },
      }

      mockCurrenciesManagementService.setMainCurrency.mockResolvedValue(mockResult)

      await controller.setMainCurrency(currencyId, callerId, requestWithoutAuth, mockResponse)

      expect(service.setMainCurrency).toHaveBeenCalledWith(callerId, currencyId, undefined)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult.data)
    })

    it('should return error status and data when status is not 200', async () => {
      const mockResult = {
        status: 400,
        data: { message: 'Bad request' },
      }

      mockCurrenciesManagementService.setMainCurrency.mockResolvedValue(mockResult)

      await controller.setMainCurrency(currencyId, callerId, mockRequest, mockResponse)

      expect(service.setMainCurrency).toHaveBeenCalledWith(callerId, currencyId, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Bad request',
      })
    })

    it('should return null data when service returns null data', async () => {
      const mockResult = {
        status: 200,
        data: null,
      }

      mockCurrenciesManagementService.setMainCurrency.mockResolvedValue(mockResult)

      await controller.setMainCurrency(currencyId, callerId, mockRequest, mockResponse)

      expect(service.setMainCurrency).toHaveBeenCalledWith(callerId, currencyId, 'Bearer test-token')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(null)
    })
  })
})
