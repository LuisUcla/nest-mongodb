import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }), 
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/library-nest-api'),
    BookModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}