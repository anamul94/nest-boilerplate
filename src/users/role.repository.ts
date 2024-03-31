import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
export class RoleRepository extends Repository<Role> {}
