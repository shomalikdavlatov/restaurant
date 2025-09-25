import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { UserService } from "../user/user.service";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userService;
    constructor(configService: ConfigService, userService: UserService);
    validate(payload: any): Promise<{
        email: string;
        username: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
export {};
