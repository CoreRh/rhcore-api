import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Realizar login',
    description: 'Autentica o usuário e retorna tokens JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'login efetuado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.username, body.password);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Renovar tokens' })
  @ApiResponse({
    status: 201,
    description: 'Tokens renovados com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido',
  })
  async refresh(@Req() req: AuthenticatedRequest) {
    return this.authService.refresh(req.user.sub, req.user.refreshToken!);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Realizar logout',
    description: 'Invalida o refresh token e encerra a sessão',
  })
  @ApiResponse({
    status: 201,
    description: 'Logout realizado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  async logout(@Req() req: AuthenticatedRequest) {
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  async me(@Req() req: AuthenticatedRequest) {
    return this.authService.me(req.user.sub);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar recuperação de senha',
    description: 'Envia um e-mail com instruções para resetar a senha',
  })
  @ApiResponse({
    status: 201,
    description: 'E-mail de recuperação enviado (se o usuário existir)',
  })
  @ApiResponse({
    status: 400,
    description: 'E-mail inválido',
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.EMAIL);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Resetar senha',
    description: 'Reseta a senha usando um token de recuperação',
  })
  @ApiResponse({
    status: 201,
    description: 'Senha resetada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Token de reset de senha inválido ou expirado',
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
