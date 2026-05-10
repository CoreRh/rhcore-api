import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: '2025001' })
  @IsString({ message: 'A matrícula deve ser do tipo texto' })
  @IsNotEmpty({ message: 'A matrícula é obrigatória' })
  @MaxLength(20, { message: 'A matrícula deve ter no máximo 20 caracteres' })
  MATRICULA: string;

  @ApiProperty({ example: 'João da Silva' })
  @IsString({ message: 'O nome deve ser do tipo texto' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  NOME: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsString({ message: 'O CPF deve ser do tipo texto' })
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'O CPF deve estar no formato 000.000.000-00',
  })
  CPF: string;

  @ApiPropertyOptional({ example: '12.345.678-9' })
  @IsString({ message: 'O RG deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(20, { message: 'O RG deve ter no máximo 20 caracteres' })
  RG?: string;

  @ApiProperty({ example: '1990-05-20' })
  @IsDateString(
    {},
    { message: 'A data de nascimento deve ser uma data válida' },
  )
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  DATA_NASCIMENTO: string;

  @ApiProperty({ example: 'joao.silva@empresa.com.br' })
  @IsEmail({}, { message: 'O e-mail deve ser um endereço válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatória' })
  @MaxLength(100, { message: 'O e-mail deve ter no máximo 100 caracteres' })
  EMAIL: string;

  @ApiPropertyOptional({ example: '(31) 99999-9999' })
  @IsString({ message: 'O telefone deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(20, { message: 'O telefone deve ter no máximo 20 caracteres' })
  TELEFONE?: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString({}, { message: 'A da de admissão deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data de admissão é obrigatória' })
  DATA_ADMISSAO: string;

  @ApiPropertyOptional({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do departamento deve ser um UUID válido' })
  @IsOptional()
  DEPARTAMENTO_ID?: string;

  @ApiPropertyOptional({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do cargo deve ser um UUID válido' })
  @IsOptional()
  CARGO_ID?: string;

  @ApiPropertyOptional({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do gestor deve ser um UUID válido' })
  @IsOptional()
  GESTOR_ID?: string;
}
