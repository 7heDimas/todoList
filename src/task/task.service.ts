import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import {
  UpdateTaskDto,
  CreateTaskDto,
  CreateTaskProgressDto,
} from './task.dto';
import { Task, TaskProgress } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(app: CreateTaskDto, userProfileId: number): Promise<any> {
    return await this.prisma.task.create({
      data: {
        title: app.title,
        goal: app.goal,
        metadata: app.metadata,
        userProfileId,
      },
    });
  }

  async listTasks(): Promise<Task[]> {
    return await this.prisma.task.findMany();
  }

  async deleteTask(taskId: number): Promise<Task> {
    return await this.prisma.task.delete({ where: { id: taskId } });
  }

  async updateTask(taskId: number, taskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.update({
      data: {
        title: taskDto.title,
        goal: taskDto.goal,
        metadata: taskDto.metadata,
      },
      where: { id: taskId },
    });
    return task;
  }

  async createTaskProgress(
    app: CreateTaskProgressDto,
    taskId: number,
  ): Promise<TaskProgress> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
    });

    if (task.goal <= app.actualProgress) {
      app.taskDone = true;
    }

    const taskProgressCreated = await this.prisma.taskProgress.create({
      data: {
        ...app,
        taskId,
      },
    });
    return taskProgressCreated;
  }

  async getTaskProgressForPeriod(
    taskId: number,
    date: Date,
  ): Promise<TaskProgress[]> {
    const fromDate = date ? new Date(date) : undefined;
    const toDate = date ? new Date(date) : undefined;

    if (fromDate) {
      fromDate.setHours(0, 0, 0, 0);
    }

    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }
    const taskProgress = await this.prisma.taskProgress.findMany({
      where: {
        AND: [
          {
            taskId,
            progressDate:
              fromDate && toDate
                ? {
                    lte: toDate,
                    gte: fromDate,
                  }
                : undefined,
          },
        ],
      },
    });
    return taskProgress;
  }

  async getTaskProgress(taskId: number): Promise<TaskProgress[]> {
    return await this.prisma.taskProgress.findMany({
      where: { taskId: taskId },
    });
  }
}
