import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Inject,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuards } from 'src/auth/guards';
import { Request } from 'express';
import { SetUserMetadataPipe } from 'src/util/set-user-metadata.pipe';
import { REQUEST } from '@nestjs/core';

@UseGuards(JwtAuthGuards)
@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    // private readonly setUserMetadataPipe: SetUserMetadataPipe,
  ) {}

  @Post()
  @UsePipes(SetUserMetadataPipe)
  create(@Body() createTodoDto: CreateTodoDto) {
    // console.log(this.req.user);
    return this.todoService.create(createTodoDto);
  }

  // @Post()
  // create(@UserMetadata() @Body() createTodoDto: CreateTodoDto) {
  //   return this.todoService.create(createTodoDto);
  // }
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
