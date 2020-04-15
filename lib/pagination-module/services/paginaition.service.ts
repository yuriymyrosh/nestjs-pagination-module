import { Injectable } from '@nestjs/common';
import {
  SelectQueryBuilder,
  Repository,
  FindConditions,
  FindManyOptions,
} from 'typeorm';
import { PaginationOptions } from '../../interfaces/pagination.options';
import { PaginationResponse } from '../../interfaces/pagination.response';

export const MAX_LIMIT = 1000;
export const DEFAULT_LIMIT = 25;

@Injectable()
export class PaginationService {
  private _total: number;
  private _options: PaginationOptions;

  public async paginate<T>(
    repo: SelectQueryBuilder<T> | Repository<T>,
    options: PaginationOptions,
    findParams?: FindConditions<T> | FindManyOptions<T>,
  ): Promise<PaginationResponse<T>> {
    let items = [];
    let total = 0;
    this._options = this._prepareOptions(options);

    if (repo instanceof SelectQueryBuilder) {
      [items, total] = await this._paginateQueryBuilder<T>(repo);
    } else {
      [items, total] = await this._paginateRepository(repo, findParams);
    }
    this._total = total;

    return {
      items,
      ...this._paginationMeta,
    };
  }

  private _prepareOptions(options: PaginationOptions) {
    let limit: number = options.limit || DEFAULT_LIMIT;

    if (options.limit > MAX_LIMIT) {
      limit = MAX_LIMIT;
    }

    return {
      ...options,
      limit,
      page: options.page < 1 ? 1 : options.page,
    };
  }

  private async _paginateQueryBuilder<T>(qb: SelectQueryBuilder<T>) {
    return qb
      .limit(this._options.limit)
      .offset(this._offset)
      .getManyAndCount();
  }

  private async _paginateRepository<T>(
    repo: Repository<T>,
    findParams?: FindConditions<T> | FindManyOptions<T>,
  ) {
    return repo.findAndCount({
      skip: this._offset,
      take: this._options.limit,
      ...findParams,
    });
  }

  private get _offset() {
    if (this._options.page < 1) {
      return 0;
    }

    return (this._options.page - 1) * this._options.limit;
  }

  private get _nextUrl() {
    return this._options.route ? '' : undefined;
  }
  private get _prevUrl() {
    return this._options.route ? '' : undefined;
  }

  private get _paginationMeta() {
    return {
      page: this._options.page || 1,
      limit: this._options.limit,
      totalItems: this._total,
      pageCount: Math.ceil(this._total / this._options.limit),
      next: this._nextUrl,
      previous: this._prevUrl,
    };
  }
}
