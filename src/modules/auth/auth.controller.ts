import { Controller, Post, Body, HttpCode, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("verify-registration")
  async verifyRegistration(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const data = await this.authService.verifyRegistrationOTP(verifyOtpDto);
    res.cookie("token", data.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 4.05 * 3600 * 1000,
    });
    return data;
  }

  @HttpCode(200)
  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const data = await this.authService.login(loginDto);

    res.cookie("token", data.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 4.05 * 3600 * 1000,
    });
    return data;
  }

  @Post("forgot-password")
  forgotPassword(@Body("email") email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post("reset-password")
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
