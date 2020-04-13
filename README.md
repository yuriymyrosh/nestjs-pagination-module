# Pagination Module for Nest.js

This is module for (nest.js)[https://nestjs.com/] framework.

## Installation:

`npm i --save konro1/nestjs-pagination-module`

## Usage
Import pagination into module:

```
@Module({
  imports: [
    ...
    PaginationModule,
  ],
  ...
})
export class MyModule {}
```

Inject PaginationService into your service:

```
@Injectable()
export class MyService {
  constructor(
    private readonly _repo: MyRepo<MyEntity>,
    private readonly _paginationService: PaginationService<MyEntity>
  ) {}
}
```

Use pagination whenever you need it:

```
public async findAllPaginated(options: PaginationOptions) {
  return this._paginationService.paginate(this.repo, options);
}
```
