import { Injectable } from '@nestjs/common';
import {
  SelectQueryBuilder,
  Repository,
  FindConditions,
  FindManyOptions,
} from 'typeorm';
import { PaginationOptions } from '../../interfaces/pagination.options';
import { PaginationResponse } from '../../interfaces/pagination.response';
import * as url from 'url';
import { isString } from 'util';

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

  private _prepareOptions(options: PaginationOptions): PaginationOptions {
    if (isString(options.page)) {
      options.page = parseInt(options.page);
    }
    if (isString(options.limit)) {
      options.limit = parseInt(options.limit);
    }
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
    if (!this._options.request) {
      return;
    }

    if (this._nextPage) {
      return this._builUrl(this._nextPage);
    }

    return null;
  }

  private get _prevUrl() {
    if (!this._options.request) {
      return;
    }

    if (this._options.page > 1) {
      return this._builUrl(this._options.page - 1);
    }

    return null;
  }

  private get _nextPage() {
    const nextPage = this._options.page + 1;
    if (nextPage <= this._pageCount) {
      return nextPage;
    }

    return null;
  }

  private _builUrl(page) {
    const { query } = this._options.request;

    query.page = '' + page;
    query.limit = '' + this._options.limit;
    const queryString = Object.keys(query)
      .map((key) => key + '=' + query[key])
      .join('&');
    const { pathname } = url.parse(this._options.request.url);

    return `${pathname}?${queryString}`;
  }

  private get _pageCount() {
    return Math.ceil(this._total / this._options.limit);
  }

  private get _paginationMeta() {
    return {
      page: +this._options.page || 1,
      limit: +this._options.limit,
      totalItems: +this._total,
      pageCount: +this._pageCount,
      next: this._nextUrl,
      previous: this._prevUrl,
    };
  }
}
