import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { EmailService } from "src/core/email/email.service";
import { RedisService } from "src/core/database/redis.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private redisService: RedisService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmailOrUsername(
      registerDto.email,
      registerDto.username
    );
    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp_register_${registerDto.email}`;
    const attemptsKey = `attempts_register_${registerDto.email}`;

    console.log("register ishladi");

    await this.redisService.set(otpKey, otp, 300);
    await this.redisService.set(attemptsKey, "0", 300);
    await this.redisService.set(
      `user_data_${registerDto.email}`,
      JSON.stringify(registerDto),
      300
    );

    await this.emailService.sendOTP(registerDto.email, otp);

    return { message: "OTP sent to email" };
  }

  async verifyRegistrationOTP(verifyOtpDto: VerifyOtpDto) {
    const otpKey = `otp_register_${verifyOtpDto.email}`;
    const attemptsKey = `attempts_register_${verifyOtpDto.email}`;
    const userDataKey = `user_data_${verifyOtpDto.email}`;

    const storedOtp = await this.redisService.get(otpKey);
    const attempts = parseInt(
      (await this.redisService.get(attemptsKey)) || "0"
    );

    if (!storedOtp) {
      throw new BadRequestException("OTP expired");
    }

    if (attempts >= 3) {
      throw new BadRequestException("Too many attempts");
    }

    if (storedOtp !== verifyOtpDto.otp) {
      await this.redisService.incr(attemptsKey);
      throw new BadRequestException("Invalid OTP");
    }

    const userData = await this.redisService.get(userDataKey);
    if (!userData) {
      throw new BadRequestException("Registration data expired");
    }

    const registerDto = JSON.parse(userData);
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.create({
      email: registerDto.email,
      username: registerDto.username,
      password: hashedPassword,
    });

    await this.redisService.del(otpKey);
    await this.redisService.del(attemptsKey);
    await this.redisService.del(userDataKey);

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmailOrUsername(
      loginDto.username,
      loginDto.username
    );
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmailOrUsername(email, email);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp_reset_${email}`;
    const attemptsKey = `attempts_reset_${email}`;

    await this.redisService.set(otpKey, otp, 300);
    await this.redisService.set(attemptsKey, "0", 300);

    await this.emailService.sendPasswordResetOTP(email, otp);

    return { message: "OTP sent to email" };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const otpKey = `otp_reset_${resetPasswordDto.email}`;
    const attemptsKey = `attempts_reset_${resetPasswordDto.email}`;

    const storedOtp = await this.redisService.get(otpKey);
    const attempts = parseInt(
      (await this.redisService.get(attemptsKey)) || "0"
    );

    if (!storedOtp) {
      throw new BadRequestException("OTP expired");
    }

    if (attempts >= 3) {
      throw new BadRequestException("Too many attempts");
    }

    if (storedOtp !== resetPasswordDto.otp) {
      await this.redisService.incr(attemptsKey);
      throw new BadRequestException("Invalid OTP");
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    await this.userService.updatePassword(
      resetPasswordDto.email,
      hashedPassword
    );

    await this.redisService.del(otpKey);
    await this.redisService.del(attemptsKey);

    return { message: "Password reset successfully" };
  }
}
