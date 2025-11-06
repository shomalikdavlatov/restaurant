import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    //
    return await this.authService.register(registerDto);
  }

  @Post("verify-registration")
  async verifyRegistration(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const data = await this.authService.verifyRegistrationOTP(verifyOtpDto);
    res.cookie("token", data.token, {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none",
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
      path: "/",
      secure: true,
      sameSite: "none",
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
