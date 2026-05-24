import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('RHCore API')
    .setDescription('Documentação da API de RH')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authenticação')
    .addTag('Usuários', 'Gerenciamento de usuários')
    .addTag('Funcionários', 'Gerenciamento de funcionários')
    .addTag('Departamentos', 'Gerenciamento de departamentos')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const darkModeCss = `
    body { background-color: #0f1117; color: #e2e8f0; }
    .swagger-ui { background-color: #0f1117; }
    .swagger-ui .topbar { background-color: #1a1d2e; border-bottom: 1px solid #2d3148; }
    .swagger-ui .topbar .download-url-wrapper input[type=text] { background-color: #1e2235; color: #e2e8f0; border: 1px solid #2d3148; }
    .swagger-ui .info .title, .swagger-ui .info p, .swagger-ui .info li, .swagger-ui .info a { color: #e2e8f0; }
    .swagger-ui .scheme-container { background-color: #1a1d2e; box-shadow: none; border-bottom: 1px solid #2d3148; }
    .swagger-ui .opblock-tag { color: #e2e8f0; border-bottom: 1px solid #2d3148; }
    .swagger-ui .opblock-tag:hover { background-color: #1e2235; }
    .swagger-ui .opblock { background-color: #1a1d2e; border-color: #2d3148; box-shadow: none; }
    .swagger-ui .opblock .opblock-summary { border-color: #2d3148; }
    .swagger-ui .opblock .opblock-summary-description { color: #a0aec0; }
    .swagger-ui .opblock.opblock-post { background-color: #1a2e1e; border-color: #276749; }
    .swagger-ui .opblock.opblock-post .opblock-summary { background-color: #1a2e1e; border-color: #276749; }
    .swagger-ui .opblock.opblock-get { background-color: #1a2238; border-color: #2b4c8c; }
    .swagger-ui .opblock.opblock-get .opblock-summary { background-color: #1a2238; border-color: #2b4c8c; }
    .swagger-ui .opblock.opblock-patch { background-color: #2e2a1a; border-color: #7c6014; }
    .swagger-ui .opblock.opblock-patch .opblock-summary { background-color: #2e2a1a; border-color: #7c6014; }
    .swagger-ui .opblock.opblock-delete { background-color: #2e1a1a; border-color: #8c2b2b; }
    .swagger-ui .opblock.opblock-delete .opblock-summary { background-color: #2e1a1a; border-color: #8c2b2b; }
    .swagger-ui .opblock .opblock-body { background-color: #141726; }
    .swagger-ui .opblock-description-wrapper p, .swagger-ui .opblock-external-docs-wrapper p,
    .swagger-ui .opblock-title_normal p { color: #a0aec0; }
    .swagger-ui .tab li { color: #a0aec0; }
    .swagger-ui .tab li.active { color: #e2e8f0; }
    .swagger-ui .parameter__name, .swagger-ui .parameter__type, .swagger-ui .parameter__deprecated,
    .swagger-ui .parameter__in { color: #a0aec0; }
    .swagger-ui table thead tr td, .swagger-ui table thead tr th { color: #a0aec0; border-color: #2d3148; }
    .swagger-ui .response-col_status { color: #e2e8f0; }
    .swagger-ui .response-col_description p { color: #a0aec0; }
    .swagger-ui .responses-inner h4, .swagger-ui .responses-inner h5 { color: #e2e8f0; }
    .swagger-ui .model-box { background-color: #1a1d2e; }
    .swagger-ui .model { color: #e2e8f0; }
    .swagger-ui .model .property.primitive { color: #a0aec0; }
    .swagger-ui section.models { border-color: #2d3148; }
    .swagger-ui section.models h4 { color: #e2e8f0; border-color: #2d3148; }
    .swagger-ui section.models .model-container { background-color: #1a1d2e; border-color: #2d3148; }
    .swagger-ui .model-title { color: #e2e8f0; }
    .swagger-ui textarea { background-color: #1e2235; color: #e2e8f0; border-color: #2d3148; }
    .swagger-ui input[type=text], .swagger-ui input[type=password], .swagger-ui input[type=search],
    .swagger-ui input[type=email] { background-color: #1e2235; color: #e2e8f0; border-color: #2d3148; }
    .swagger-ui select { background-color: #1e2235; color: #e2e8f0; border-color: #2d3148; }
    .swagger-ui .btn { border-color: #4a5568; color: #e2e8f0; }
    .swagger-ui .btn.authorize { background-color: #1e2235; border-color: #4299e1; color: #4299e1; }
    .swagger-ui .btn.authorize svg { fill: #4299e1; }
    .swagger-ui .btn.execute { background-color: #2b5282; border-color: #2b5282; }
    .swagger-ui .modal-ux { background-color: #1a1d2e; border-color: #2d3148; }
    .swagger-ui .modal-ux-header { border-color: #2d3148; }
    .swagger-ui .modal-ux-header h3 { color: #e2e8f0; }
    .swagger-ui .modal-ux-content p, .swagger-ui .modal-ux-content h4 { color: #a0aec0; }
    .swagger-ui .dialog-ux .modal-ux { background-color: #1a1d2e; }
    .swagger-ui .highlight-code { background-color: #141726; }
    .swagger-ui .microlight { background-color: #141726 !important; color: #a0aec0 !important; }
    .swagger-ui .markdown code, .swagger-ui .renderedMarkdown code { background-color: #2d3148; color: #e2e8f0; }
    .swagger-ui .loading-container .loading::after { border-color: #4299e1 transparent #4299e1 transparent; }
    .swagger-ui .arrow { filter: invert(1); }
  `;

  SwaggerModule.setup('docs', app, document, {
    customCss: darkModeCss,
    customSiteTitle: 'RHCore API Docs',
  });

  app.enableCors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
