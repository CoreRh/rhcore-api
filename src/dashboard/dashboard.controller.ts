import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { ActivityListResponseDto } from './dto/activity-response.dto';
import { UnauthorizedResponseDto } from 'src/common/dto/error-response.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { UserPermission } from 'src/common/enums/user-permission.enum';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(UserPermission.VIEW_REPORTS)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('activity')
  @ApiOperation({
    summary: 'Listar atividades recentes',
    description:
      'Endpoint responsável por retornar as atividades recentes do sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Atividades listadas com sucesso.',
    type: ActivityListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para acessar este recurso.',
  })
  async getActivity(): Promise<ActivityListResponseDto> {
    const data = await this.dashboardService.getActivity();
    return {
      succeeded: true,
      data,
      message: 'Atividades listadas com sucesso.',
    };
  }
}
