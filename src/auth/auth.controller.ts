import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  LoginUserDto,
  RegisterUserDto,
  UserAccountDto,
  UserAuthorizedDto,
} from './dtos';
import { JwtAuthGuard } from '../strategies/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() account: RegisterUserDto,
  ): Promise<UserAccountDto> {
    if (account.password !== account.confirmPassword) {
      throw new HttpException('PASSWORDS_NOT_MATCH', HttpStatus.BAD_REQUEST);
    }

    const isAccountExists = await this.authService.checkAccountExists(
      account.email,
    );
    if (isAccountExists) {
      throw new HttpException('ACCOUNT_EXISTS', HttpStatus.BAD_REQUEST);
    }

    try {
      const userAccount = await this.authService.createUserAccount(account);
      return userAccount;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  public async login(@Body() login: LoginUserDto): Promise<UserAuthorizedDto> {
    const isAccountExists = await this.authService.checkAccountExists(
      login.email,
    );
    if (!isAccountExists) {
      throw new HttpException('ACCOUNT_NOT_EXISTS', HttpStatus.BAD_REQUEST);
    }

    const authenticationInfo = await this.authService.login(login);
    if (!authenticationInfo) {
      throw new HttpException('WRONG_PASSWORD', HttpStatus.BAD_REQUEST);
    }

    return authenticationInfo;
  }
}
