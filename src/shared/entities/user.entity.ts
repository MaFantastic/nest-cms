import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';
@Entity()
export class User {
    @PrimaryGeneratedColumn()//自增的主键列
    @ApiProperty({ description: '用户ID', example: 1 })
    id: number
    @Column({ length: 50, unique: true })
    @ApiProperty({ description: '用户名', example: 'nick' })
    username: string
    @Column()
    @Exclude()
    @ApiHideProperty()
    password: string
    @Column({ length: 15, nullable: true })
    @Transform(({ value }) => {
        return value ? value.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3') : value;
    })
    @ApiProperty({ description: '手机号', example: '15788888888' })
    mobile: string
    @Expose()
    @ApiProperty({ description: '联系方式', example: '邮箱:nick@qq.com' })
    get contact(): string {
        return `邮件:${this.email}`
    }
    @Column({ length: 100, nullable: true })
    @ApiProperty({ description: '邮件', example: 'nick@qq.com' })
    email: string

   @ManyToMany(() => Role)
   @JoinTable()
   roles: Role[];

    @Column({ default: 1 })
    @ApiProperty({ description: '生效状态', example: 1 })
    status: number
    @Column({ default: false })
    @ApiProperty({ description: '是否超级管理员', example: true })
    is_super: boolean
    @Column({ default: 100 })
    @ApiProperty({ description: '排序号', example: 100 })
    sort: number
    @CreateDateColumn()
    @ApiProperty({ description: '创建时间', example: '2024年8月11日16:49:22' })
    createdAt: Date
    @UpdateDateColumn()
    @ApiProperty({ description: '更新时间', example: '2024年8月11日16:49:22' })
    updatedAt: Date
}