import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './services/configuration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { IsUsernameUniqueConstraint } from './validators/user-validator';
import { UtilityService } from './services/utility.service';
import { Role } from "./entities/role.entity";
import { RoleService } from "./services/role.service";
import { Access } from "./entities/access.entity";
import { AccessService } from "./services/access.service";
@Global()
@Module({
   providers: [IsUsernameUniqueConstraint, ConfigurationService, UtilityService, UserService, RoleService, AccessService],
   exports: [IsUsernameUniqueConstraint, ConfigurationService, UtilityService, UserService, RoleService, AccessService],
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
            })
        }),
       TypeOrmModule.forFeature([User, Role, Role, Access])
    ],
})
export class SharedModule {
}
