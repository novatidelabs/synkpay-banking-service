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

🔒 Security Notes

- Not exposed directly to clients — always behind API Gateway

- All communication secured via JWT validation through Auth Service