import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    verifyRegistration(verifyOtpDto: VerifyOtpDto): Promise<{
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
