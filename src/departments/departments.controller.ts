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
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  DepartmentListResponseDto,
  DepartmentResponseDto,
} from './dto/department-response.dto';
import {
  BadRequestResponseDto,
  ConflictResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { SuccessMessageResponseDto } from 'src/common/dto/base-response.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { UserPermission } from 'src/common/enums/user-permission.enum';

@ApiTags('Departamentos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_DEPARTMENTS)
  @ApiOperation({ summary: 'Criar departamento' })
  @ApiResponse({ status: 201, type: DepartmentResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 409, type: ConflictResponseDto })
  async create(
    @Body() dto: CreateDepartmentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<DepartmentResponseDto> {
    const department = await this.departmentsService.create(
      dto,
      req.user.username,
    );
    return {
      succeeded: true,
      data: department,
      message: 'Departamento criado com sucesso.',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar departamentos' })
  @ApiResponse({ status: 200, type: DepartmentListResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  async findAll(): Promise<DepartmentListResponseDto> {
    const departments = await this.departmentsService.findAll();
    return {
      succeeded: true,
      data: departments,
      message: 'Departamentos listados com sucesso.',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar departamento por ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: DepartmentResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
  async findOne(@Param('id') id: string): Promise<DepartmentResponseDto> {
    const department = await this.departmentsService.findOne(id);
    return {
      succeeded: true,
      data: department,
      message: 'Departamento encontrado com sucesso.',
    };
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_DEPARTMENTS)
  @ApiOperation({ summary: 'Atualizar departamento' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: DepartmentResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<DepartmentResponseDto> {
    const department = await this.departmentsService.update(
      id,
      dto,
      req.user.username,
    );
    return {
      succeeded: true,
      data: department,
      message: 'Departamento atualizado com sucesso',
    };
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_DEPARTMENTS)
  @ApiOperation({ summary: 'Remover departamento' })
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
    await this.departmentsService.remove(id, req.user.username);
    return {
      succeeded: true,
      message: 'Departamento removido com sucesso.',
    };
  }
}
