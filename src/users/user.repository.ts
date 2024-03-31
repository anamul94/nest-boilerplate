import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

export default class UserRepository extends Repository<User> {}
