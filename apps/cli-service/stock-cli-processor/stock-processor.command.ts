import { Command, CommandRunner } from 'nest-commander';
import { StockProcessorService } from './stock-processor.service';
import { Logger } from '@nestjs/common';

@Command({ name: 'stock', description: 'A stock command' })
export class StockProcessorCommand extends CommandRunner {
  private readonly logger = new Logger(StockProcessorCommand.name);
  constructor(private readonly stockProcessorService: StockProcessorService) {
    super();
  }

  async run(): Promise<void> {
    this.logger.log('Processing stock...');
    await this.stockProcessorService.processStock();
  }
}
