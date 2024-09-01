import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from './pagination.dto';

export async function paginate<T>(
  repository: Repository<T>,
  paginationDto: PaginationDto,
  alias: string,
): Promise<{ data: T[]; total: number; page: number; limit: number }> {
  let { page, limit, sort, order } = paginationDto;
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const queryBuilder: SelectQueryBuilder<T> =
    repository.createQueryBuilder(alias);

  if (sort) {
    queryBuilder.orderBy(`${alias}.${sort}`, order);
  }

  const [data, total] = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    data,
    total,
    page,
    limit,
  };
}
