import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

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
}
