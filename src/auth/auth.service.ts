import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/common/enums/user-role.enum';
import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserPermission } from 'src/common/enums/user-permission.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.validateCredentials(
      username,
      password,
    );
    const tokens = await this.generateTokens(
      user.ID,
      user.NOME_USUARIO,
      user.ROLE,
      user.PERMISSIONS,
      user.FUNCIONARIO_ID,
    );
    await this.saveRefreshToken(user.ID, tokens.refresh_token);

    return {
      succeeded: true,
      data: { ...tokens, role: user.ROLE, funcionario_id: user.FUNCIONARIO_ID },
      message: 'Login realizado com sucesso.',
    };
  }

  async refresh(userId: string, refresh_token: string) {
    const user = await this.usersService.findForAuth(userId);

    if (!user.REFRESH_TOKEN) throw new UnauthorizedException('Acesso negado');

    const tokenMatch = await bcrypt.compare(refresh_token, user.REFRESH_TOKEN);
    if (!tokenMatch) throw new UnauthorizedException('Refresh token inválido');

    const tokens = await this.generateTokens(
      user.ID,
      user.NOME_USUARIO,
      user.ROLE,
      user.PERMISSIONS,
      user.FUNCIONARIO_ID,
    );
    await this.saveRefreshToken(user.ID, tokens.refresh_token);
    return {
      succeeded: true,
      data: tokens,
      message: 'Token atualizado com sucesso',
    };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return {
      succeeded: true,
      data: null,
      message: 'Logout realizado com sucesso',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return {
        succeeded: true,
        data: null,
        message:
          'Instruções para recuperação de senha enviadas para o e-mail cadastrado',
      };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await this.usersService.saveResetToken(user.ID, token, expires);

    try {
      const resetUrl = `${this.configService.getOrThrow<string>('FRONTEND_URL')}/reset-password?token=${token}`;
      await this.mailerService.sendMail({
        to: user.EMAIL,
        subject: 'Recuperação de senha',
        text: `Você solicitou a recuperação de senha. Clique no link abaixo para resetar sua senha:\n\n${resetUrl}\n\nSe você não solicitou, ignore este e-mail.`,
      });
      this.logger.log(`E-mail de recuperação enviado para ${user.EMAIL}`);
    } catch (error) {
      this.logger.error(
        `Falha ao enviar e-mail de recuperação para ${user.EMAIL}: ${JSON.stringify(error)}`,
      );
    }

    return {
      succeeded: true,
      data: null,
      message:
        'Instruções para recuperação de senha enviadas para o e-mail cadastrado',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);

    if (
      !user ||
      !user.RESET_PASSWORD_EXPIRES ||
      user.RESET_PASSWORD_EXPIRES < new Date()
    ) {
      throw new BadRequestException(
        'Token de reset de senha inválido ou expirado',
      );
    }

    await this.usersService.update(user.ID, { SENHA: newPassword }, 'sistema');
    await this.usersService.clearResetToken(user.ID);

    return {
      succeeded: true,
      data: null,
      message: 'Senha resetada com sucesso',
    };
  }

  async me(userId: string) {
    const user = await this.usersService.findForAuth(userId);
    return { succeeded: true, data: user, message: 'Usuário autenticado' };
  }

  private async generateTokens(
    userId: string,
    username: string,
    role: UserRole,
    permissions: UserPermission[],
    funcionario_id: string | null,
  ) {
    const payload = {
      username,
      sub: userId,
      role,
      permissions,
      funcionario_id,
    };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1d' }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      }),
    ]);
    return { access_token, refresh_token };
  }

  private async saveRefreshToken(userId: string, refresh_token: string) {
    const hashed = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateRefreshToken(userId, hashed);
  }
}
