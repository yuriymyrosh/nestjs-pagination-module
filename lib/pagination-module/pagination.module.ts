import { Module } from '@nestjs/common';
import { PaginationService } from './services/paginaition.service';

@Module({
  providers: [PaginationService],
  exports: [PaginationService]
})
export class PaginationModule {}
