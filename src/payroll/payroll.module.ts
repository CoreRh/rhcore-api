import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { PayrollSlipService } from './payroll-slip.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payroll, Employee])],
  controllers: [PayrollController],
  providers: [PayrollService, PayrollSlipService],
  exports: [PayrollService, PayrollSlipService],
})
export class PayrollModule {}
