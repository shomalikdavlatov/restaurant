import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CheckUserDto } from "./dto/check.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; username: string; password: string }) {
    return this.prisma.user.create({ data });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmailOrUsername(email: string, username: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }

  async updatePassword(email: string, password: string) {
    return this.prisma.user.update({
      where: { email },
      data: { password },
    });
  }

  async checkUser(data: CheckUserDto, userId: number) {
    const findUser = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!findUser)
      throw new UnauthorizedException("Siz ro'yxatdan o'tishingiz kerak");

    if (data.in_count === 0 && data.out_count === 0) {
      await this.prisma.traffic.create({
        data: {
          deviceId: data.device_id,
          userId,
        },
      });

      return { message: "success" };
    }

    const findDevice = await this.prisma.traffic.findFirst({
      where: { deviceId: data.device_id },
    });

    if (!findDevice) throw new NotFoundException("Device not found");

    const existingTraffic = await this.prisma.traffic.findFirst({
      where: { userId, deviceId: data.device_id },
      orderBy: { dateTime: "desc" },
    });

    if (!existingTraffic) throw new NotFoundException("Traffic not found");

    await this.prisma.traffic.update({
      where: { id: existingTraffic.id },
      data: {
        inCount: data.in_count,
        outCount: data.out_count,
      },
    });

    return { message: "success" };
  }

  async updateUser(data: UpdateUserDto, userId: number) {
    const findBranch = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!findBranch) throw new NotFoundException("Branch not found");

    if (data.email) {
      const findEmail = await this.prisma.user.findFirst({
        where: { email: data.email },
      });
      console.log(findEmail, data);

      if (findEmail) throw new ConflictException("email already existed");
    }

    if (data.username) {
      const findUsername = await this.prisma.user.findFirst({
        where: { username: data.username },
      });

      if (findUsername) throw new ConflictException("username already existed");
    }

    const { password, ...updatedUser } = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return updatedUser;
  }
}
