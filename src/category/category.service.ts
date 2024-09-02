import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { CategoryResponseDto } from './dto/category.response.dto';
import { ICategoryResponse } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const { title, description, parentId, createdBy } = createCategoryDto;
    console.log('createCategoryDto', createCategoryDto);

    const category = new Category();
    category.title = title;
    category.description = description || null;
    category.createdBy = createdBy;

    if (parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: parentId },
      });
      if (parent) {
        category.parent = parent;
      } else {
        throw new BadRequestException('Parent category not found');
      }
    }

    const savedCat = await this.categoryRepository.save(category);
    let resp: CategoryResponseDto = new CategoryResponseDto(savedCat);

    return resp;
    // return savedCat;
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const allCat = await this.categoryRepository.find({
      relations: ['parent', 'children'],
    });

    let resp: CategoryResponseDto[] = allCat.map(
      (cat) => new CategoryResponseDto(cat),
    );

    return resp;
  }

  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
  }
}
