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
  private errorMessage = 'Metadados inválidos';

  validate(metadados: unknown, args: ValidationArguments): boolean {
    const tipo = (args.object as DtoWithTipo).TIPO;

    if (!tipo) return true;

    if (tipo === BeneficioTipoEnum.VALE_TRANSPORTE)
      return this.valeTransporte(metadados);
    if (tipo === BeneficioTipoEnum.VALE_REFEICAO)
      return this.valeRefeicao(metadados);
    if (tipo === BeneficioTipoEnum.PLANO_SAUDE)
      return this.planoSaude(metadados);
    if (tipo === BeneficioTipoEnum.OUTROS) {
      if (metadados !== null) {
        this.errorMessage = 'Metadados deve ser nulo para o tipo OUTROS';
        return false;
      }
      return true;
    }
    return true;
  }

  private isObject(m: unknown): m is Record<string, unknown> {
    return typeof m === 'object' && m !== null;
  }

  private valeTransporte(m: unknown): boolean {
    if (!this.isObject(m)) {
      this.errorMessage = 'Metadados são obrigatórios para VALE_TRANSPORTE';
      return false;
    }
    if (typeof m.VALOR_PASSAGEM !== 'number' || m.VALOR_PASSAGEM <= 0) {
      this.errorMessage = 'Valor da passagem é obrigatório';
      return false;
    }
    const qtd = m.QUANTIDADE_DIARIA;
    if (typeof qtd !== 'number' || !Number.isInteger(qtd) || qtd < 1) {
      this.errorMessage = 'Quantidade diária é obrigatória';
      return false;
    }
    const diasVT = m.DIAS_UTEIS;
    if (
      typeof diasVT !== 'number' ||
      !Number.isInteger(diasVT) ||
      diasVT < 1 ||
      diasVT > 31
    ) {
      this.errorMessage = 'Dias úteis deve ser entre 1 e 31';
      return false;
    }
    return true;
  }

  private valeRefeicao(m: unknown): boolean {
    if (!this.isObject(m)) {
      this.errorMessage = 'Metadados são obrigatórios para VALE_REFEICAO';
      return false;
    }
    if (typeof m.VALOR_DIARIO !== 'number' || m.VALOR_DIARIO <= 0) {
      this.errorMessage = 'Valor diário é obrigatório';
      return false;
    }
    const diasVR = m.DIAS_UTEIS;
    if (
      typeof diasVR !== 'number' ||
      !Number.isInteger(diasVR) ||
      diasVR < 1 ||
      diasVR > 31
    ) {
      this.errorMessage = 'Dias úteis deve ser entre 1 e 31';
      return false;
    }
    return true;
  }

  private planoSaude(m: unknown): boolean {
    if (!this.isObject(m)) {
      this.errorMessage = 'Metadados são obrigatórios para PLANO_SAUDE';
      return false;
    }
    if (typeof m.OPERADORA !== 'string' || !m.OPERADORA.trim()) {
      this.errorMessage = 'Operadora é obrigatória';
      return false;
    }
    if (!Object.values(PlanoTipoEnum).includes(m.TIPO_PLANO as PlanoTipoEnum)) {
      this.errorMessage = 'Tipo de plano inválido';
      return false;
    }
    if (
      !Object.values(CoberturaPlanoEnum).includes(
        m.COBERTURA as CoberturaPlanoEnum,
      )
    ) {
      this.errorMessage = 'Cobertura inválida';
      return false;
    }
    const percentual = m.PERCENTUAL_FUNCIONARIO;
    if (typeof percentual !== 'number' || percentual < 0 || percentual > 100) {
      this.errorMessage = 'Percentual deve ser entre 0 e 100';
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return this.errorMessage;
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
