import { Test, TestingModule } from "@nestjs/testing";
import { CurrenciesManagementService } from "../currency-management.service";
import { SDKFinanceClient } from "@novatide/sdk-finance-wrapper";
import { RedisTokenService } from "../../../redis/redis.token.service";

/* eslint-disable @typescript-eslint/unbound-method */
describe("CurrenciesManagementService", () => {
  let service: CurrenciesManagementService;
  let sdkFinanceClient: SDKFinanceClient;
  let redisTokenService: RedisTokenService;

  const mockSDKFinanceClient = {
    createAuthenticatedClient: jest.fn(),
  };

  const mockRedisTokenService = {
    getTokens: jest.fn(),
  };

  const mockAuthenticatedClient = {
    banking: {
      getCurrencies: jest.fn(),
      createCurrency: jest.fn(),
      getCurrenciesView: jest.fn(),
      updateCurrency: jest.fn(),
      setMainCurrency: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesManagementService,
        {
          provide: SDKFinanceClient,
          useValue: mockSDKFinanceClient,
        },
        {
          provide: RedisTokenService,
          useValue: mockRedisTokenService,
        },
      ],
    }).compile();

    service = module.get<CurrenciesManagementService>(
      CurrenciesManagementService,
    );
    sdkFinanceClient = module.get<SDKFinanceClient>(SDKFinanceClient);
    redisTokenService = module.get<RedisTokenService>(RedisTokenService);

    // Setup default mocks
    mockSDKFinanceClient.createAuthenticatedClient.mockReturnValue(
      mockAuthenticatedClient,
    );
    mockRedisTokenService.getTokens.mockResolvedValue({
      sdkFinanceAccessToken: "redis-token",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCurrencies", () => {
    const callerId = "test-caller-id";
    const authorization = "Bearer auth-token";

    it("should get currencies successfully with authorization token", async () => {
      const mockResponse = {
        status: 200,
        data: [
          { id: "1", code: "USD", name: "US Dollar" },
          { id: "2", code: "EUR", name: "Euro" },
        ],
      };

      mockAuthenticatedClient.banking.getCurrencies.mockResolvedValue(
        mockResponse,
      );

      const result = await service.getCurrencies(callerId, authorization);

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "auth-token",
      );
      expect(mockAuthenticatedClient.banking.getCurrencies).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it("should get currencies successfully using Redis token when no authorization provided", async () => {
      const mockResponse = {
        status: 200,
        data: [{ id: "1", code: "USD", name: "US Dollar" }],
      };

      mockAuthenticatedClient.banking.getCurrencies.mockResolvedValue(
        mockResponse,
      );

      const result = await service.getCurrencies(callerId);

      expect(redisTokenService.getTokens).toHaveBeenCalledWith(callerId);
      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "redis-token",
      );
      expect(mockAuthenticatedClient.banking.getCurrencies).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it("should handle authorization token with Bearer prefix", async () => {
      const mockResponse = { status: 200, data: [] };
      mockAuthenticatedClient.banking.getCurrencies.mockResolvedValue(
        mockResponse,
      );

      await service.getCurrencies(callerId, "Bearer test-token");

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "test-token",
      );
    });

    it("should handle authorization token without Bearer prefix", async () => {
      const mockResponse = { status: 200, data: [] };
      mockAuthenticatedClient.banking.getCurrencies.mockResolvedValue(
        mockResponse,
      );

      await service.getCurrencies(callerId, "test-token");

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "test-token",
      );
    });

    it("should handle authorization token with extra spaces", async () => {
      const mockResponse = { status: 200, data: [] };
      mockAuthenticatedClient.banking.getCurrencies.mockResolvedValue(
        mockResponse,
      );

      await service.getCurrencies(callerId, "  Bearer  test-token  ");

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "Bearer  test-token",
      );
    });

    it("should handle authorization token with spaces only at the end", async () => {
      const mockResponse = { status: 200, data: [] };
      mockAuthenticatedClient.banking.getCurrencies.mockResolvedValue(
        mockResponse,
      );

      await service.getCurrencies(callerId, "Bearer test-token  ");

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "test-token",
      );
    });

    it("should handle authorization token with Bearer at the beginning", async () => {
      const mockResponse = { status: 200, data: [] };
      mockAuthenticatedClient.banking.getCurrencies.mockResolvedValue(
        mockResponse,
      );

      await service.getCurrencies(callerId, "Bearer test-token");

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "test-token",
      );
    });

    it("should handle authorization token with Bearer and spaces at the beginning", async () => {
      const mockResponse = { status: 200, data: [] };
      mockAuthenticatedClient.banking.getCurrencies.mockResolvedValue(
        mockResponse,
      );

      await service.getCurrencies(callerId, "Bearer  test-token");

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "test-token",
      );
    });

    it("should handle Axios error and return error response", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: "Bad request" },
        },
      };
      mockAuthenticatedClient.banking.getCurrencies.mockRejectedValue(
        axiosError,
      );

      const result = await service.getCurrencies(callerId, authorization);

      expect(result).toEqual({
        status: 400,
        data: { message: "Bad request" },
      });
    });

    it("should rethrow non-Axios errors", async () => {
      const nonAxiosError = new Error("Database connection failed");
      mockAuthenticatedClient.banking.getCurrencies.mockRejectedValue(
        nonAxiosError,
      );

      await expect(
        service.getCurrencies(callerId, authorization),
      ).rejects.toThrow("Database connection failed");
    });
  });

  describe("createCurrency", () => {
    const callerId = "test-caller-id";
    const authorization = "Bearer auth-token";
    const createCurrencyParams = {
      code: "USD",
      name: "US Dollar",
      fraction: 100,
      scale: 2,
      type: "FIAT" as const,
    };

    it("should create currency successfully with authorization token", async () => {
      const mockResponse = {
        status: 200,
        data: { id: "1", code: "USD", name: "US Dollar" },
      };

      mockAuthenticatedClient.banking.createCurrency.mockResolvedValue(
        mockResponse,
      );

      const result = await service.createCurrency(
        callerId,
        createCurrencyParams,
        authorization,
      );

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "auth-token",
      );
      expect(
        mockAuthenticatedClient.banking.createCurrency,
      ).toHaveBeenCalledWith(createCurrencyParams);
      expect(result).toEqual(mockResponse);
    });

    it("should create currency successfully using Redis token when no authorization provided", async () => {
      const mockResponse = {
        status: 200,
        data: { id: "1", code: "USD", name: "US Dollar" },
      };

      mockAuthenticatedClient.banking.createCurrency.mockResolvedValue(
        mockResponse,
      );

      const result = await service.createCurrency(
        callerId,
        createCurrencyParams,
      );

      expect(redisTokenService.getTokens).toHaveBeenCalledWith(callerId);
      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "redis-token",
      );
      expect(
        mockAuthenticatedClient.banking.createCurrency,
      ).toHaveBeenCalledWith(createCurrencyParams);
      expect(result).toEqual(mockResponse);
    });

    it("should handle Axios error and return error response", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 409,
          data: { message: "Currency already exists" },
        },
      };
      mockAuthenticatedClient.banking.createCurrency.mockRejectedValue(
        axiosError,
      );

      const result = await service.createCurrency(
        callerId,
        createCurrencyParams,
        authorization,
      );

      expect(result).toEqual({
        status: 409,
        data: { message: "Currency already exists" },
      });
    });

    it("should rethrow non-Axios errors", async () => {
      const nonAxiosError = new Error("Validation failed");
      mockAuthenticatedClient.banking.createCurrency.mockRejectedValue(
        nonAxiosError,
      );

      await expect(
        service.createCurrency(callerId, createCurrencyParams, authorization),
      ).rejects.toThrow("Validation failed");
    });

    it("should handle authorization token with extra spaces", async () => {
      const mockResponse = {
        status: 200,
        data: { id: "1", code: "USD", name: "US Dollar" },
      };
      mockAuthenticatedClient.banking.createCurrency.mockResolvedValue(
        mockResponse,
      );

      await service.createCurrency(
        callerId,
        createCurrencyParams,
        "  Bearer  test-token  ",
      );

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "Bearer  test-token",
      );
    });
  });

  describe("getCurrenciesView", () => {
    const callerId = "test-caller-id";
    const authorization = "Bearer auth-token";
    const currencyViewParams = {
      pageNumber: 1,
      pageSize: 10,
      filter: {
        names: ["USD", "EUR"],
        activationStatus: "active" as const,
      },
    };

    it("should get currencies view successfully with authorization token", async () => {
      const mockResponse = {
        status: 200,
        data: {
          currencies: [
            { id: "1", code: "USD", name: "US Dollar" },
            { id: "2", code: "EUR", name: "Euro" },
          ],
          total: 2,
        },
      };

      mockAuthenticatedClient.banking.getCurrenciesView.mockResolvedValue(
        mockResponse,
      );

      const result = await service.getCurrenciesView(
        callerId,
        currencyViewParams,
        authorization,
      );

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "auth-token",
      );
      expect(
        mockAuthenticatedClient.banking.getCurrenciesView,
      ).toHaveBeenCalledWith(currencyViewParams);
      expect(result).toEqual(mockResponse);
    });

    it("should get currencies view successfully using Redis token when no authorization provided", async () => {
      const mockResponse = {
        status: 200,
        data: {
          currencies: [{ id: "1", code: "USD", name: "US Dollar" }],
          total: 1,
        },
      };

      mockAuthenticatedClient.banking.getCurrenciesView.mockResolvedValue(
        mockResponse,
      );

      const result = await service.getCurrenciesView(
        callerId,
        currencyViewParams,
      );

      expect(redisTokenService.getTokens).toHaveBeenCalledWith(callerId);
      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "redis-token",
      );
      expect(
        mockAuthenticatedClient.banking.getCurrenciesView,
      ).toHaveBeenCalledWith(currencyViewParams);
      expect(result).toEqual(mockResponse);
    });

    it("should handle Axios error and return error response", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: "Invalid filter parameters" },
        },
      };
      mockAuthenticatedClient.banking.getCurrenciesView.mockRejectedValue(
        axiosError,
      );

      const result = await service.getCurrenciesView(
        callerId,
        currencyViewParams,
        authorization,
      );

      expect(result).toEqual({
        status: 400,
        data: { message: "Invalid filter parameters" },
      });
    });

    it("should rethrow non-Axios errors", async () => {
      const nonAxiosError = new Error("Filter processing failed");
      mockAuthenticatedClient.banking.getCurrenciesView.mockRejectedValue(
        nonAxiosError,
      );

      await expect(
        service.getCurrenciesView(callerId, currencyViewParams, authorization),
      ).rejects.toThrow("Filter processing failed");
    });

    it("should handle authorization token with extra spaces", async () => {
      const mockResponse = { status: 200, data: { currencies: [], total: 0 } };
      mockAuthenticatedClient.banking.getCurrenciesView.mockResolvedValue(
        mockResponse,
      );

      await service.getCurrenciesView(
        callerId,
        currencyViewParams,
        "  Bearer  test-token  ",
      );

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "Bearer  test-token",
      );
    });
  });

  describe("updateCurrency", () => {
    const callerId = "test-caller-id";
    const currencyId = "test-currency-id";
    const authorization = "Bearer auth-token";
    const updateCurrencyParams = {
      name: "Updated US Dollar",
      active: true,
    };

    it("should update currency successfully with authorization token", async () => {
      const mockResponse = {
        status: 200,
        data: { id: currencyId, code: "USD", name: "Updated US Dollar" },
      };

      mockAuthenticatedClient.banking.updateCurrency.mockResolvedValue(
        mockResponse,
      );

      const result = await service.updateCurrency(
        callerId,
        currencyId,
        updateCurrencyParams,
        authorization,
      );

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "auth-token",
      );
      expect(
        mockAuthenticatedClient.banking.updateCurrency,
      ).toHaveBeenCalledWith(currencyId, updateCurrencyParams);
      expect(result).toEqual(mockResponse);
    });

    it("should update currency successfully using Redis token when no authorization provided", async () => {
      const mockResponse = {
        status: 200,
        data: { id: currencyId, code: "USD", name: "Updated US Dollar" },
      };

      mockAuthenticatedClient.banking.updateCurrency.mockResolvedValue(
        mockResponse,
      );

      const result = await service.updateCurrency(
        callerId,
        currencyId,
        updateCurrencyParams,
      );

      expect(redisTokenService.getTokens).toHaveBeenCalledWith(callerId);
      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "redis-token",
      );
      expect(
        mockAuthenticatedClient.banking.updateCurrency,
      ).toHaveBeenCalledWith(currencyId, updateCurrencyParams);
      expect(result).toEqual(mockResponse);
    });

    it("should handle partial update parameters", async () => {
      const partialParams = { name: "New Name" };
      const mockResponse = {
        status: 200,
        data: { id: currencyId, code: "USD", name: "New Name" },
      };

      mockAuthenticatedClient.banking.updateCurrency.mockResolvedValue(
        mockResponse,
      );

      const result = await service.updateCurrency(
        callerId,
        currencyId,
        partialParams,
        authorization,
      );

      expect(
        mockAuthenticatedClient.banking.updateCurrency,
      ).toHaveBeenCalledWith(currencyId, partialParams);
      expect(result).toEqual(mockResponse);
    });

    it("should handle Axios error and return error response", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: { message: "Currency not found" },
        },
      };
      mockAuthenticatedClient.banking.updateCurrency.mockRejectedValue(
        axiosError,
      );

      const result = await service.updateCurrency(
        callerId,
        currencyId,
        updateCurrencyParams,
        authorization,
      );

      expect(result).toEqual({
        status: 404,
        data: { message: "Currency not found" },
      });
    });

    it("should rethrow non-Axios errors", async () => {
      const nonAxiosError = new Error("Update operation failed");
      mockAuthenticatedClient.banking.updateCurrency.mockRejectedValue(
        nonAxiosError,
      );

      await expect(
        service.updateCurrency(
          callerId,
          currencyId,
          updateCurrencyParams,
          authorization,
        ),
      ).rejects.toThrow("Update operation failed");
    });

    it("should handle authorization token with extra spaces", async () => {
      const mockResponse = {
        status: 200,
        data: { id: currencyId, code: "USD", name: "Updated US Dollar" },
      };
      mockAuthenticatedClient.banking.updateCurrency.mockResolvedValue(
        mockResponse,
      );

      await service.updateCurrency(
        callerId,
        currencyId,
        updateCurrencyParams,
        "  Bearer  test-token  ",
      );

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "Bearer  test-token",
      );
    });
  });

  describe("setMainCurrency", () => {
    const callerId = "test-caller-id";
    const currencyId = "test-currency-id";
    const authorization = "Bearer auth-token";

    it("should set main currency successfully with authorization token", async () => {
      const mockResponse = {
        status: 200,
        data: { id: currencyId, code: "USD", name: "US Dollar", main: true },
      };

      mockAuthenticatedClient.banking.setMainCurrency.mockResolvedValue(
        mockResponse,
      );

      const result = await service.setMainCurrency(
        callerId,
        currencyId,
        authorization,
      );

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "auth-token",
      );
      expect(
        mockAuthenticatedClient.banking.setMainCurrency,
      ).toHaveBeenCalledWith(currencyId);
      expect(result).toEqual(mockResponse);
    });

    it("should set main currency successfully using Redis token when no authorization provided", async () => {
      const mockResponse = {
        status: 200,
        data: { id: currencyId, code: "USD", name: "US Dollar", main: true },
      };

      mockAuthenticatedClient.banking.setMainCurrency.mockResolvedValue(
        mockResponse,
      );

      const result = await service.setMainCurrency(callerId, currencyId);

      expect(redisTokenService.getTokens).toHaveBeenCalledWith(callerId);
      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "redis-token",
      );
      expect(
        mockAuthenticatedClient.banking.setMainCurrency,
      ).toHaveBeenCalledWith(currencyId);
      expect(result).toEqual(mockResponse);
    });

    it("should handle Axios error and return error response", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: "Cannot set main currency" },
        },
      };
      mockAuthenticatedClient.banking.setMainCurrency.mockRejectedValue(
        axiosError,
      );

      const result = await service.setMainCurrency(
        callerId,
        currencyId,
        authorization,
      );

      expect(result).toEqual({
        status: 400,
        data: { message: "Cannot set main currency" },
      });
    });

    it("should rethrow non-Axios errors", async () => {
      const nonAxiosError = new Error("Main currency setting failed");
      mockAuthenticatedClient.banking.setMainCurrency.mockRejectedValue(
        nonAxiosError,
      );

      await expect(
        service.setMainCurrency(callerId, currencyId, authorization),
      ).rejects.toThrow("Main currency setting failed");
    });

    it("should handle authorization token with extra spaces", async () => {
      const mockResponse = {
        status: 200,
        data: { id: currencyId, code: "USD", name: "US Dollar", main: true },
      };
      mockAuthenticatedClient.banking.setMainCurrency.mockResolvedValue(
        mockResponse,
      );

      await service.setMainCurrency(
        callerId,
        currencyId,
        "  Bearer  test-token  ",
      );

      expect(sdkFinanceClient.createAuthenticatedClient).toHaveBeenCalledWith(
        "Bearer  test-token",
      );
    });
  });
});
