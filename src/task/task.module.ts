import { Module } from '@nestjs/common';
import { TasksService } from './task.service';

@Module({
  controllers: [],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
