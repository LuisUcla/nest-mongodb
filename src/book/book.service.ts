import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async createBook(book: CreateBookDto): Promise<Book> {
        const bookRes = await this.bookModel.create(book);
        return bookRes;
    }

    async findAll(): Promise <Book[]> {
        const books = await this.bookModel.find();
        return books;
    }

    async findById(id: string): Promise<Book> {
        const book = await this.bookModel.findById(id);

        if (!book) {
            throw new NotFoundException('Book Not Found...')
        }

        return book;
    }

    async updateById(id: string, book: Book): Promise<Book> {
        return await this.bookModel.findByIdAndUpdate(id, book, {
            new: true,
            runValidators: true
        });
    }

    async deleteById(id: string): Promise<Book> {
        return await this.bookModel.findByIdAndDelete(id);
    }
}
