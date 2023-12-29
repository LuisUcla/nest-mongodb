import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';

import { Query } from 'express-serve-static-core'
import { User } from '../auth/schemas/user.schema';
import { UserActiveInterface } from 'src/shared/interfaces/user-active.interface';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async create(book: CreateBookDto, user: User): Promise<Book> {

        // const bookAlreadyExists = await this.bookModel.findOne({
        //     title: book.title,
        //     author: book.author,
        //     category: book.category
        // })

        // if (bookAlreadyExists) {
        //     throw new ConflictException('The book already exists with that author and category....')
        // }

        const data = Object.assign(book, { user: user._id })

        const bookRes = await this.bookModel.create(data);
        return bookRes;
    }

    async findBooksFilterByKeyword(query: Query): Promise<{ filter: Book[] }> { // se usa para busqueda por titulo

        const resPerPage = 2; // elementos por pagina.
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1); // --> paginacion

        const keyword = query.keyword ? { // filtra por palabra
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {  }

        const books = await this.bookModel
            .find({ ...keyword })
            .limit(resPerPage) // Especifica el número máximo de documentos que devolverá la consulta.
            .skip(skip); // skip: Especifica el número de documentos que se omitirán.

            // logic
        
        return { filter: books};
    }

    async findAll(): Promise <Book[]> {
        const books = await this.bookModel
            .find()
            //.populate('user', ['name', 'email']);

        return books;
    }

    async findById(id: string): Promise<Book> {
        
        const isValidId = mongoose.isValidObjectId(id);
        
        if (!isValidId) {
            throw new BadRequestException('Id is invalid, enter Id Correct...')
        }
        
        const book = await this.bookModel.findById(id)
            // .populate('user', ['name', 'email'],); para hacer relacion con las demas tablas
        
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

    async deleteById(id: string): Promise<{ deleted: boolean }> {

        const isValidId = mongoose.isValidObjectId(id);
        
        if (!isValidId) {
            throw new BadRequestException('Id is invalid, enter Id Correct...')
        }
        
        await this.bookModel.findByIdAndDelete(id);
        return { deleted: true };
    }
}
