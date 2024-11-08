import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from './services/configuration.service';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),//从根目录加载并解析.env文件
    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => ({
        type: 'mysql',
        ...configurationService.mysqlConfig,
        autoLoadEntities: true,//自动加载所有的实体
        synchronize: true,//保持代码和数据库同步
        logging: false,//打印sql语句
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [ConfigurationService, UserService],
  exports: [ConfigurationService, UserService],
})
export class SharedModule {}
