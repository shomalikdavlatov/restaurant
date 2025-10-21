import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CheckUserDto } from "./dto/check.user.dto";
import { Request } from "express";
import { AuthGuard } from "src/common/guards/auth.guard";
import { UpdateUserDto } from "./dto/update.user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller("user")
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create-update")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async checkUser(@Body() body: CheckUserDto, @Req() req: Request) {
    const userId = req["userId"];
    return await this.userService.checkUser(body, userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put("update")
  async updateUser(@Body() body: UpdateUserDto, @Req() req: Request) {
    const userId = req["userId"];
    return await this.userService.updateUser(body, userId);
  }
}
