import { Injectable, UseInterceptors } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoRepository } from './todo.repository';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { paginate } from 'src/common/pagination/pagination.service';
import { PageData } from 'src/common/pagination/pagedata.dto';
import { classToPlain } from '@nestjs/class-transformer';
import { LoggingInterceptor } from 'src/common/intercepotors/logging.interceptor';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: TodoRepository,
  ) {}

  create(createTodoDto: CreateTodoDto) {
    return this.todoRepository.save(createTodoDto);
  }

  async findAll(paginationDto: PaginationDto): Promise<PageData<Todo>> {
    const { data, total, page, limit } = await paginate(
      this.todoRepository,
      paginationDto,
      'todos',
    );
    // return classToPlain({
    //   items: data,
    //   totalItems: total,
    //   currentPage: page,
    //   totalPages: Math.ceil(total / limit),
    // });
    return {
      items: data,
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
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
