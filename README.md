# Pagination Module for Nest.js

[![Build Status](https://travis-ci.org/Konro1/nest-pagination-module.svg?branch=master)](https://travis-ci.org/Konro1/nest-pagination-module)
![npm](https://img.shields.io/npm/dw/nest-pagination-module)
![npm](https://img.shields.io/npm/v/nest-pagination-module)

This is module for [nest.js](https://nestjs.com/) framework that provides pagination for typeorm repositories and query builder.

* [Installation](#installation)
* [Usage](#usage)
* [Response example](#response-example)

## Installation:

```bash
npm i --save nest-pagination-module
```

## Usage

### Import pagination into module

```ts
@Module({
  imports: [
    ...
    PaginationModule,
  ],
  ...
})
export class MyModule {}
```

### Inject PaginationService into your service:

```ts
@Injectable()
export class MyService {
  constructor(
    private readonly _repo: MyRepo<MyEntity>,
    private readonly _paginationService: PaginationService
  ) {}
}
```

### Use pagination in service methods where you need it:

```ts
public async findAllPaginated(options: PaginationOptions) {
  return this._paginationService.paginate<MyEntity>(this.repo, options);
}
```

### PaginationOptions interface:

```ts
{
  // page to fetch
  page: number;

  // limit per page
  limit: number;

  // @todo not implemented yet, route will be used in next/prev meta properties
  route?: string;
}
```

### Controller example

```ts
@Controller('/api/myendpoint')
export class MyController {
  constructor(protected readonly service: MyService) {}

  @Get()
  async getAll(@Query('page') page = 0, @Query('limit') limit = 25) {
    this.service.findAllPaginated({ page, limit });
  }
}
```

## Response example

```json
{
  "items": [
    {
      "item": 1
    },
    {
      "item": 2
    },
    {
      "item": 3
    },
    ...
  ],
  "page": 1,
  "limit": 25,
  "totalItems": 100,
  "pageCount": 4,
  "next": "",
  "previous": "",
}
```
