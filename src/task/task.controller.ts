import {
  Controller,
  Body,
  ClassSerializerInterceptor,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  Get,
  Query,
  DefaultValuePipe,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  TaskDto,
  UpdateTaskDto,
  CreateTaskDto,
  TaskProgressDto,
} from './task.dto';
import { CreateTaskProgressDto } from './task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/')
  public async createTask(
    @Request() req,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskDto> {
    return await this.taskService.createTask(createTaskDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/')
  public async listTasks(): Promise<TaskDto[]> {
    return await this.taskService.listTasks();
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:taskId')
  public async deleteTask(@Param('taskId') taskId: string): Promise<TaskDto> {
    const deleteTaskId = Number.parseInt(taskId);
    return await this.taskService.deleteTask(deleteTaskId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('/:id')
  public async updateTask(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
  ): Promise<TaskDto> {
    const updatedTaskId = Number.parseInt(id);
    return await this.taskService.updateTask(updatedTaskId, task);
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(':taskId/progress')
  public async createTaskProgress(
    @Param('taskId') taskId: string,
    @Body() taskProgress: CreateTaskProgressDto,
  ): Promise<TaskProgressDto> {
    const taskIdForProgress = Number.parseInt(taskId);
    return await this.taskService.createTaskProgress(
      taskProgress,
      taskIdForProgress,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':taskId/progress')
  public async getTaskProgress(
    @Param('taskId') taskId: string,
  ): Promise<TaskProgressDto[]> {
    const taskIdForProgress = Number.parseInt(taskId);
    return await this.taskService.getTaskProgress(taskIdForProgress);
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':taskId/progress/period')
  public async getTaskProgressForPeriod(
    @Param('taskId') taskId: string,
    @Query('progressDate') date: Date,
  ): Promise<TaskProgressDto[]> {
    const taskIdForProgress = Number.parseInt(taskId);
    return await this.taskService.getTaskProgressForPeriod(
      taskIdForProgress,
      date,
    );
  }
}
