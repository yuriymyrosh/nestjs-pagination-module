export interface PaginationOptions {

  // page to fetch
  page: number;

  // limit per page
  limit: number;

  // route to be used in next/prev meta properties
  route?: string;
}
