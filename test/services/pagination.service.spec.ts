import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from '../../lib/pagination-module/services';

describe('pagination service tests', () => {
  let service: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationService]
    }).compile();

    service = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should paginate', async () => {});
});
