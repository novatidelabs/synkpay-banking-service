/** npm imports */
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response, NextFunction } from 'express'

/* local imports */
import { InternalAuthMiddleware } from '../internal-auth.middleware'

describe('InternalAuthMiddleware', () => {
  let middleware: InternalAuthMiddleware
  let configService: ConfigService
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  const EXPECTED_SECRET = 'my-super-secret-key'

  beforeEach(() => {
    // Mock ConfigService
    configService = {
      get: jest.fn().mockReturnValue(EXPECTED_SECRET),
    } as any

    middleware = new InternalAuthMiddleware(configService)

    // Mock Request, Response and NextFunction
    mockRequest = {
      headers: {},
    }
    mockResponse = {}
    mockNext = jest.fn()
  })

  it('should be defined', () => {
    expect(middleware).toBeDefined()
  })

  it('should call next() if the x-internal-auth header matches the expected secret', () => {
    mockRequest.headers = {
      'x-internal-auth': EXPECTED_SECRET,
    }

    middleware.use(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })

  it('should throw UnauthorizedException if the x-internal-auth header does not match the expected secret', () => {
    mockRequest.headers = {
      'x-internal-auth': 'wrong-secret',
    }

    expect(() => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext)
    }).toThrow(UnauthorizedException)

    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should throw UnauthorizedException if the x-internal-auth header is missing', () => {
    expect(() => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext)
    }).toThrow(UnauthorizedException)

    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should throw InternalServerErrorException if the secret is not configured', () => {
    configService.get = jest.fn().mockReturnValue(undefined)

    expect(() => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext)
    }).toThrow(InternalServerErrorException)

    expect(mockNext).not.toHaveBeenCalled()
  })
})
