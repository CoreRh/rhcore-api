import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { Vacation } from 'src/vacations/entities/vacation.entity';
import { Request } from 'src/requests/entities/request.entity';
import { ActivityDataDto } from './dto/activity-response.dto';
import { ActivityTypeEnum } from './enums/activity.enum';

const ACTIVITY_LIMIT = 10;

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async getActivity(): Promise<ActivityDataDto[]> {
    const [employees, vacations, requests] = await Promise.all([
      this.employeeRepository.find({
        order: { CRIADO_EM: 'DESC' },
        take: ACTIVITY_LIMIT,
      }),
      this.vacationRepository.find({
        relations: ['FUNCIONARIO'],
        order: { CRIADO_EM: 'DESC' },
        take: ACTIVITY_LIMIT,
      }),
      this.requestRepository.find({
        relations: ['FUNCIONARIO'],
        order: { CRIADO_EM: 'DESC' },
        take: ACTIVITY_LIMIT,
      }),
    ]);

    const activities: ActivityDataDto[] = [
      ...employees.map((e) => ({
        ID: e.ID,
        TIPO: ActivityTypeEnum.FUNCIONARIO,
        TITULO: e.NOME,
        DESCRICAO: 'Funcionário admitido',
        STATUS: e.STATUS,
        CRIADO_EM: e.CRIADO_EM.toISOString(),
      })),
      ...vacations.map((v) => ({
        ID: v.ID,
        TIPO: ActivityTypeEnum.FERIAS,
        TITULO: v.FUNCIONARIO.NOME,
        DESCRICAO: `Férias de ${new Date(v.DATA_INICIO).toLocaleDateString(
          'pt-BR',
        )} a ${new Date(v.DATA_FIM).toLocaleDateString('pt-BR')}`,
        STATUS: v.STATUS_FERIAS,
        CRIADO_EM: v.CRIADO_EM.toISOString(),
      })),
      ...requests.map((r) => ({
        ID: r.ID,
        TIPO: ActivityTypeEnum.SOLICITACAO,
        TITULO: r.FUNCIONARIO.NOME,
        DESCRICAO: `Solicitação de ${r.TIPO.toLowerCase()}`,
        STATUS: r.SITUACAO,
        CRIADO_EM: r.CRIADO_EM.toISOString(),
      })),
    ];

    return activities
      .sort(
        (a, b) =>
          new Date(b.CRIADO_EM).getTime() - new Date(a.CRIADO_EM).getTime(),
      )
      .slice(0, ACTIVITY_LIMIT);
  }
}
