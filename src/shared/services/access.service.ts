import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Access } from "../entities/access.entity";
import { MySQLBaseService } from "./mysql-base.service";
import { CreateAccessDto, UpdateAccessDto } from '../dto/access.dto';
import { TreeRepository, UpdateResult } from 'typeorm';
@Injectable()
export class AccessService extends MySQLBaseService<Access> {
  constructor(
   @InjectRepository(Access) protected repository: TreeRepository<Access>
  ) {
    super(repository);
  }

 async findAll(): Promise<Access[]> {
   const accessTree = await this.repository.findTrees({ relations: ['children', 'parent'] });
   return accessTree.filter(access => !access.parent);
  }
 async create(createAccessDto: CreateAccessDto): Promise<Access> {
   const { parentId, ...dto } = createAccessDto;
   const access = this.repository.create(dto);
   if (parentId) {
     access.parent = await this.repository.findOneBy({ id: parentId });
   }
   await this.repository.save(access);
   return this.findOne({ where: { id: access.id } });
 }
 async update(id: number, updateAccessDto: UpdateAccessDto) {
   const { parentId, ...dto } = updateAccessDto;
   const access = await this.repository.findOneBy({ id });
   if (!access) throw new Error('Access not found');
   Object.assign(access, dto);
   if (parentId) {
     access.parent = await this.repository.findOneBy({ id: parentId });
   }
   await this.repository.save(access);
   return UpdateResult.from({ raw: [], affected: 1, records: [] });
  }
}