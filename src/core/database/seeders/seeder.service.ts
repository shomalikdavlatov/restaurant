import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}
  async onModuleInit() {
    try {
      await this.seedAdmin();
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async seedAdmin() {
    this.logger.log("Admin seeder started");
    const email = this.configService.get("SP_EMAIL");
    const password = this.configService.get("SP_PASSWORD");
    const username = this.configService.get("SP_USERNAME");

    const findAdmin = await this.prisma.user.findFirst({ where: { email } });

    if (!findAdmin) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await this.prisma.user.create({
        data: { email, password: hashedPassword, username, role: "ADMIN" },
      });
      this.logger.log("Admin successfully created");
    } else {
      this.logger.warn("Admin already existed !");
    }
  }
}
