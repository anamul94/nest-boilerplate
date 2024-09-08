import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { CategoryResponseDto } from './dto/category.response.dto';
import { JwtAuthGuards } from 'src/auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SetUserMetadataPipe } from 'src/common/pipes/set-user-metadata.pipe';
import { ICategoryResponse } from './interfaces/category.interface';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuards)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(SetUserMetadataPipe)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const savedCat: ICategoryResponse =
      await this.categoryService.create(createCategoryDto);
    return savedCat;
  }

  @Get()
  async findAll(): Promise<CategoryResponseDto[]> {
    const allCat: ICategoryResponse[] = await this.categoryService.findAll();
    return allCat;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(id);
  }
}
