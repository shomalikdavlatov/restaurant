import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getVisitors(from: Date, to: Date, userId: number) {
    const data = await this.prisma.traffic.groupBy({
      by: ["dateTime"],
      where: {
        userId,
        dateTime: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      _sum: {
        inCount: true,
        outCount: true,
      },
      orderBy: {
        dateTime: "asc",
      },
    });

    return data.map((item) => ({
      date: item.dateTime.toISOString().split("T")[0],
      totalIn: item._sum.inCount || 0,
      totalOut: item._sum.outCount || 0,
    }));
  }

  async getTodayBranches() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const data = await this.prisma.traffic.groupBy({
      by: ["userId"],
      where: {
        dateTime: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      _sum: {
        inCount: true,
        outCount: true,
      },
      orderBy: {
        userId: "asc",
      },
    });

    const users = await this.prisma.user.findMany({
      select: { id: true, username: true },
    });

    const result = users.map((user) => {
      const traffic = data.find((t) => t.userId === user.id);
      return {
        userId: user.id,
        username: user.username,
        inCount: traffic?._sum.inCount || 0,
        outCount: traffic?._sum.outCount || 0,
      };
    });

    return result;
  }

  async getDayStatistics(day: Date) {
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    const traffics = await this.prisma.traffic.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        dateTime: true,
        inCount: true,
        outCount: true,
      },
    });

    const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      inCount: 0,
      outCount: 0,
    }));

    for (const t of traffics) {
      const hour = new Date(t.dateTime).getHours();
      hourlyStats[hour].inCount += t.inCount;
      hourlyStats[hour].outCount += t.outCount;
    }

    return hourlyStats;
  }

  async getAllBranches() {
    const branches = await this.prisma.user.findMany({
      include: {
        traffics: {
          orderBy: { dateTime: "desc" },
          take: 1,
        },
      },
    });

    const results = await Promise.all(
      branches.map(async (branch) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const stats = await this.prisma.traffic.aggregate({
          where: {
            userId: branch.id,
            dateTime: {
              gte: today,
              lt: tomorrow,
            },
          },
          _sum: {
            inCount: true,
            outCount: true,
          },
        });

        return {
          id: branch.id,
          name: branch.username,
          email: branch.email,
          lastActivity: branch.traffics[0]?.dateTime || null,
          inCount: stats._sum.inCount || 0,
          outCount: stats._sum.outCount || 0,
        };
      })
    );

    return results;
  }
}
