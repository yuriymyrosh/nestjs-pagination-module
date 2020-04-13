# Pagination Module for Nest.js

This is module for [nest.js](https://nestjs.com/) framework.

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

### Use pagination whenever you need it:

```ts
public async findAllPaginated(options: PaginationOptions) {
  return this._paginationService.paginate<MyEntity>(this.repo, options);
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
