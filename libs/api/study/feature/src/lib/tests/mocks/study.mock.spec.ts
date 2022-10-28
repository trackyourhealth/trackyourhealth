const crudServiceMock = {
  study: {
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

function clearMocks() {
  crudServiceMock.study.create.mockClear();
  crudServiceMock.study.delete.mockClear();
  crudServiceMock.study.findMany.mockClear();
  crudServiceMock.study.findUniqueOrThrow.mockClear();
  crudServiceMock.study.update.mockClear();
  crudServiceMock.study.count.mockClear();
  crudServiceMock.$transaction.mockClear();
}

export const studyCrudMock = {
  service: crudServiceMock,
  clearMocks: clearMocks,
  create: crudServiceMock.study.create,
  delete: crudServiceMock.study.delete,
  findMany: crudServiceMock.study.findMany,
  findUniqueOrThrow: crudServiceMock.study.findUniqueOrThrow,
  update: crudServiceMock.study.update,
  count: crudServiceMock.study.count,
  $transaction: crudServiceMock.$transaction,
};

describe('StudyMock', () => {
  it('is defined', () => {
    expect(true).toBeTruthy();
  });
});
