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
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  RequestListResponseDto,
  RequestResponseDto,
} from './dto/request-response.dto';
import {
  BadRequestResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { SuccessMessageResponseDto } from 'src/common/dto/base-response.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { UserPermission } from 'src/common/enums/user-permission.enum';

@ApiTags('Solicitações')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar solicitação',
    description: 'Endpoint responsável por criar uma nova solicitação.',
  })
  @ApiResponse({
    status: 201,
    description: 'Solicitação criada com sucesso.',
    type: RequestResponseDto,
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
  async create(
    @Body() dto: CreateRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<RequestResponseDto> {
    const request = await this.requestsService.create(dto, req.user.username);
    return {
      succeeded: true,
      data: request,
      message: 'Solicitação criada com sucesso.',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar solicitações',
    description: 'Endpoint responsável por listar todas as solicitações',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitações listadas com sucesso.',
    type: RequestListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada',
    type: UnauthorizedResponseDto,
  })
  async findAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<RequestListResponseDto> {
    const requests = await this.requestsService.findAll(req.user);
    return {
      succeeded: true,
      data: requests,
      message: 'Solicitações listadas com sucesso.',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar solicitações por ID',
    description:
      'Endpoint responsável por retornar os dados de uma solicitação específica',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID da solicitação',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitação encontrada com sucesso.',
    type: RequestResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Solicitação não encontrada',
    type: NotFoundResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RequestResponseDto> {
    const request = await this.requestsService.findOne(id);
    return {
      succeeded: true,
      data: request,
      message: 'Solicitação encontrada com sucesso.',
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar solicitação',
    description:
      'Enpoint responsável por atualizar os dados de uma solicitação.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID da solicitação',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitação atualizada com sucesso.',
    type: RequestResponseDto,
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
    description: 'Solicitação não encontrada',
    type: NotFoundResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<RequestResponseDto> {
    const request = await this.requestsService.update(id, dto, req.user);
    return {
      succeeded: true,
      data: request,
      message: 'Solicitação atualizada com sucesso.',
    };
  }

  @Patch(':id/approve')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(UserPermission.APPROVE_REQUESTS)
  @ApiOperation({
    summary: 'Aprovar solicitação',
    description: 'Endpoint responsável por aprovar uma solicitação pendente.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID da solicitação',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitação aprovada com sucesso.',
    type: RequestResponseDto,
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
    description: 'Solicitação não encontrada',
    type: NotFoundResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito ao aprovar a solicitação, já aprovada ou recusada)',
    type: ConflictResponseDto,
  })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<RequestResponseDto> {
    const request = await this.requestsService.approve(
      id,
      req.user.sub,
      req.user.username,
    );
    return {
      succeeded: true,
      data: request,
      message: 'Solicitação aprovada com sucesso.',
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover solicitação',
    description: 'Endpoint responsável por remover uma solicitação específica.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID da solicitação',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitação removida com sucesso.',
    type: SuccessMessageResponseDto,
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
    description: 'Solicitação não encontrada',
    type: NotFoundResponseDto,
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<SuccessMessageResponseDto> {
    await this.requestsService.remove(id, req.user);
    return {
      succeeded: true,
      message: 'Solicitação removida com sucesso.',
    };
  }
}
