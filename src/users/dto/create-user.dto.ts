import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserPermission } from 'src/common/enums/user-permission.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'joao.silva' })
  @IsString({ message: 'O valor informado deve ser do tipo texto' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  @MinLength(3, {
    message: 'O nome de usuário deve ter no mínimo 3 caracteres',
  })
  @MaxLength(50, {
    message: 'O nome de usuário deve ter no máximo 50 caracteres',
  })
  NOME_USUARIO: string;

  @ApiPropertyOptional({
    example: 'joao@email.com',
    description: 'Obrigatório quando FUNCIONARIO_ID não for informado',
  })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @IsOptional()
  EMAIL?: string;

  @ApiProperty({ example: 'admin123' })
  @IsString({ message: 'O valor informado deve ser do tipo texto' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @MaxLength(72, { message: 'A senha deve ter no máximo 72 caracteres' })
  SENHA: string;

  @ApiPropertyOptional({
    example: UserRole.ADMIN,
    enum: UserRole,
  })
  @IsEnum(UserRole, {
    message: 'O valor informado para o campo ROLE é inválido',
  })
  @IsOptional()
  ROLE?: UserRole;

  @ApiPropertyOptional({
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    description:
      'ID do funcionário vinculado. Quando informado, o e-mail é herdado do funcionário.',
  })
  @IsUUID('4', { message: 'O FUNCIONARIO_ID deve ser um UUID válido' })
  @IsOptional()
  FUNCIONARIO_ID?: string;

  @ApiPropertyOptional({
    example: ['APPROVE_VACATIONS', 'VIEW_REPORTS'],
    enum: UserPermission,
    isArray: true,
    description: 'Permissões adicionais para o usuário',
  })
  @IsArray({ message: 'O campo PERMISSIONS deve ser um array' })
  @IsEnum(UserPermission, {
    each: true,
    message: 'Um ou mais valores informados para PERMISSIONS são inválidos',
  })
  @IsOptional()
  PERMISSIONS?: UserPermission[];
}
