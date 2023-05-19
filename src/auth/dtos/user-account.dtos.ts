import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}

export class UserAuthorizedDto {
  status: 'success';
  accessToken: string;
  expiresIn: string;

  user: UserAccountDto;
}

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly confirmPassword: string;
}

export class UserAccountDto {
  id: number;
  email: string;
  authProvider: string;
}
