import { Test, TestingModule } from '@nestjs/testing';
import {
  PaginationService,
  MAX_LIMIT,
  DEFAULT_LIMIT,
} from '../../lib/pagination-module/services';
import { repoMock } from '../mocks/repo.mock';

describe('pagination service tests', () => {
  let service: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationService],
    }).compile();

    service = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should paginate one by one', async () => {
    const response = await service.paginate(repoMock as any, {
      page: 1,
      limit: 1,
    });

    expect(repoMock.findAndCount).toBeCalledWith({ skip: 0, take: 1 });
    expect(response).toBeTruthy();
    expect(response.items).toBeTruthy();
    expect(response.items.length).toBe(1);
    expect(response.page).toBe(1);
    expect(response.limit).toBe(1);
  });

  it('should paginate some next pages', async () => {
    const response = await service.paginate(repoMock as any, {
      page: 2,
      limit: 2,
    });

    expect(response).toBeTruthy();
    expect(response.items).toBeTruthy();
    expect(response.items.length).toBe(2);
    expect(response.page).toBe(2);
    expect(response.limit).toBe(2);
    expect(response.items).toEqual([{ item: 3 }, { item: 4 }]);
  });

  it("shouldn't paginate more then MAX_LIMIT", async () => {
    const response = await service.paginate(repoMock as any, {
      page: 1,
      limit: MAX_LIMIT + 2,
    });

    expect(response).toBeTruthy();
    expect(response.limit).toBe(MAX_LIMIT);
  });

  it('should take DEFAULT_LIMIT when no limit provided', async () => {
    const response = await service.paginate(repoMock as any, {
      page: 1,
    });

    expect(response).toBeTruthy();
    expect(response.limit).toBe(DEFAULT_LIMIT);
  });

  it('should take first page when page is negative', async () => {
    const response = await service.paginate(repoMock as any, {
      page: -1,
    });

    expect(response).toBeTruthy();
    expect(response.page).toBe(1);
  });

  it('should return links when request is provided', async () => {
    const response = await service.paginate(repoMock as any, {
      page: 0,
      request: {
        query: {},
        url: '/api/test',
      } as any,
    });

    expect(response).toBeTruthy();
    expect(response.next).toEqual(`/api/test?page=2&limit=${DEFAULT_LIMIT}`);
  });

  it('should return links for first page without previous', async () => {
    const response = await service.paginate(repoMock as any, {
      page: 0,
      request: {
        query: {},
        url: '/api/test',
      } as any,
    });

    expect(response).toBeTruthy();
    expect(response.next).toEqual(`/api/test?page=2&limit=${DEFAULT_LIMIT}`);
    expect(response.previous).toEqual(null);
  });

  it('should return links for second page', async () => {
    const response = await service.paginate(repoMock as any, {
      page: 2,
      limit: 10,
      request: {
        query: {},
        url: '/api/test',
      } as any,
    });

    expect(response).toBeTruthy();
    expect(response.next).toEqual(`/api/test?page=3&limit=10`);
    expect(response.previous).toEqual(`/api/test?page=1&limit=10`);
  });

  it('should return links for last page without next', async () => {
    const response = await service.paginate(repoMock as any, {
      page: 2,
      limit: 30,
      request: {
        query: {},
        url: '/api/test',
      } as any,
    });

    expect(response).toBeTruthy();
    expect(response.totalItems).toBe(33);
    expect(response.limit).toBe(30);
    expect(response.page).toBe(2);
    expect(response.pageCount).toBe(2);
    expect(response.next).toEqual(null);
    expect(response.previous).toEqual(`/api/test?page=1&limit=30`);
  });

  it('should return links and save query params', async () => {
    const response = await service.paginate(repoMock as any, {
      page: 2,
      limit: 30,
      request: {
        query: {
          sortBy: 'item'
        },
        url: '/api/test',
      } as any,
    });

    expect(response).toBeTruthy();
    expect(response.totalItems).toBe(33);
    expect(response.limit).toBe(30);
    expect(response.page).toBe(2);
    expect(response.pageCount).toBe(2);
    expect(response.next).toEqual(null);
    expect(response.previous).toEqual(`/api/test?sortBy=item&page=1&limit=30`);
  });
});
