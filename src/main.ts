import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { engine } from 'express-handlebars';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { I18nValidationPipe } from 'nestjs-i18n';
import * as helpers from 'src/shared/helpers';
async function bootstrap() {
  // 使用 NestFactory 创建一个 NestExpressApplication 实例
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // 配置静态资源目录
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // 设置视图文件的基本目录
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // 配置 Handlebars 引擎
  app.engine(
    'hbs',
    engine({
      // 设置文件扩展名为 .hbs
      extname: '.hbs',
      helpers,
      // 配置运行时选项
      runtimeOptions: {
        // 允许默认情况下访问原型属性
        allowProtoPropertiesByDefault: true,
        // 允许默认情况下访问原型方法
        allowProtoMethodsByDefault: true,
      },
    }),
  );
  // 设置视图引擎为 hbs（Handlebars）
  app.set('view engine', 'hbs');
  app.use(cookieParser());
  app.use(
    session({
      secret: 'secret-key',
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );
  app.useGlobalPipes(new I18nValidationPipe({ transform: true }));
  //app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false }));
  const config = new DocumentBuilder()
    .setTitle('CMS API')
    .setDescription('CMS API 描述')
    .setVersion('1.0')
    .addTag('CMS')
    .addCookieAuth('connect.sid')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  await app.listen(3000);
}
bootstrap();
