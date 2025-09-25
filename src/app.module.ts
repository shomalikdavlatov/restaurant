import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TrafficModule } from "./traffic/traffic.module";
import { EmailModule } from "./email/email.module";

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
