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
import { UpdateDeviceDto } from "./dto/update.device.dto";
import { DeleteDeviceDto } from "./dto/delete.device.dto";

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

  async updateDevice(adminId: number, data: UpdateDeviceDto) {
    const { oldUserId, deviceId, newUserId } = data;

    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin) throw new NotFoundException("Admin topilmadi");
    if (admin.role !== "ADMIN")
      throw new ForbiddenException("Faqat admin device yangilashi mumkin");

    // Mavjud device ni ESKI userId va deviceId bilan topamiz
    const existingDevice = await this.prisma.device.findUnique({
      where: {
        userId_deviceId: {
          userId: oldUserId,
          deviceId: deviceId,
        },
      },
    });

    if (!existingDevice)
      throw new NotFoundException("Yangilanish uchun device topilmadi");

    // Agar yangi userId berilgan bo‘lsa va u eski bilan farq qilsa — conflict check
    if (newUserId && newUserId !== oldUserId) {
      const conflict = await this.prisma.device.findUnique({
        where: {
          userId_deviceId: {
            userId: newUserId,
            deviceId: deviceId,
          },
        },
      });

      if (conflict)
        throw new ConflictException(
          "Bu device allaqachon boshqa filialga biriktirilgan"
        );
    }

    // Faqat yangi userId berilgan bo‘lsa yangilaymiz
    if (newUserId && newUserId !== oldUserId) {
      const updatedDevice = await this.prisma.device.update({
        where: { id: existingDevice.id },
        data: { userId: newUserId },
      });

      return {
        message: "Device muvaffaqiyatli yangilandi (filial o‘zgartirildi)",
        updatedDevice,
      };
    }

    // Agar newUserId yo‘q yoki eski bilan bir xil bo‘lsa — hech nima o‘zgartirmaymiz
    return {
      message: "Device allaqachon shu filialga biriktirilgan (o‘zgarish yo‘q)",
      device: existingDevice,
    };
  }

  async deleteDevice(adminId: number, data: DeleteDeviceDto) {
    const { deviceId, userId } = data;

    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin) throw new NotFoundException("Admin topilmadi");
    if (admin.role !== "ADMIN")
      throw new ForbiddenException("Faqat admin device o'chirishi mumkin");

    const existingDevice = await this.prisma.device.findUnique({
      where: {
        userId_deviceId: {
          userId,
          deviceId,
        },
      },
    });

    if (!existingDevice)
      throw new NotFoundException("Filialda bunday device topilmadi");

    await this.prisma.device.delete({
      where: { id: existingDevice.id },
    });

    return {
      message: "Device muvaffaqiyatli o‘chirildi!",
      deletedDeviceId: deviceId,
    };
  }

  async getAllDevices(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

    if (user.role === "ADMIN") {
      const devices = await this.prisma.device.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { id: "asc" },
      });

      return {
        message: "Barcha devicelar ro‘yxati",
        count: devices.length,
        devices,
      };
    }

    const userDevices = await this.prisma.device.findMany({
      where: { userId },
      orderBy: { id: "asc" },
    });

    return {
      message: "Sizga tegishli devicelar ro‘yxati",
      count: userDevices.length,
      devices: userDevices,
    };
  }
}
