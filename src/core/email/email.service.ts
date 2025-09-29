import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
    private transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.configService.get("GMAIL_EMAIL"),
                pass: this.configService.get("GMAIL_PASSWORD"),
            },
        });
    }

    async sendOTP(email: string, otp: string): Promise<void> {
        await this.transporter.sendMail({
            from: this.configService.get("GMAIL_EMAIL"),
            to: email,
            subject: "Email Verification OTP",
            html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p><p>This OTP will expire in 5 minutes.</p>`,
        });
    }

    async sendPasswordResetOTP(email: string, otp: string): Promise<void> {
        await this.transporter.sendMail({
            from: this.configService.get("GMAIL_EMAIL"),
            to: email,
            subject: "Password Reset OTP",
            html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP will expire in 5 minutes.</p>`,
        });
    }
}
