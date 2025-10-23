import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateTrafficDto } from "./dto/traffic.dto";
import { CreateDeviceDto } from "./dto/create.device.dto";

@Injectable()
export class TrafficService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateTraffic(userId: number, dto: CreateTrafficDto) {
    const { device_id, in_count, out_count } = dto;

    if (in_count <= 0 && out_count <= 0) {
      throw new BadRequestException("incount va outcount xato kiritilgan");
    }

    const findDevice = await this.prisma.device.findUnique({
      where: {
        userId_deviceId: {
          userId,
          deviceId: device_id,
        },
      },
    });

    if (!findDevice)
      throw new NotFoundException("filialda ushbu device topilmadi");

    const now = new Date();
    const dateTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      0,
      0,
      0
    );

    const traffic = await this.prisma.traffic.upsert({
      where: {
        userId_dateTime: {
          userId,
          dateTime,
        },
      },
      update: {
        inCount: in_count,
        outCount: out_count,
      },
      create: {
        userId,
        dateTime,
        inCount: in_count,
        outCount: out_count,
      },
    });

    return traffic;
  }

  async createDevice(userId: number, data: CreateDeviceDto) {
    const findAdmin = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!findAdmin) throw new NotFoundException("Admin not found");

    if (findAdmin.role === "USER")
      throw new ForbiddenException("faqat admin device qo'shish huquqiga ega");

    const findUser = await this.prisma.user.findFirst({
      where: { id: data.userId },
    });

    if (!findUser) throw new NotFoundException("Filial topilmadi");

    const findDevice = await this.prisma.device.findUnique({
      where: {
        userId_deviceId: {
          userId,
          deviceId: data.deviceId,
        },
      },
    });

    if (findDevice)
      throw new ConflictException(
        "Filialga ushu device oldin ro'yxatga olingan"
      );

    const newDevice = await this.prisma.device.create({ data });

    return { message: "success", newDevice };
  }
}
