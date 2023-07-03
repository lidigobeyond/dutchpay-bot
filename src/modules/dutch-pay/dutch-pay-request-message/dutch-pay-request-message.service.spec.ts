import { Test, TestingModule } from '@nestjs/testing';
import { DutchPayRequestMessageService } from './dutch-pay-request-message.service';

describe('DutchPayRequestMessageService', () => {
  let service: DutchPayRequestMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DutchPayRequestMessageService],
    }).compile();

    service = module.get<DutchPayRequestMessageService>(DutchPayRequestMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
