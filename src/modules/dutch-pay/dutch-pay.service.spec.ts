import { Test, TestingModule } from '@nestjs/testing';
import { DutchPayService } from './dutch-pay.service';

describe('DutchPayService', () => {
  let service: DutchPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DutchPayService],
    }).compile();

    service = module.get<DutchPayService>(DutchPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
