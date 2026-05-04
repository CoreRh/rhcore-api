export interface ValeTransporteMetadata {
  VALOR_PASSAGEM: number;
  QUANTIDADE_DIARIA: number;
  DIAS_UTEIS: number;
}

export interface ValeRefeicaoMetadata {
  VALOR_DIARIO: number;
  DIAS_UTEIS: number;
}

export interface PlanoSaudeMetadata {
  OPERADORA: string;
  TIPO_PLANO: 'INDIVIDUAL' | 'FAMILIAR' | 'EMPRESARIAL';
  COBERTURA: 'BASICO' | 'INTERMEDIARIO' | 'PREMIUM';
  PERCENTUAL_FUNCIONARIO: number;
}

export type BenefitMetadata =
  | ValeTransporteMetadata
  | ValeRefeicaoMetadata
  | PlanoSaudeMetadata
  | null;
