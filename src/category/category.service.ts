import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  // async findAll(): Promise<CategoryResponseDto[]> {
  //   const allCat = await this.categoryRepository.find({
  //     relations: ['parent', 'children'],
  //   });

  //   let resp: CategoryResponseDto[] = allCat.map(
  //     (cat) => new CategoryResponseDto(cat),
  //   );

  //   return resp;
  // }

  async findAll(): Promise<CategoryResponseDto[]> {
    const rootCategories = await this.categoryRepository.find({
      where: { parent: null }, // Get only root categories (categories without a parent)
      relations: ['children'], // Load the immediate children
    });

    // Recursively load all the children for each root category
    for (const category of rootCategories) {
      await this.loadChildrenRecursively(category);
    }

    return rootCategories.map((category) => new CategoryResponseDto(category));
  }

  // Recursive function to load all children for a category
  private async loadChildrenRecursively(category: Category): Promise<void> {
    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        const loadedChild = await this.categoryRepository.findOne({
          where: { id: child.id },
          relations: ['children'], // Load children for the child category
        });

        child.children = loadedChild?.children ?? []; // Update the children list
        await this.loadChildrenRecursively(child); // Recursively load the children's children
      }
    }
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['children'], // Load the immediate children of the category
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Recursively load all the children
    await this.loadChildrenRecursively(category);

    // Return the category as a CategoryResponseDto
    return new CategoryResponseDto(category);
  }
}
