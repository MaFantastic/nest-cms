import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { engine } from 'express-handlebars';
async function bootstrap() {
  // 使用 NestFactory 创建一个 NestExpressApplication 实例
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 配置静态资源目录
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // 设置视图文件的基本目录
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // 设置视图引擎为 hbs（Handlebars）
  app.set('view engine', 'hbs');
  // 配置 Handlebars 引擎
  app.engine(
    'hbs',
    engine({
      // 设置文件扩展名为 .hbs
      extname: '.hbs',
      // 配置运行时选项
      runtimeOptions: {
        // 允许默认情况下访问原型属性
        allowProtoPropertiesByDefault: true,
        // 允许默认情况下访问原型方法
        allowProtoMethodsByDefault: true,
      },
    }),
  );
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
  await app.listen(3000);
}
bootstrap();
