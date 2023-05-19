import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  goal: number;

  @ApiProperty()
  @IsNotEmpty()
  metadata: string;
}

export class TaskDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  goal: number;

  @ApiProperty()
  metadata: string;
}

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  goal: number;

  @ApiProperty()
  @IsNotEmpty()
  metadata: string;
}

export class CreateTaskProgressDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  progressDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  actualProgress: number;

  @ApiProperty()
  @IsNotEmpty()
  taskDone: boolean;
}

export class TaskProgressDto {
  @ApiProperty()
  progressDate: Date;

  @ApiProperty()
  actualProgress: number;

  @ApiProperty()
  taskDone: boolean;
}
