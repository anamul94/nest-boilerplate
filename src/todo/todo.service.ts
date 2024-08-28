import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoRepository } from './todo.repository';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: TodoRepository,
  ) {}

  create(createTodoDto: CreateTodoDto) {
    return this.todoRepository.save(createTodoDto);
  }

  findAll() {
    return `This action returns all todo`;
  }

  findOne(id: number) {
    return this.todoRepository.findOneBy({ id: id });
  }

  update(id: string, updateTodoDto: UpdateTodoDto) {
    // const todo = this.todoRepository.findOneBy({ id: id });
    // if (!todo) {
    //   return `Todo with ID ${id} not found`;
    // }
    // return this.todoRepository.save({
    //   ...todo,
    //   ...updateTodoDto,
    // });
    return this.todoRepository.update(id, updateTodoDto);
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
