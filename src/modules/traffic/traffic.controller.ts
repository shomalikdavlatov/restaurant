import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { TrafficService } from "./traffic.service";
import { CreateTrafficDto } from "./dto/traffic.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Request } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateDeviceDto } from "./dto/create.device.dto";

@Controller("traffic")
@ApiTags("Traffic")
@UseGuards(AuthGuard)
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Post()
  @ApiBearerAuth()
  async createTraffic(
    @Body() createTrafficDto: CreateTrafficDto,
    @Req() request: Request
  ) {
    const userId = request["userId"];

    if (!userId) {
      throw new BadRequestException("User ID not found in request");
    }

    return this.trafficService.createOrUpdateTraffic(userId, createTrafficDto);
  }

  @Post("create-device")
  @ApiBearerAuth()
  async createDevice(@Body() body: CreateDeviceDto, @Req() request: Request) {
    const userId = request["userId"];
    return await this.trafficService.createDevice(userId, body);
  }
}
