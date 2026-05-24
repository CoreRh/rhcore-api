import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { Vacation } from 'src/vacations/entities/vacation.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Request } from 'src/requests/entities/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Vacation, Request])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
