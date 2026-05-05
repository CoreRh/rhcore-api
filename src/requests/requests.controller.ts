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
  @ApiOperation({ summary: 'Criar solicitação' })
  @ApiResponse({ status: 201, type: RequestResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
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
  @ApiOperation({ summary: 'Listar solicitações' })
  @ApiResponse({ status: 200, type: RequestListResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
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
  @ApiOperation({ summary: 'Buscar solicitações por ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: RequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
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
  @ApiOperation({ summary: 'Atualizar solicitação' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: RequestResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 403, type: ForbiddenResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
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
  @ApiOperation({ summary: 'Aprovar solicitação' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: RequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 403, type: ForbiddenResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
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
  @ApiOperation({ summary: 'Remover solicitação' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({ status: 200, type: SuccessMessageResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({ status: 403, type: ForbiddenResponseDto })
  @ApiResponse({ status: 404, type: NotFoundResponseDto })
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
