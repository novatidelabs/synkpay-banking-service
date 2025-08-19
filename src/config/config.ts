/* local imports */
import { ConfigKey } from "./enum";

export default () => ({
  [ConfigKey.PORT]: parseInt(process.env.PORT ?? "4000", 10),
  [ConfigKey.NODE_ENV]: process.env.NODE_ENV ?? "development",
  [ConfigKey.SDK_FINANCE_BASE_URL]: process.env.SDK_FINANCE_BASE_URL,
  [ConfigKey.INTERNAL_AUTH_SECRET_BANKING_SERVICE]:
    process.env.INTERNAL_AUTH_SECRET_BANKING_SERVICE,
});
