import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseDto {
  @ApiProperty({ example: false })
  succeeded: boolean;

  @ApiProperty({ example: null, nullable: true })
  data: unknown;

  @ApiProperty({ example: 'Dados inválidos' })
  message: string;

  @ApiProperty({
    example: {
      message: 'Dados inválidos',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  error: object;
}

export class UnauthorizedResponseDto {
  @ApiProperty({ example: false })
  succeeded: boolean;

  @ApiProperty({ example: null, nullable: true })
  data: unknown;

  @ApiProperty({
    example: 'Token de sessão não encontrado ou sessão inválida/expirada.',
  })
  message: string;

  @ApiProperty({
    example: {
      message: 'Não autorizado',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  error: object;
}

export class NotFoundResponseDto {
  @ApiProperty({ example: false })
  succeeded: boolean;

  @ApiProperty({ example: null, nullable: true })
  data: unknown;

  @ApiProperty({ example: 'Recurso não encontrado.' })
  message: string;

  @ApiProperty({
    example: {
      message: 'Recurso não encontrado.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  error: object;
}

export class ForbiddenResponseDto {
  @ApiProperty({ example: false })
  succeeded: boolean;

  @ApiProperty({ example: null, nullable: true })
  data: unknown;

  @ApiProperty({ example: 'Sem permissão para modificar este recurso.' })
  message: string;

  @ApiProperty({
    example: {
      message: 'Sem permissão para modificar este recurso.',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  error: object;
}

export class ConflictResponseDto {
  @ApiProperty({ example: false })
  succeeded: boolean;

  @ApiProperty({ example: null, nullable: true })
  data: unknown;

  @ApiProperty({ example: 'Conflito ao realizar a operação.' })
  message: string;

  @ApiProperty({
    example: {
      message: 'Conflito ao realizar a operação.',
      error: 'Conflict',
      statusCode: 409,
    },
  })
  error: object;
}
