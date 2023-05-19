import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserAccount } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import {
  RegisterUserDto,
  UserAccountDto,
  LoginUserDto,
  UserAuthorizedDto,
} from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  /** Search user account by @param email and @returns true if this email already in use */
  async checkAccountExists(email: string): Promise<boolean> {
    const userAccount = await this.usersService.findAccountByEmail(email);
    return !!userAccount;
  }

  async createUserAccount(
    accountDto: RegisterUserDto,
    authProvider = 'newSite',
  ): Promise<UserAccountDto> {
    const passwordHash = await this._hashPassword(accountDto.password);
    const userAccount = await this.usersService.createAccount(
      accountDto.email,
      authProvider,
      passwordHash,
    );
    return {
      id: userAccount.id,
      email: userAccount.email,
      authProvider: userAccount.authProvider,
    };
  }

  async login(loginDto: LoginUserDto): Promise<UserAuthorizedDto | undefined> {
    const userAccount = await this.usersService.findAccountByEmail(
      loginDto.email,
    );

    const passwordMatch = await compare(
      loginDto.password,
      userAccount.passwordHash,
    );

    if (!passwordMatch) {
      return undefined;
    }

    const tokenPayload = {
      ...userAccount,
    };
    delete tokenPayload.passwordHash;
    const accessToken = this._createToken(tokenPayload);

    return {
      status: 'success',
      accessToken,
      expiresIn: process.env.EXPIRESIN,
      user: {
        id: userAccount.id,
        email: userAccount.email,
        authProvider: userAccount.authProvider,
      },
    };
  }

  async validateUser(payload: any): Promise<any> {
    return await this.usersService.findAccountById(payload.id);
  }

  private _createToken(user: Omit<UserAccount, 'passwordHash'>): any {
    const accessToken = this.jwtService.sign(user);
    return accessToken;
  }

  async _hashPassword(password: string): Promise<string> {
    const passwordHash = await hash(password, 10);
    return passwordHash;
  }
}
