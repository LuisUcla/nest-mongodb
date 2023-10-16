import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';

import { Query } from 'express-serve-static-core'

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async createBook(book: CreateBookDto): Promise<Book> {

        const bookAlreadyExists = await this.bookModel.findOne({
            title: book.title,
            author: book.author,
            category: book.category
        })
        console.log(bookAlreadyExists)

        if (bookAlreadyExists) {
            throw new ConflictException('Book already exists...')
        }

        const bookRes = await this.bookModel.create(book);
        return bookRes;
    }

    async findBooksFilterByKeyword(query: Query) {

        const resPerPage = 3
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1) // --> paginacion

        const keyword = query.keyword ? { // filtra por palabra
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {  }

        const total = await this.findAll()

        const books = await this.bookModel
            .find({ ...keyword })
            .limit(resPerPage) // Especifica el número máximo de documentos que devolverá la consulta.
            .skip(skip); // skip: Especifica el número de documentos que se omitirán.
        
        return {
            currentPage,
            elements: books.length,
            total: total.length,
            books: [...books],
        };
    }

    async findAll(): Promise <Book[]> {
        const books = await this.bookModel.find();
        return books;
    }

    async findById(id: string): Promise<Book> {
        
        const isValidId = mongoose.isValidObjectId(id);
        
        if (!isValidId) {
            throw new BadRequestException('Id is invalid, enter Id Correct...')
        }
        
        const book = await this.bookModel.findById(id);
        
        if (!book) {
            throw new NotFoundException('Book Not Found...')
        }

        return book;
    }

    async updateById(id: string, book: Book): Promise<Book> {

        const isValidId = mongoose.isValidObjectId(id);
        
        if (!isValidId) {
            throw new BadRequestException('Id is invalid, enter Id Correct...')
        }

        return await this.bookModel.findByIdAndUpdate(id, book, {
            new: true,
            runValidators: true
        });
    }

    async deleteById(id: string): Promise<Book> {

        const isValidId = mongoose.isValidObjectId(id);
        
        if (!isValidId) {
            throw new BadRequestException('Id is invalid, enter Id Correct...')
        }
        
        return await this.bookModel.findByIdAndDelete(id);
    }
}
