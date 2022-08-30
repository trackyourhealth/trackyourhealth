const serviceMock = {
  study: {
    create: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

const clearMocks = () => {
  serviceMock.study.create.mockClear();
  serviceMock.study.delete.mockClear();
  serviceMock.study.findMany.mockClear();
  serviceMock.study.findUnique.mockClear();
  serviceMock.study.update.mockClear();
  serviceMock.study.count.mockClear();
};

export const studyCrudMock = {
  service: serviceMock,
  clearMocks: clearMocks,
  create: serviceMock.study.create,
  delete: serviceMock.study.delete,
  findMany: serviceMock.study.findMany,
  findUnique: serviceMock.study.findUnique,
  update: serviceMock.study.update,
  count: serviceMock.study.count,
};

describe('StudyPrismaMock', () => {
  it('is defined', () => {
    expect(studyCrudMock).toBeDefined();
  });
});
