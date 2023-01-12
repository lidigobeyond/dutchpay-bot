import { Test, TestingModule } from '@nestjs/testing';
import { DutchPayModalService } from './dutch-pay-modal.service';

describe('DutchPayModalService', () => {
  let service: DutchPayModalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DutchPayModalService],
    }).compile();

    service = module.get<DutchPayModalService>(DutchPayModalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
