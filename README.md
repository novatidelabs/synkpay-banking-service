# 🏦 SynkPay Banking Service

A dedicated microservice responsible for core **banking operations** within the SynkPay ecosystem.  
This service handles account management, balances, transactions, and integrations with SDK.finance.  

---

## 🚀 Tech Stack

- **Framework:** NestJS (TypeScript)
- **API Type:** REST
- **Authorization & Roles:** Delegated to Auth Service
- **Integration:** SDK.finance (banking and ledger operations)
- **Testing:** Jest (unit, e2e, and coverage)

---

## 🔧 Requirements

- Node.js 20 LTS
- Yarn 1.x or 3.x
- (Optional) Postman/Insomnia for endpoint testing

---

## ⚙️ Environment Configuration

Example .env file:

```env
PORT=4000
NODE_ENV=development
SDK_FINANCE_BASE_URL=Base URL for SDK.finance integration
```

---

## Project setup

```bash
$ yarn install
```

## Compile and run the project (Local Development)

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

Health check:
```http
GET http://localhost:4000/api/health
```

## Run tests

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

---

## 🧼 Code Quality

```bash
# format with Prettier
yarn prettier

# lint with ESLint (+ autofix)
yarn lint
```

## Run in Production

```bash
# build the project
yarn build

# run compiled build
yarn start
```
---

## 🔗 Inter-Service Communication

The Banking Service communicates with:

- Auth Service → to validate user identity and permissions

- SDK.finance → for banking & ledger operations

- API Gateway → as the exclusive entry point for clients

All requests include correlation IDs for observability.

---

## 💱 Currency Management

The Banking Service provides comprehensive currency management capabilities through integration with SDK.finance. This module allows you to create, update, view, and manage currencies within your banking system.

### Available Operations

#### Get All Currencies
```http
GET /api/v1/currencies?callerId={callerId}
Authorization: Bearer {token}
```

Retrieves all available currencies in the system.

#### Create Currency
```http
POST /api/v1/currencies?callerId={callerId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "USD",
  "digitalCode": "840",
  "name": "US Dollar",
  "symbol": "$",
  "fraction": 100,
  "scale": 2,
  "active": true,
  "snPrefix": "USD",
  "availableForExchange": true,
  "type": "FIAT"
}
```

Creates a new currency with the specified parameters.

**Required Fields:**
- `code`: Currency code (e.g., "USD", "EUR")
- `name`: Currency name
- `fraction`: Fraction value
- `scale`: Decimal scale
- `type`: Currency type ("FIAT", "CRYPTO", "BONUS", "VIRTUAL")

**Optional Fields:**
- `digitalCode`: ISO 4217 digital code
- `symbol`: Currency symbol
- `active`: Whether the currency is active
- `snPrefix`: Serial number prefix
- `availableForExchange`: Whether available for exchange operations

#### Get Currencies View (Filtered)
```http
POST /api/v1/currencies/view?callerId={callerId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "pageNumber": 1,
  "pageSize": 10,
  "filter": {
    "names": ["USD", "EUR"],
    "activationStatus": "active",
    "text": "dollar",
    "main": true,
    "type": "FIAT"
  },
  "sort": {
    "active": "desc",
    "name": "asc"
  }
}
```

Retrieves currencies with advanced filtering and pagination options.

**Filter Options:**
- `names`: Array of currency names to filter by
- `activationStatus`: Filter by "active" or "inactive" status
- `text`: Text search across currency properties
- `main`: Filter for main currency only
- `type`: Filter by currency type

**Sort Options:**
- `active`: Sort by activation status ("asc" or "desc")
- `name`: Sort by currency name ("asc" or "desc")

#### Update Currency
```http
PATCH /api/v1/currencies/{currencyId}?callerId={callerId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Currency Name",
  "description": "Updated description",
  "active": false,
  "availableForExchange": false,
  "type": "CRYPTO"
}
```

Updates an existing currency with new values. All fields are optional.

#### Set Main Currency
```http
PATCH /api/v1/currencies/{currencyId}/set-main?callerId={callerId}
Authorization: Bearer {token}
```

Sets the specified currency as the main currency for the system.

### Currency Types

The system supports four types of currencies:

- **FIAT**: Traditional fiat currencies (USD, EUR, etc.)
- **CRYPTO**: Cryptocurrencies (BTC, ETH, etc.)
- **BONUS**: Bonus or reward currencies
- **VIRTUAL**: Virtual or game currencies

### Error Handling

All currency management endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (currency not found)
- `500`: Internal Server Error

Error responses include detailed error messages from the SDK.finance integration.

---

## Internal Service Security
This microservice is secured by an internal authentication mechanism. It should not be exposed directly to external clients, as it's designed to be accessed exclusively by authorized internal services.

All incoming requests are validated by the InternalAuthMiddleware, which checks for a unique shared secret within the x-internal-auth header.

### How to Use It

- API Gateway: Our API Gateway is the only service with permission to access this microservice. It must be configured to include a header named x-internal-auth with the correct secret value in every request it forwards.

- Environment Variables: The secret key is stored as an environment variable to prevent it from being hardcoded. Make sure the following variable is defined in the service's .env file or configuration:

```env
INTERNAL_AUTH_SECRET_BANKING_SERVICE=your_unique_and_secure_secret_key
```

- For Development: When testing locally, you can use tools like Postman or Insomnia to manually add the x-internal-auth header to your requests.

---

🔒 Security Notes

- Not exposed directly to clients — always behind API Gateway

- All communication secured via JWT validation through Auth Service