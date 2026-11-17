import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './modules/articles/articles.module';
import { StatusController } from './modules/status/status.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ArticlesModule],
  controllers: [StatusController],
})
export class AppModule {}
