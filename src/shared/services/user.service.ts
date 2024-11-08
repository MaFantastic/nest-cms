import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { MySQLBaseService } from './mysql-base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class UserService extends MySQLBaseService<User> {
    constructor(
        @InjectRepository(User)
        protected repository: Repository<User>
    ) {
        super(repository);
    }
}