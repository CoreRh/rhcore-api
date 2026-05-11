import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Position } from 'src/positions/entities/position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Department, Position])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
