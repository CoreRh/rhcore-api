import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BeneficioTipoEnum } from '../enums/beneficio-tipo.enum';
import { CoberturaPlanoEnum, PlanoTipoEnum } from '../dto/benefit-metadata.dto';

interface DtoWithTipo {
  TIPO?: BeneficioTipoEnum;
}

@ValidatorConstraint({ name: 'IsValidMetadados', async: false })
export class IsValidMetadadosConstraint implements ValidatorConstraintInterface {
  private messages = new WeakMap<object, string>();

  validate(metadados: unknown, args: ValidationArguments): boolean {
    const tipo = (args.object as DtoWithTipo).TIPO;

    if (!tipo) return true;

    let error: string | null = null;
    if (tipo === BeneficioTipoEnum.VALE_TRANSPORTE)
      error = this.valeTransporte(metadados);
    else if (tipo === BeneficioTipoEnum.VALE_REFEICAO)
      error = this.valeRefeicao(metadados);
    else if (tipo === BeneficioTipoEnum.PLANO_SAUDE)
      error = this.planoSaude(metadados);
    else if (tipo === BeneficioTipoEnum.OUTROS && metadados !== null)
      error = 'Metadados deve ser nulo para o tipo OUTROS';

    if (error) {
      this.messages.set(args.object, error);
      return false;
    }
    return true;
  }

  private isObject(m: unknown): m is Record<string, unknown> {
    return typeof m === 'object' && m !== null;
  }

  private valeTransporte(m: unknown): string | null {
    if (!this.isObject(m))
      return 'Metadados são obrigatórios para VALE_TRANSPORTE';
    if (typeof m.VALOR_PASSAGEM !== 'number' || m.VALOR_PASSAGEM <= 0)
      return 'Valor da passagem é obrigatório';
    const qtd = m.QUANTIDADE_DIARIA;
    if (typeof qtd !== 'number' || !Number.isInteger(qtd) || qtd < 1)
      return 'Quantidade diária é obrigatória';
    const diasVT = m.DIAS_UTEIS;
    if (
      typeof diasVT !== 'number' ||
      !Number.isInteger(diasVT) ||
      diasVT < 1 ||
      diasVT > 31
    )
      return 'Dias úteis deve ser entre 1 e 31';
    return null;
  }

  private valeRefeicao(m: unknown): string | null {
    if (!this.isObject(m))
      return 'Metadados são obrigatórios para VALE_REFEICAO';
    if (typeof m.VALOR_DIARIO !== 'number' || m.VALOR_DIARIO <= 0)
      return 'Valor diário é obrigatório';
    const diasVR = m.DIAS_UTEIS;
    if (
      typeof diasVR !== 'number' ||
      !Number.isInteger(diasVR) ||
      diasVR < 1 ||
      diasVR > 31
    )
      return 'Dias úteis deve ser entre 1 e 31';
    return null;
  }

  private planoSaude(m: unknown): string | null {
    if (!this.isObject(m)) return 'Metadados são obrigatórios para PLANO_SAUDE';
    if (typeof m.OPERADORA !== 'string' || !m.OPERADORA.trim())
      return 'Operadora é obrigatória';
    if (!Object.values(PlanoTipoEnum).includes(m.TIPO_PLANO as PlanoTipoEnum))
      return 'Tipo de plano inválido';
    if (
      !Object.values(CoberturaPlanoEnum).includes(
        m.COBERTURA as CoberturaPlanoEnum,
      )
    )
      return 'Cobertura inválida';
    const percentual = m.PERCENTUAL_FUNCIONARIO;
    if (typeof percentual !== 'number' || percentual < 0 || percentual > 100)
      return 'Percentual deve ser entre 0 e 100';
    return null;
  }

  defaultMessage(args: ValidationArguments): string {
    return this.messages.get(args.object) ?? 'Metadados inválidos';
  }
}

export function IsValidMetadados(options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsValidMetadadosConstraint,
    });
  };
}
