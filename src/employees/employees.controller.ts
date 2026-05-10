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
  ForbiddenException,
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
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { SuccessMessageResponseDto } from 'src/common/dto/base-response.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
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
  @ApiOperation({ summary: 'Criar funcionário' })
  @ApiResponse({ status: 201, type: EmployeeResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 409, type: ConflictResponseDto })
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
  @ApiOperation({ summary: 'Listar funcionários' })
  @ApiResponse({ status: 200, type: EmployeeListResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  async findAll(): Promise<EmployeeListResponseDto> {
    const employees = await this.employeesService.findAll();
    return {
      succeeded: true,
      data: employees,
      message: 'Funcionários listados com sucesso.',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar funcionário por ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: EmployeeResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
  async findOne(@Param('id') id: string): Promise<EmployeeResponseDto> {
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
  @ApiOperation({ summary: 'Atualizar funcionário' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: EmployeeResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
  async update(
    @Param('id') id: string,
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
  @ApiOperation({ summary: 'Remover funcionário' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: SuccessMessageResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
  async remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<SuccessMessageResponseDto> {
    await this.employeesService.remove(id, req.user.username);
    return {
      succeeded: true,
      message: 'Funcionário removido com sucesso.',
    };
  }
}
