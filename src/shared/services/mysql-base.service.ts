import { Repository, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
export abstract class MySQLBaseService<T> {
    constructor(
        protected repository: Repository<T>
    ) {
    }
    async findAll(): Promise<T[]> {
        return this.repository.find();
    }
    async findOne(options: FindOneOptions<T>): Promise<T> {
        return this.repository.findOne(options);
    }
    //DeepPartial:将传进来的实体里面的类型变为可选的
    async create(createDto: DeepPartial<T>): Promise<T | T[]> {
        const entity = this.repository.create(createDto);
        return this.repository.save(entity);
    }
    async update(id: number, updateDto: QueryDeepPartialEntity<T>) {
        return await this.repository.update(id, updateDto);
    }
    async delete(id: number) {
        return await this.repository.delete(id);
    }
}