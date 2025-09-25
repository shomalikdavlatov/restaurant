"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const user_service_1 = require("../user/user.service");
const email_service_1 = require("../email/email.service");
const redis_service_1 = require("../database/redis.service");
let AuthService = class AuthService {
    userService;
    jwtService;
    emailService;
    redisService;
    constructor(userService, jwtService, emailService, redisService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.redisService = redisService;
    }
    async register(registerDto) {
        const existingUser = await this.userService.findByEmailOrUsername(registerDto.email, registerDto.username);
        if (existingUser) {
            throw new common_1.BadRequestException("User already exists");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpKey = `otp_register_${registerDto.email}`;
        const attemptsKey = `attempts_register_${registerDto.email}`;
        await this.redisService.set(otpKey, otp, 300);
        await this.redisService.set(attemptsKey, "0", 300);
        await this.redisService.set(`user_data_${registerDto.email}`, JSON.stringify(registerDto), 300);
        await this.emailService.sendOTP(registerDto.email, otp);
        return { message: "OTP sent to email" };
    }
    async verifyRegistrationOTP(verifyOtpDto) {
        const otpKey = `otp_register_${verifyOtpDto.email}`;
        const attemptsKey = `attempts_register_${verifyOtpDto.email}`;
        const userDataKey = `user_data_${verifyOtpDto.email}`;
        const storedOtp = await this.redisService.get(otpKey);
        const attempts = parseInt((await this.redisService.get(attemptsKey)) || "0");
        if (!storedOtp) {
            throw new common_1.BadRequestException("OTP expired");
        }
        if (attempts >= 3) {
            throw new common_1.BadRequestException("Too many attempts");
        }
        if (storedOtp !== verifyOtpDto.otp) {
            await this.redisService.incr(attemptsKey);
            throw new common_1.BadRequestException("Invalid OTP");
        }
        const userData = await this.redisService.get(userDataKey);
        if (!userData) {
            throw new common_1.BadRequestException("Registration data expired");
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
            user: { id: user.id, email: user.email, username: user.username },
        };
    }
    async login(loginDto) {
        const user = await this.userService.findByEmailOrUsername(loginDto.username, loginDto.username);
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const payload = { sub: user.id, username: user.username };
        const token = this.jwtService.sign(payload);
        return {
            token,
            user: { id: user.id, email: user.email, username: user.username },
        };
    }
    async forgotPassword(email) {
        const user = await this.userService.findByEmailOrUsername(email, email);
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpKey = `otp_reset_${email}`;
        const attemptsKey = `attempts_reset_${email}`;
        await this.redisService.set(otpKey, otp, 300);
        await this.redisService.set(attemptsKey, "0", 300);
        await this.emailService.sendPasswordResetOTP(email, otp);
        return { message: "OTP sent to email" };
    }
    async resetPassword(resetPasswordDto) {
        const otpKey = `otp_reset_${resetPasswordDto.email}`;
        const attemptsKey = `attempts_reset_${resetPasswordDto.email}`;
        const storedOtp = await this.redisService.get(otpKey);
        const attempts = parseInt((await this.redisService.get(attemptsKey)) || "0");
        if (!storedOtp) {
            throw new common_1.BadRequestException("OTP expired");
        }
        if (attempts >= 3) {
            throw new common_1.BadRequestException("Too many attempts");
        }
        if (storedOtp !== resetPasswordDto.otp) {
            await this.redisService.incr(attemptsKey);
            throw new common_1.BadRequestException("Invalid OTP");
        }
        const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
        await this.userService.updatePassword(resetPasswordDto.email, hashedPassword);
        await this.redisService.del(otpKey);
        await this.redisService.del(attemptsKey);
        return { message: "Password reset successfully" };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map