import { Injectable, OnModuleInit } from '@nestjs/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake/js/Printer';
import pdfVirtualfs from 'pdfmake/js/virtual-fs';
import PdfURLResolver from 'pdfmake/js/URLResolver';
import pdfVfsFonts from 'pdfmake/build/vfs_fonts';
import { PayrollService } from './payroll.service';

@Injectable()
export class PayrollSlipService implements OnModuleInit {
  constructor(private readonly payrollService: PayrollService) {}

  private pdfUrlResolver: PdfURLResolver;

  onModuleInit() {
    pdfVirtualfs.writeFileSync(
      'Roboto-Regular.ttf',
      Buffer.from(pdfVfsFonts['Roboto-Regular.ttf'], 'base64'),
    );
    pdfVirtualfs.writeFileSync(
      'Roboto-Medium.ttf',
      Buffer.from(pdfVfsFonts['Roboto-Medium.ttf'], 'base64'),
    );
    pdfVirtualfs.writeFileSync(
      'Roboto-Italic.ttf',
      Buffer.from(pdfVfsFonts['Roboto-Italic.ttf'], 'base64'),
    );
    pdfVirtualfs.writeFileSync(
      'Roboto-MediumItalic.ttf',
      Buffer.from(pdfVfsFonts['Roboto-MediumItalic.ttf'], 'base64'),
    );
    this.pdfUrlResolver = new PdfURLResolver(pdfVirtualfs);
  }

  async generateSlip(id: string): Promise<Buffer> {
    const payroll = await this.payrollService.findOne(id);

    const printer = new PdfPrinter(
      {
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf',
        },
      },
      pdfVirtualfs,
      this.pdfUrlResolver,
    );

    const mes = String(payroll.MES_REFERENCIA).padStart(2, '0');
    const ano = payroll.ANO_REFERENCIA;

    const fmt = (val: number | string) =>
      Number(val).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const totalVencimentos =
      Number(payroll.SALARIO_BASE) + Number(payroll.BONUS);
    const totalDescontos =
      Number(payroll.DESCONTO_INSS) +
      Number(payroll.DESCONTO_IRRF) +
      Number(payroll.OUTROS_DESCONTOS) +
      Number(payroll.DESCONTO_VT);

