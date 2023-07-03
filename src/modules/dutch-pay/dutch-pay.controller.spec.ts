import { Test, TestingModule } from '@nestjs/testing';
import { DutchPayController } from './dutch-pay.controller';

describe('DutchPayController', () => {
  let controller: DutchPayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DutchPayController],
    }).compile();

    controller = module.get<DutchPayController>(DutchPayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
