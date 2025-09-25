import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { EmailService } from "../email/email.service";
import { RedisService } from "../database/redis.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
export declare class AuthService {
    private userService;
    private jwtService;
    private emailService;
    private redisService;
    constructor(userService: UserService, jwtService: JwtService, emailService: EmailService, redisService: RedisService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    verifyRegistrationOTP(verifyOtpDto: VerifyOtpDto): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            username: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            username: string;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
