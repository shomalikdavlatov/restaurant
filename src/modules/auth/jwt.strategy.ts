import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    console.log("Handshake auth:", req?.handshake?.auth); // 👈 log this
                    if (req?.headers?.authorization) {
                        return req.headers.authorization.split(" ")[1];
                    }
                    if (req?.handshake?.auth?.token) {
                        return req.handshake.auth.token;
                    }
                    return null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_SECRET")!,
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
return { id: payload.sub, email: payload.email };
    }
}
