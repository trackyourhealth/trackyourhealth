const kratosGuardMock = {
  canActivate: jest.fn(async () => true),
};

export const kratosMock = {
  guard: kratosGuardMock,
  canActivate: kratosGuardMock.canActivate,
};

describe('Kratos', () => {
  it('should be defined', () => {
    expect(kratosMock).toBeDefined();
  });
});
