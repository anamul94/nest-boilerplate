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
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuards } from 'src/auth/guards';
import { Request } from 'express';
import { SetUserMetadataPipe } from 'src/common/pipes/set-user-metadata.pipe';
import { REQUEST } from '@nestjs/core';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { Public } from 'src/auth/decorators';
import { LoggingInterceptor } from 'src/common/intercepotors/logging.interceptor';

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
  @Public()
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto);
    return this.todoService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(SetUserMetadataPipe)
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    console.log(updateTodoDto);
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
