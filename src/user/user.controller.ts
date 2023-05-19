import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';
import { CreateUserProfileDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  public async me(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  public async getProfile(@Request() req) {
    const profile = await this.userService.getUserAccountProfile(req.user.id);
    if (!profile) {
      throw new HttpException('PROFILE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('profile')
  public async createProfile(
    @Request() req,
    @Body() profileDto: CreateUserProfileDto,
  ) {
    const userId = req.user.id;
    const profileExists = await this.userService.getUserAccountProfile(userId);
    if (profileExists) {
      throw new HttpException('PROFILE_EXISTS', HttpStatus.BAD_REQUEST);
    }

    try {
      const profile = await this.userService.createProfile(
        req.user.id,
        profileDto,
      );
      return profile;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
