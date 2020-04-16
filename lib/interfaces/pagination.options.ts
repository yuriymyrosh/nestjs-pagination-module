import { Request } from 'express';

export interface PaginationOptions {
  // page to fetch
  page: number;

  // limit per page
  limit?: number;

  // to be used in next/prev meta properties
  request?: Request;
}
