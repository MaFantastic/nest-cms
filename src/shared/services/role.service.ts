import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository, Like, In } from 'typeorm';
import { MySQLBaseService } from './mysql-base.service';
import { Access } from '../entities/access.entity';
import { UpdateRoleAccessesDto } from '../dto/role.dto';
@Injectable()
export class RoleService extends MySQLBaseService<Role> {
  constructor(
    @InjectRepository(Role) protected repository: Repository<Role>,
    @InjectRepository(Access)
    private readonly accessRepository: Repository<Access>,
  ) {
    super(repository);
  }

  async findAll(keyword?: string) {
    const where = keyword ? [{ name: Like(`%${keyword}%`) }] : {};
    return this.repository.find({ where });
  }

  async findAllWithPagination(page: number, limit: number, keyword?: string) {
    const where = keyword ? [{ name: Like(`%${keyword}%`) }] : {};
    const [roles, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { roles, total };
  }
  async updateAccesses(
    id: number,
    updateRoleAccessesDto: UpdateRoleAccessesDto,
  ) {
    const role = await this.repository.findOneBy({ id });
    if (!role) throw new Error('Role not found');
    role.accesses = await this.accessRepository.findBy({
      id: In(updateRoleAccessesDto.accessIds),
    });
    await this.repository.save(role);
  }
}
