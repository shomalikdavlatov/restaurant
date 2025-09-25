import { ConfigService } from "@nestjs/config";
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendOTP(email: string, otp: string): Promise<void>;
    sendPasswordResetOTP(email: string, otp: string): Promise<void>;
}