    const buildVia = (label: string) => [
      {
        columns: [
          { text: label, style: 'viaLabel', width: '*' },
          {
            text: `Holerite  ${mes}/${ano}`,
            style: 'header',
            alignment: 'right',
            width: 'auto',
          },
        ],
        margin: [0, 0, 0, 6],
      },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: 'Funcionário', style: 'label' },
              { text: 'Matrícula', style: 'label' },
            ],
            [
              { text: payroll.FUNCIONARIO.NOME, style: 'value' },
              { text: payroll.FUNCIONARIO.MATRICULA, style: 'value' },
            ],
            [
              { text: 'Nº de Dependentes', style: 'label' },
              { text: 'Status', style: 'label' },
            ],
            [
              { text: String(payroll.NUMERO_DEPENDENTES), style: 'value' },
              { text: payroll.STATUS_FOLHA, style: 'value' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 8],
      },
      {
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: 'Descrição', style: 'tableHeader' },
              { text: 'Vencimentos', style: 'tableHeader', alignment: 'right' },
              { text: 'Descontos', style: 'tableHeader', alignment: 'right' },
            ],
            [
              { text: 'Salário Base', style: 'tableRow' },
              {
                text: fmt(payroll.SALARIO_BASE),
                style: 'tableRow',
                alignment: 'right',
              },
              { text: '-', style: 'tableRow', alignment: 'right' },
            ],
            [
              { text: 'Bônus', style: 'tableRow' },
              {
                text: fmt(payroll.BONUS),
                style: 'tableRow',
                alignment: 'right',
              },
              { text: '-', style: 'tableRow', alignment: 'right' },
            ],
            [
              { text: 'Desconto INSS', style: 'tableRow' },
              { text: '-', style: 'tableRow', alignment: 'right' },
              {
                text: fmt(payroll.DESCONTO_INSS),
                style: 'tableRow',
                alignment: 'right',
              },
            ],
            [
              { text: 'Desconto IRRF', style: 'tableRow' },
              { text: '-', style: 'tableRow', alignment: 'right' },
              {
                text: fmt(payroll.DESCONTO_IRRF),
                style: 'tableRow',
                alignment: 'right',
              },
            ],
            [
              { text: 'Outros Descontos', style: 'tableRow' },
              { text: '-', style: 'tableRow', alignment: 'right' },
              {
                text: fmt(payroll.OUTROS_DESCONTOS),
                style: 'tableRow',
                alignment: 'right',
              },
            ],
            [
              {
                text: `Vale Transporte (R$ ${fmt(payroll.VALOR_PASSAGEM)})`,
                style: 'tableRow',
              },
              { text: '-', style: 'tableRow', alignment: 'right' },
              {
                text: fmt(payroll.DESCONTO_VT),
                style: 'tableRow',
                alignment: 'right',
              },
            ],
            [
              { text: 'Total', bold: true },
              { text: fmt(totalVencimentos), bold: true, alignment: 'right' },
              { text: fmt(totalDescontos), bold: true, alignment: 'right' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 6],
      },
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              { text: 'SALÁRIO LÍQUIDO', bold: true, fontSize: 11 },
              {
                text: `R$ ${fmt(payroll.SALARIO_LIQUIDO)}`,
                bold: true,
                fontSize: 11,
                alignment: 'right',
              },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 6],
      },
      ...(payroll.OBSERVACAO
        ? [
            {
              text: `Observação: ${payroll.OBSERVACAO}`,
              style: 'obs',
              margin: [0, 0, 0, 6] as [number, number, number, number],
            },
          ]
        : []),
      {
        columns: [
          {
            stack: [
              { text: '', margin: [0, 20, 0, 0] },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0,
                    y1: 0,
                    x2: 190,
                    y2: 0,
                    lineWidth: 0.5,
                  },
                ],
              },
              { text: 'Assinatura do Funcionário', style: 'signLabel' },
            ],
            width: '*',
          },
          {
            stack: [
              { text: '', margin: [0, 20, 0, 0] },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0,
                    y1: 0,
                    x2: 190,
                    y2: 0,
                    lineWidth: 0.5,
                  },
                ],
              },
              { text: 'Assinatura RH / Empresa', style: 'signLabel' },
            ],
            width: '*',
          },
        ],
        margin: [0, 0, 0, 0],
      },
    ];

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [36, 36, 36, 36],
      defaultStyle: { font: 'Roboto', fontSize: 9 },
      content: [
        ...buildVia('1ª VIA — EMPRESA'),
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 523,
              y2: 0,
              lineWidth: 0.5,
              dash: { length: 4, space: 4 },
            },
          ],
          margin: [0, 14, 0, 14],
        },
        ...buildVia('2ª VIA — FUNCIONÁRIO'),
      ] as TDocumentDefinitions['content'],
      styles: {
        header: { fontSize: 13, bold: true },
        viaLabel: { fontSize: 8, bold: true, color: '#555555' },
        label: { fontSize: 8, color: '#888888' },
        value: { fontSize: 10, bold: true },
        tableHeader: {
          bold: true,
          fillColor: '#f0f0f0',
          margin: [4, 3, 4, 3],
          fontSize: 8,
        },
        tableRow: { margin: [4, 2, 4, 2], fontSize: 9 },
        signLabel: {
          fontSize: 8,
          color: '#888888',
          alignment: 'center',
          margin: [0, 3, 0, 0],
        },
        obs: { fontSize: 8, italics: true, color: '#555555' },
      },
    };

    const doc = await printer.createPdfKitDocument(docDefinition);

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      doc.end();
    });
  }
}
