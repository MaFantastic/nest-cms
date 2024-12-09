import { ApiProperty, PartialType as PartialTypeFromSwagger } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { IdValidators, StatusValidators, SortValidators } from '../decorators/dto.decorator';
export enum AccessType {
   MODULE = 'module',
   MENU = 'menu',
   FEATURE = 'feature',
}
export class CreateAccessDto {
    @IsString()
    @ApiProperty({ description: '名称', example: 'name' })
    name: string;

   @ApiProperty({ description: '类型', example: 'module' })
   type?: AccessType;

   @ApiProperty({ description: 'url地址', example: '/admin/users' })
   url?: string;

   @ApiProperty({ description: '父权限ID', example: '1' })
   parentId?: number;

   @ApiProperty({ description: '描述', example: '用户管理' })
   description?: string;

    @StatusValidators()
    @ApiProperty({ description: '状态', example: 1 })
    status: number;

    @SortValidators()
    @ApiProperty({ description: '排序号', example: 100 })
    sort: number;
}

export class UpdateAccessDto extends PartialTypeFromSwagger(PartialType(CreateAccessDto)) {
    @IdValidators()
    id: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户名', example: 'nick' })
    username: string;

    @ApiProperty({ description: '密码', example: '666666' })
    @IsOptional()
    password: string;
}

