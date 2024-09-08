import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Injectable } from '@nestjs/common';

export interface ITodoService {
  create(createTodoDto: CreateTodoDto);

  findAll(paginationDto: PaginationDto): Promise<any>;

  findOne(id: number);

  update(id: string, updateTodoDto: UpdateTodoDto);

  remove(id: number);
}
