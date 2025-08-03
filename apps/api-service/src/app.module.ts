import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './domain/post/post.module';
import { StockModule } from './domain/stock/stock.module';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [
    PostModule,
    StockModule,
    DatabaseModule.forRoot({
      isGlobal: true,
      enableLogging: process.env.NODE_ENV === 'development',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
