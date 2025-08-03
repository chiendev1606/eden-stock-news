import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HtmlStripperService } from './html-stripper.service';
import { HtmlStripperConfig } from './htm-stripper.config';

@Module({})
export class HtmlStripperModule {
  static forRoot(config?: Partial<HtmlStripperConfig>): DynamicModule {
    return {
      module: HtmlStripperModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'HTML_STRIPPER_CONFIG',
          useValue: config || {},
        },
        HtmlStripperService,
      ],
      exports: [HtmlStripperService],
      global: true,
    };
  }
}
