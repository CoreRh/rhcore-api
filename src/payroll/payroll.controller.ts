import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PayrollService } from './payroll.service';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { UserPermission } from 'src/common/enums/user-permission.enum';
import {
  PayrollListResponseDto,
  PayrollResponseDto,
} from './dto/payroll-response.dto';
import {
  BadRequestResponseDto,
  ConflictResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { SuccessMessageResponseDto } from 'src/common/dto/base-response.dto';
import type { Response } from 'express';
import { PayrollSlipService } from './payroll-slip.service';

@ApiTags('Folha de pagamento')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('payroll')
export class PayrollController {
  constructor(
    private readonly payrollService: PayrollService,
    private readonly payrollSlipService: PayrollSlipService,
  ) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_PAYROLL)
  @ApiOperation({
    summary: 'Criar folha de pagamento.',
    description:
      'Endpoint responsável por criar uma nova folha de pagamento para um funcionário',
  })
  @ApiResponse({
    status: 201,
    description: 'Folha de pagamento criada com sucesso.',
    type: PayrollResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou ausentes.',
    type: BadRequestResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe folha de pagamento para este funcionário.',
    type: ConflictResponseDto,
  })
  async create(
    @Body() dto: CreatePayrollDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PayrollResponseDto> {
    const payroll = await this.payrollService.create(dto, req.user.username);
    return {
      succeeded: true,
      data: payroll,
      message: 'Folha de pagamento criada com sucesso.',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar folhas de pagamento.',
    description:
      'Endpoint responsável por retornar todas as folhas de pagamento.',
  })
  @ApiResponse({
    status: 200,
    description: 'Folhas de pagamento listadas com sucesso.',
    type: PayrollListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada',
    type: UnauthorizedResponseDto,
  })
  async findAll(): Promise<PayrollListResponseDto> {
    const payrolls = await this.payrollService.findAll();
    return {
      succeeded: true,
      data: payrolls,
      message: 'Folhas de pagamento listadas com sucesso.',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar folha de pagamento por ID.',
    description:
      'Endpoint responsável por retornar os dados de uma folha de pagamento',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da folha de pagamento',
    type: 'string',
    required: true,
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Folha de pagamento encontrada com sucesso.',
    type: PayrollResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Folha de pagamento não encontrada.',
    type: NotFoundResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<PayrollResponseDto> {
    const payroll = await this.payrollService.findOne(id);
    return {
      succeeded: true,
      data: payroll,
      message: 'Folha de pagamento encontrada com sucesso.',
    };
  }

  @Get(':id/slip')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_PAYROLL)
  @ApiOperation({
    summary: 'Gerar holerite em PDF.',
    description:
      'Endpoint responsável por gerar o holerite em PDF de uma folha de pagamento.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da folha de pagamento',
    type: 'string',
    required: true,
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, description: 'PDF gerado com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Folha de pagamento não encontrada.',
    type: NotFoundResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  async generateSlip(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const pdf = await this.payrollSlipService.generateSlip(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="holerite-${id}.pdf"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_PAYROLL)
  @ApiOperation({
    summary: 'Atualizar folha de pagamento.',
    description:
      'Endpoint responsável por atualizar dados de uma folha de pagamento.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da folha de pagamento',
    type: 'string',
    required: true,
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Folha de pagamento atualizada com sucesso.',
    type: PayrollResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou ausentes.',
    type: BadRequestResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Folha de pagamento não encontrada',
    type: NotFoundResponseDto,
  })
  @ApiResponse({
    status: 409,
    description:
      'Já existe uma folha de pagamento para este funcionário no período informado.',
    type: ConflictResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePayrollDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PayrollResponseDto> {
    const payroll = await this.payrollService.update(
      id,
      dto,
      req.user.username,
    );
    return {
      succeeded: true,
      data: payroll,
      message: 'Folha de pagamento atualizada com sucesso.',
    };
  }

  @Patch(':id/pay')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_PAYROLL)
  @ApiOperation({
    summary: 'Marcar folha de pagamento como paga',
    description:
      'Endpoint responsável por marcar uma folha de pagamento como o STATUS PAGA.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da folha de pagamento',
    type: 'string',
    required: true,
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Folha de pagamento marcada como paga com sucesso.',
    type: PayrollResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Folha de pagamento não encontrada.',
    type: NotFoundResponseDto,
  })
  async pay(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<PayrollResponseDto> {
    const payroll = await this.payrollService.pay(id, req.user.username);
    return {
      succeeded: true,
      data: payroll,
      message: 'Folha de pagamento marcada como paga com sucesso.',
    };
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_PAYROLL)
  @ApiOperation({
    summary: 'Remover folha de pagamento.',
    description: 'Endpoint responsável por remover uma folha de pagamento.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da folha de pagamento',
    type: 'string',
    required: true,
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Folha de pagamento removida com sucesso.',
    type: SuccessMessageResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Folha de pagamento não encontrada',
    type: NotFoundResponseDto,
  })
  async remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<SuccessMessageResponseDto> {
    await this.payrollService.remove(id, req.user.username);
    return {
      succeeded: true,
      message: 'Folha de pagamento removida com sucesso.',
    };
  }
}
