import { appConfig } from "./lib/config.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen({
  port: appConfig.PORT,
  host: "0.0.0.0"
}).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
