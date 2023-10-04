import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }), 
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/library-nest-api'),
    BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}