import { Test, TestingModule } from '@nestjs/testing';
import { DutchPayHomeTabService } from './dutch-pay-home-tab.service';

describe('DutchPayHomeTabService', () => {
  let service: DutchPayHomeTabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DutchPayHomeTabService],
    }).compile();

    service = module.get<DutchPayHomeTabService>(DutchPayHomeTabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
