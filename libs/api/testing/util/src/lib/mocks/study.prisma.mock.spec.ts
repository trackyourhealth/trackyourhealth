const serviceMock = {
  study: {
    create: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(async (calls: Promise<any>[]) => {
    return await Promise.all(calls);
  }),
};

const clearMocks = () => {
  serviceMock.study.create.mockClear();
  serviceMock.study.delete.mockClear();
  serviceMock.study.findMany.mockClear();
  serviceMock.study.findUniqueOrThrow.mockClear();
  serviceMock.study.update.mockClear();
  serviceMock.study.count.mockClear();
  serviceMock.$transaction.mockClear();
};

export const studyCrudMock = {
  service: serviceMock,
  clearMocks: clearMocks,
  create: serviceMock.study.create,
  delete: serviceMock.study.delete,
  findMany: serviceMock.study.findMany,
  findUniqueOrThrow: serviceMock.study.findUniqueOrThrow,
  update: serviceMock.study.update,
  count: serviceMock.study.count,
  $transaction: serviceMock.$transaction,
};

describe('StudyPrismaMock', () => {
  it('is defined', () => {
    expect(studyCrudMock).toBeDefined();
  });
});
