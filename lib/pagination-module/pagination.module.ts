import { Module } from '@nestjs/common';
import { PaginationService } from './services/paginaition.service';

@Module({
  providers: [PaginationService]
})
export class PaginationModule {}
