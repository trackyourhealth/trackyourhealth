import { Test } from '@nestjs/testing';

import { ApiStudiesController } from './api-studies.controller';
import { ApiStudiesService } from './api-studies.service';

describe('ApiStudiesController', () => {
  let controller: ApiStudiesController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiStudiesService],
      controllers: [ApiStudiesController],
    }).compile();

    controller = module.get(ApiStudiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
