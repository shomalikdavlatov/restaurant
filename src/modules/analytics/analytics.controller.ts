import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { Request } from "express";
import { AuthGuard } from "src/common/guards/auth.guard";
import { ApiBearerAuth, ApiTags, ApiQuery } from "@nestjs/swagger";

@Controller("analytics")
@ApiTags("Analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get("visitors")
  @ApiQuery({
    name: "from",
    example: "2025-10-01",
    description: "Boshlanish sanasi",
    required: true,
  })
  @ApiQuery({
    name: "to",
    example: "2025-10-21",
    description: "Tugash sanasi",
    required: true,
  })
  async getVisitors(
    @Query("from") from: Date,
    @Query("to") to: Date,
    @Req() req: Request
  ) {
    const userId = req["userId"];
    return await this.analyticsService.getVisitors(from, to, userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get("today-branches")
  async getTodayBranches() {
    return await this.analyticsService.getTodayBranches();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get("day-statistics")
  @ApiQuery({
    name: "day",
    example: "2025-10-21",
    description: "Statistika uchun sana",
    required: true,
  })
  async getDayStatistics(@Query("day") day: Date) {
    return await this.analyticsService.getDayStatistics(day);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get("branches")
  async getAllBranches() {
    return await this.analyticsService.getAllBranches();
  }
}
