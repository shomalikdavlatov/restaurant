import { IsEmail, IsString, Length, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 6)
    otp: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}
