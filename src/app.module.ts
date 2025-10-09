import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { CoreModule } from "./core/core.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";

@Module({
  imports: [CoreModule, AuthModule, UserModule, AnalyticsModule],
})
export class AppModule {}
