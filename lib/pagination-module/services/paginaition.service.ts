import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, Repository } from 'typeorm';
import { PaginationOptions } from '../../interfaces/pagination.options';
import { PaginationResponse } from '../../interfaces/pagination.response';

export const TAKE_LIMIT = 1000;
export const DAFAULT_TAKE_VALUE = 25;

@Injectable()
export class PaginationService {

  public async paginate<T>(
    repo: SelectQueryBuilder<T> | Repository<T>,
    options: PaginationOptions
  ): Promise<PaginationResponse<T>> {
    let items = [];
    let total = 0;

    if (repo instanceof SelectQueryBuilder) {
      [items, total] = await this._paginateQueryBuilder<T>(repo, options);
    } else {
      [items, total] = await this._paginateRepository(repo, options);
    }

    return {
      items,
      ...this._getPaginationMeta(options, total)
    };
  }

  private async _paginateQueryBuilder<T>(
    qb: SelectQueryBuilder<T>,
    options: PaginationOptions
  ) {
    return qb
      .limit(options.limit)
      .offset(this._getOffset(options))
      .getManyAndCount();
  }

  private async _paginateRepository<T>(
    repo: Repository<T>,
    options: PaginationOptions
  ) {
    return repo.findAndCount({
      skip: this._getOffset(options),
      take: options.limit
    });
  }

  private _getOffset(options: PaginationOptions) {
    if (options.page < 1) {
      return 0;
    }

    return (options.page - 1) * options.limit;
  }

  private _getPaginationMeta(options: PaginationOptions, total: number) {
    return {
      page: options.page || 1,
      limit: options.limit,
      totalItems: total,
      pageCount: Math.ceil(total / options.limit),
      next: '',
      previous: ''
    };
  }
}
