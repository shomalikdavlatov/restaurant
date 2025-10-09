import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { Request } from "express";
import { AuthGuard } from "src/common/guards/auth.guard";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(AuthGuard)
  @Get("visitors")
  async getVisitors(
    @Query("from") from: Date,
    @Query("to") to: Date,
    @Req() req: Request
  ) {
    const userId = req["userId"];
    return await this.analyticsService.getVisitors(from, to, userId);
  }

  @UseGuards(AuthGuard)
  @Get("today-branches")
  async getTodayBranches() {
    return await this.analyticsService.getTodayBranches();
  }

  @UseGuards(AuthGuard)
  @Get("day-statistics")
  async getDayStatistics(@Query("day") day: Date) {
    return await this.analyticsService.getDayStatistics(day);
  }

  @UseGuards(AuthGuard)
  @Get("branches")
  async getAllBranches() {
    return await this.analyticsService.getAllBranches();
  }
}
