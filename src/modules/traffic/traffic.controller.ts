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

@Controller("traffic")
@UseGuards(AuthGuard)
export class TrafficController {
    constructor(private readonly trafficService: TrafficService) {}

    @Post()
    async createTraffic(
        @Body() createTrafficDto: CreateTrafficDto,
        @Req() request: Request
    ) {
        const userId = request['userId'];

        if (!userId) {
            throw new BadRequestException("User ID not found in request");
        }

        return this.trafficService.createOrUpdateTraffic(
            userId,
            createTrafficDto
        );
    }
}
