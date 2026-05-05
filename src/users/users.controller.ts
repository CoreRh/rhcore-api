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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto, UserListResponseDto } from './dto/user-response.dto';
import {
  BadRequestResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import { SuccessMessageResponseDto } from 'src/common/dto/base-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Usuários')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Criar usuário',
    description: 'Endpoint responsável por criar um novo usuário',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    type: UserResponseDto,
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
    description: 'Já existe um usuário com esse e-mail.',
    type: ConflictResponseDto,
  })
  async create(
    @Body() dto: CreateUserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.create(dto, req.user.username);
    return {
      succeeded: true,
      data: user,
      message: 'Usuário criado com sucesso.',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Endpoint responsável por listar todos os usuários',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuários listados com sucesso.',
    type: UserListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  async findAll(): Promise<UserListResponseDto> {
    const users = await this.usersService.findAll();
    return {
      succeeded: true,
      data: users,
      message: 'Usuários listados com sucesso.',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description:
      'Endpoint responsável por retornar os dados de um usuário específico',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do usuário',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de sessão não encontrado ou sessão inválida/expirada.',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
    type: NotFoundResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return {
      succeeded: true,
      data: user,
      message: 'Usuário encontrado com sucesso.',
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Endpoint responsável por atualizar os dados de um usuário',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do usuário',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.',
    type: UserResponseDto,
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
    description: 'Sem permissão para realizar esta ação.',
    type: ForbiddenResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
    type: NotFoundResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, dto, req.user.username);
    return {
      succeeded: true,
      data: user,
      message: 'Usuário atualizado com sucesso.',
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Remover usuário',
    description: 'Endpoint responsável por remover um usuário',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do usuário',
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso.',
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
    description: 'Usuário não encontrado.',
    type: NotFoundResponseDto,
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<SuccessMessageResponseDto> {
    await this.usersService.remove(id, req.user.username);
    return { succeeded: true, message: 'Usuário removido com sucesso.' };
  }
}
