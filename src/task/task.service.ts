import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { supabase } from '../utils/supabase';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  
  //@Cron(CronExpression.EVERY_MINUTE)
    async deletarConvite(): Promise<void> {
         const datehoje = new Date();
         console.log(datehoje);
         datehoje.setDate(datehoje.getDate() + 1);
         await supabase.from("codigo_convite").delete().lt("created_at", datehoje.toISOString());
    
  }}
