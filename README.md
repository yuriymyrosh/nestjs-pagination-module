# Pagination Module for Nest.js

[![Build Status](https://travis-ci.org/Konro1/nestjs-pagination-module.svg?branch=master)](https://travis-ci.org/Konro1/nestjs-pagination-module)
[![npm](https://www.npmjs.com/package/nestjs-pagination-module)](https://img.shields.io/npm/dw/nestjs-pagination-module)
[![npm](https://www.npmjs.com/package/nestjs-pagination-module)](https://img.shields.io/npm/v/nestjs-pagination-module)

This is module for [nest.js](https://nestjs.com/) framework that provides pagination for typeorm repositories and query builder.

* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Response example](#response-example)

## Requirements

| Dependency | version |
|---|:-:|
| node  | > 10 |
| nestJs | > 6.0.0  |
| typeorm | ^0.2.22 |

## Installation:

```bash
npm i --save nestjs-pagination-module
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

  // express request will be used in next/prev meta properties
  request?: Request;
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

### Links

In order to receive links in response, you should provide express request object to pagination options.

Inject request into Controller method:
```ts
@Get()
async getAll(
  @Req() request: Request,
  @Query('page') page = 0,
  @Query('limit') limit = 25) {
  this.service.findAllPaginated({ page, limit });
}
```
Pass this request into service

```ts
this.paginationService.paginate({
  page: 1,
  limit: 10,
  request
})
```
It will build next/previous pages links and return them in response. If there no previous or next pages you will receive `null` in response object.
```json
{
  "next": "/api/myendpoint?page=2&limit=25",
  "previous": null,
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
  "next": "/api/myendpoint?page=2&limit=25",
  "previous": null,
}
```
