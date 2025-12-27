import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
  Put,
  Delete,
  Res,
  Get,
} from "@nestjs/common";
import { TrafficService } from "./traffic.service";
import { CreateTrafficDto } from "./dto/traffic.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Request } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateDeviceDto } from "./dto/create.device.dto";
import { UpdateDeviceDto } from "./dto/update.device.dto";
import { DeleteDeviceDto } from "./dto/delete.device.dto";

@Controller("traffic")
@ApiTags("Traffic")
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Post()
  async createTraffic(
    @Body() createTrafficDto: CreateTrafficDto,
    @Req() request: Request
  ) {
    const userId = request["userId"];

    if (!userId) {
      throw new BadRequestException("User ID not found in request");
    }

    return this.trafficService.createOrUpdateTraffic(createTrafficDto);
  }

  @Post("create-device")
  @ApiBearerAuth("token")
  @UseGuards(AuthGuard)
  async createDevice(@Body() body: CreateDeviceDto, @Req() request: Request) {
    const userId = request["userId"];
    return await this.trafficService.createDevice(userId, body);
  }

  @Put("update-device")
  @ApiBearerAuth("token")
  @UseGuards(AuthGuard)
  async updateDevice(@Body() body: UpdateDeviceDto, @Req() request: Request) {
    const userId = request["userId"];
    return await this.trafficService.updateDevice(userId, body);
  }

  @Delete("delete-device")
  @ApiBearerAuth("token")
  @UseGuards(AuthGuard)
  async deleteDevice(@Body() body: DeleteDeviceDto, @Req() request: Request) {
    const userid = request["userId"];
    return await this.trafficService.deleteDevice(userid, body);
  }

  @Get("my-all-devices")
  @ApiBearerAuth("token")
  @UseGuards(AuthGuard)
  async getMyBranches(@Req() request: Request) {
    const userId = request["userId"];
    return await this.trafficService.getAllDevices(userId);
  }
}
