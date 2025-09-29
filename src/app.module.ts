import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { DatabaseModule } from "./core/database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { TrafficModule } from "./modules/traffic/traffic.module";
import { EmailModule } from "./core/email/email.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
        DatabaseModule,
        AuthModule,
        UserModule,
        TrafficModule,
        EmailModule,
    ],
})
export class AppModule {}
