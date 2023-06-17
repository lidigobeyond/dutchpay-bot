import { Test, TestingModule } from '@nestjs/testing';
import { DutchPayCreatedMessageService } from './dutch-pay-created-message.service';

describe('DutchPayCreatedMessageService', () => {
  let service: DutchPayCreatedMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DutchPayCreatedMessageService],
    }).compile();

    service = module.get<DutchPayCreatedMessageService>(DutchPayCreatedMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
