import { Injectable } from '@nestjs/common';
import { UserAccount, UserProfile } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { CreateUserProfileDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAccountByEmail(email: string): Promise<UserAccount> {
    return await this.prisma.userAccount.findFirst({
      where: { email },
    });
  }

  async findAccountById(id: number): Promise<UserAccount> {
    return await this.prisma.userAccount.findFirst({
      where: { id },
    });
  }

  async createAccount(
    email: string,
    authProvider: string,
    passwordHash?: string,
    externalAccessToken?: string,
  ): Promise<UserAccount> {
    return await this.prisma.userAccount.create({
      data: {
        email,
        authProvider,
        passwordHash,
        externalAccessToken,
      },
    });
  }

  async getUserAccountProfile(
    accountId: number,
  ): Promise<UserProfile | undefined> {
    const profile = await this.prisma.userProfile.findFirst({
      where: { accountId },
    });
    return profile;
  }

  async getProfileById(profileId: number): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findFirst({
      where: { id: profileId },
    });
    return profile;
  }

  async createProfile(
    accountId: number,
    profileDto: CreateUserProfileDto,
  ): Promise<UserProfile | undefined> {
    const userProfile = {
      ...profileDto,
    };

    const profile = await this.prisma.userProfile.create({
      data: {
        ...userProfile,
        accountId,
      },
    });
    return profile;
  }
}
