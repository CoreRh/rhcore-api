import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
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
import { BenefitsService } from './benefits.service';
import {
  BenefitListResponseDto,
  BenefitResponseDto,
} from './dto/benefit-response.dto';
import {
  BadRequestResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { SuccessMessageResponseDto } from 'src/common/dto/base-response.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { UserPermission } from 'src/common/enums/user-permission.enum';

@ApiTags('Benefícios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_BENEFITS)
  @ApiOperation({
    summary: 'Criar benefício.',
    description:
      'Endpoint responsável por criar um novo benefício para um funcionário.',
  })
  @ApiResponse({
    status: 201,
    description: 'Benefício criado com sucesso.',
    type: BenefitResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou ausentes.',
    type: BadRequestResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para criar benefícios.',
    type: ForbiddenResponseDto,
  })
  async create(
    @Body() dto: CreateBenefitDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<BenefitResponseDto> {
    const benefit = await this.benefitsService.create(dto, req.user.username);
    return {
      succeeded: true,
      data: benefit,
      message: 'Benefício criado com sucesso.',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar benefícios.',
    description:
      'Endpoint responsável por retornar todos os benefícios cadastrados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Benefícios listados com sucesso.',
    type: BenefitListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  async findAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<BenefitListResponseDto> {
    const benefits = await this.benefitsService.findAll(req.user);
    return {
      succeeded: true,
      data: benefits,
      message: 'Benefícios listados com sucesso.',
    };
  }

  @Get('employee/:funcionarioId')
  @ApiOperation({
    summary: 'Listar benefícios por funcionário.',
    description:
      'Endpoint responsável por retornar todos os benefícios de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário',
    type: 'string',
    required: true,
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Benefícios do funcionário listados com sucesso.',
    type: BenefitListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  async findByEmployee(
    @Param('funcionarioId', ParseUUIDPipe) funcionarioId: string,
  ): Promise<BenefitListResponseDto> {
    const benefits = await this.benefitsService.findByEmployee(funcionarioId);
    return {
      succeeded: true,
      data: benefits,
      message: 'Benefícios de funcionário listados com sucesso.',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar benefício por ID.',
    description:
      'Endpoint responsável por retornar os dados de um benefício pelo seu ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do benefício',
    type: 'string',
    required: true,
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Benefício encontrado com sucesso.',
    type: BenefitResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Benefício não encontrado.',
    type: NotFoundResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BenefitResponseDto> {
    const benefit = await this.benefitsService.findOne(id);
    return {
      succeeded: true,
      data: benefit,
      message: 'Benefício encontrado com sucesso.',
    };
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_BENEFITS)
  @ApiOperation({
    summary: 'Atualizar benefício',
    description: 'Enpoint responsável por atualizar os dados de um benefício.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do benefício',
    type: 'string',
    required: true,
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Benefício atualizado com sucesso.',
    type: BenefitResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou ausentes.',
    type: BadRequestResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para atualizar benefícios.',
    type: ForbiddenResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Benefício não encontrado.',
    type: NotFoundResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBenefitDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<BenefitResponseDto> {
    const benefit = await this.benefitsService.update(
      id,
      dto,
      req.user.username,
    );
    return {
      succeeded: true,
      data: benefit,
      message: 'Benefício atualizado com sucesso.',
    };
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.MANAGE_BENEFITS)
  @ApiOperation({
    summary: 'Remover benefício.',
    description: 'Endpoint responsável por remover um benefício.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do benefício',
    type: 'string',
    required: true,
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Benefício removido com sucesso.',
    type: SuccessMessageResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para remover benefícios.',
    type: ForbiddenResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Benefício não encontrado.',
    type: NotFoundResponseDto,
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<SuccessMessageResponseDto> {
    await this.benefitsService.remove(id, req.user.username);
    return {
      succeeded: true,
      message: 'Benefício removido com sucesso.',
    };
  }
}
