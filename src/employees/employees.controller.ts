import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  EmployeeListResponseDto,
  EmployeeResponseDto,
} from './dto/employee-response.dto';
import {
  BadRequestResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { SuccessMessageResponseDto } from 'src/common/dto/base-response.dto';
import { UserPermission } from 'src/common/enums/user-permission.enum';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';

@ApiTags('Funcionários')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar funcionário',
    description: 'Endpoint responsável por criar um novo funcionário',
  })
  @ApiResponse({
    status: 201,
    description: 'Funcionário criado com sucesso.',
    type: EmployeeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos.',
    type: BadRequestResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um funcionário com essa matrícula, CPF ou e-mail.',
    type: ConflictResponseDto,
  })
  async create(
    @Body() dto: CreateEmployeeDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.employeesService.create(dto, req.user.username);
    return {
      succeeded: true,
      data: employee,
      message: 'Funcionário criado com sucesso.',
    };
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.VIEW_ALL_EMPLOYEES)
  @ApiOperation({
    summary: 'Listar funcionários',
    description: 'Endpoint responsável por listar todos os funcionários',
  })
  @ApiResponse({
    status: 200,
    description: 'Funcionários listados com sucesso',
    type: EmployeeListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para realizar esta ação.',
    type: ForbiddenResponseDto,
  })
  async findAll(): Promise<EmployeeListResponseDto> {
    const employees = await this.employeesService.findAll();
    return {
      succeeded: true,
      data: employees,
      message: 'Funcionários listados com sucesso.',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar funcionário por ID',
    description:
      'Endpoint responsável por retornar os dados de um funcionário específico',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do funcionário',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Funcionário encontrado com sucesso.',
    type: EmployeeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Funcionário não encontrado.',
    type: NotFoundResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.employeesService.findOne(id);
    return {
      succeeded: true,
      data: employee,
      message: 'Funcionário encontrado com sucesso.',
    };
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_EMPLOYEES)
  @ApiOperation({
    summary: 'Atualizar funcionário',
    description:
      'Endpoint responsável por atualizar os dados de um funcionário',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do funcionário',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Funcionário atualizado com sucesso',
    type: EmployeeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para realizar esta ação',
    type: ForbiddenResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Funcionário não encontrado',
    type: NotFoundResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmployeeDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.employeesService.update(
      id,
      dto,
      req.user.username,
    );
    return {
      succeeded: true,
      data: employee,
      message: 'Funcionário atualizado com sucesso.',
    };
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_EMPLOYEES)
  @ApiOperation({
    summary: 'Remover funcionário',
    description: 'Endpoint responsável por remover um funcionário.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do funcionário',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Funcionário removido com sucesso',
    type: SuccessMessageResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para realizar esta ação.',
    type: ForbiddenResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Funcionário não encontrado.',
    type: NotFoundResponseDto,
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<SuccessMessageResponseDto> {
    await this.employeesService.remove(id, req.user.username);
    return {
      succeeded: true,
      message: 'Funcionário removido com sucesso.',
    };
  }
}
