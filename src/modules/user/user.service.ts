import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
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
