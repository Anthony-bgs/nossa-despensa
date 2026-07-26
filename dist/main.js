"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("./swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.APP_URL,
    });
    (0, swagger_1.setupSwagger)(app);
    await app.listen(process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map