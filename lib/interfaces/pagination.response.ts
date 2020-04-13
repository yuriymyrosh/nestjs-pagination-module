export interface PaginationResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  pageCount: number;
  next: string;
  previous: string;
}