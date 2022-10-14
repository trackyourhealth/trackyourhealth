const serviceMock = {
  instrument: {
    create: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $transaction: jest.fn(async (calls: Promise<any>[]) => {
    return await Promise.all(calls);
  }),
};

const clearMocks = () => {
  serviceMock.instrument.create.mockClear();
  serviceMock.instrument.delete.mockClear();
  serviceMock.instrument.findMany.mockClear();
  serviceMock.instrument.findUniqueOrThrow.mockClear();
  serviceMock.instrument.update.mockClear();
  serviceMock.instrument.count.mockClear();
  serviceMock.$transaction.mockClear();
};

export const instrumentCrudMock = {
  service: serviceMock,
  clearMocks: clearMocks,
  create: serviceMock.instrument.create,
  delete: serviceMock.instrument.delete,
  findMany: serviceMock.instrument.findMany,
  findUniqueOrThrow: serviceMock.instrument.findUniqueOrThrow,
  update: serviceMock.instrument.update,
  count: serviceMock.instrument.count,
  $transaction: serviceMock.$transaction,
};

describe('InstrumentPrismaMock', () => {
  it('is defined', () => {
    expect(instrumentCrudMock).toBeDefined();
  });
});
