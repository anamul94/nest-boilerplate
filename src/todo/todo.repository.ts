import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';

export class TodoRepository extends Repository<Todo> {}
