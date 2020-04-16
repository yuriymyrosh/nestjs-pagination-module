import { FindManyOptions } from 'typeorm';

const _mockData = [
  {
    item: 1,
  },
  {
    item: 2,
  },
  {
    item: 3,
  },
  {
    item: 4,
  },
  {
    item: 5,
  },
  {
    item: 6,
  },
  {
    item: 7,
  },
  {
    item: 8,
  },
  {
    item: 9,
  },
  {
    item: 10,
  },
  {
    item: 11,
  },
  {
    item: 12,
  },
  {
    item: 13,
  },
  {
    item: 14,
  },
  {
    item: 15,
  },
  {
    item: 16,
  },
  {
    item: 17,
  },
  {
    item: 18,
  },
  {
    item: 19,
  },
  {
    item: 20,
  },
  {
    item: 21,
  },
  {
    item: 22,
  },
  {
    item: 23,
  },
  {
    item: 24,
  },
  {
    item: 25,
  },
  {
    item: 26,
  },
  {
    item: 27,
  },
  {
    item: 28,
  },
  {
    item: 29,
  },
  {
    item: 30,
  },
  {
    item: 31,
  },
  {
    item: 32,
  },
  {
    item: 33,
  },
];

export const repoMock = {
  findAndCount: jest.fn((options: FindManyOptions<any>) => {
    const found = _mockData.slice(options.skip, options.skip + options.take);

    return [found, _mockData.length];
  }),
};
