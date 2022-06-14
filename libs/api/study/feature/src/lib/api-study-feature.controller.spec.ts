import { Test } from '@nestjs/testing';

import { ApiStudyFeatureController } from './api-study-feature.controller';

describe('ApiStudyFeatureController', () => {
  let controller: ApiStudyFeatureController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ApiStudyFeatureController],
    }).compile();

    controller = module.get(ApiStudyFeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
