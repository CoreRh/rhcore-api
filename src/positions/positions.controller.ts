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
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  PositionListResponseDto,
  PositionResponseDto,
} from './dto/position-response.dto';
import {
  BadRequestResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { SuccessMessageResponseDto } from 'src/common/dto/base-response.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Cargos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({
    summary: 'Criar cargo',
    description: 'Endpoint responsável por criar um novo cargo',
  })
  @ApiResponse({
    status: 201,
    description: 'Cargo criado com sucesso.',
    type: PositionResponseDto,
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
    status: 403,
    description: 'Acesso negado. Requer perfil ADMIN ou MANAGER.',
    type: ForbiddenResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um cargo com esse nome.',
    type: ConflictResponseDto,
  })
  async create(
    @Body() dto: CreatePositionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PositionResponseDto> {
    const position = await this.positionsService.create(dto, req.user.username);
    return {
      succeeded: true,
      data: position,
      message: 'Cargo criado com sucesso.',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar cargos',
    description: 'Endpoint responsável por listar todos os cargos',
  })
  @ApiResponse({
    status: 200,
    description: 'Cargos listados com sucesso.',
    type: PositionListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  async findAll(): Promise<PositionListResponseDto> {
    const positions = await this.positionsService.findAll();
    return {
      succeeded: true,
      data: positions,
      message: 'Cargos listados com sucesso.',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar cargo por ID',
    description:
      'Endpoint responsável por retornar dados de um cargo específico',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do cargo a ser buscado',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Cargo encontrado com sucesso.',
    type: PositionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cargo não encontrado.',
    type: NotFoundResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PositionResponseDto> {
    const position = await this.positionsService.findOne(id);
    return {
      succeeded: true,
      data: position,
      message: 'Cargo encontrado com sucesso.',
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({
    summary: 'Atualizar cargo',
    description: 'Endpoint responsável por atualizar os dados de um cargo',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do cargo a ser atualizado',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Cargo atualizado com sucesso.',
    type: PositionResponseDto,
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
    status: 404,
    description: 'Cargo não encontrado.',
    type: NotFoundResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Requer perfil ADMIN ou MANAGER.',
    type: ForbiddenResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePositionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PositionResponseDto> {
    const position = await this.positionsService.update(
      id,
      dto,
      req.user.username,
    );
    return {
      succeeded: true,
      data: position,
      message: 'Cargo atualizado com sucesso.',
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({
    summary: 'Remover cargo',
    description: 'Endpoint responsável por remover um cargo',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do cargo a ser removido',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Cargo removido com sucesso.',
    type: SuccessMessageResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cargo não encontrado.',
    type: NotFoundResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Requer perfil ADMIN ou MANAGER.',
    type: ForbiddenResponseDto,
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<SuccessMessageResponseDto> {
    await this.positionsService.remove(id, req.user.username);
    return {
      succeeded: true,
      message: 'Cargo removido com sucesso.',
    };
  }
}
