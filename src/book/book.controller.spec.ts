import { Test, TestingModule } from "@nestjs/testing"
import { BookService } from "./book.service"
import { getModelToken } from '@nestjs/mongoose';
import { Book } from "./schemas/book.schema";
import mongoose, { Model } from "mongoose";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { User } from "../auth/schemas/user.schema";
import { Category } from "../shared/enums/category.enum";
import { BookController } from "./book.controller";
import { JwtModule } from "@nestjs/jwt";
import { mock } from "node:test";
import { UpdateBookDto } from "./dto/update-book.dto";
 
describe('BookController', () => {
    let bookService:  BookService;
    let bookController: BookController;

    const mockBook = { // dato para simular la prueba
        _id: '61c0ccf11d7bf83d153d7c06',
        title: 'New Book',
        description: 'Book descrption',
        author: 'Author',
        price: 100,
        category: Category.FANTASY,
        user: '61c0ccf11d7bf83d153d7c06',
    }

    const mockUser = {
        _id: '61c0ccf11d7bf83d153d7c06',
        name: 'luis',
        email: "luis@gmail.com"
    }

    const mockBookservice = {
       findAll: jest.fn().mockResolvedValueOnce([mockBook]),
       findBooksFilterByKeyword: jest.fn().mockResolvedValueOnce([mockBook]),
       create: jest.fn(),
       findById: jest.fn().mockResolvedValueOnce(mockBook),
       updateById: jest.fn(),
       deleteById: jest.fn().mockResolvedValueOnce({ deleted: true })
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule],
            controllers: [BookController],
            providers: [
               {
                provide: BookService,
                useValue: mockBookservice
               }
            ]
        }).compile();

        bookService = module.get<BookService>(BookService);
        bookController = module.get<BookController>(BookController)
    });

    it('should be defined', () => {
        expect(bookController).toBeDefined();
    });

    describe('getAllBooks', () => {
        it('should get all books', async () => {
            const result = await bookController.getAllBooks();

            expect(bookService.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockBook])
        })
    });

    describe('getBooksFilterByKeyword', () => {
        it('should get all books by keyword', async () => {
            const result = await bookController.getBooksFilterByKeyword(
                { page: "1", keyword: 'test' }
            );

            expect(bookService.findBooksFilterByKeyword).toHaveBeenCalled();
            expect(result).toEqual([mockBook])
        })
    });

    describe('createBook', () => {
        it('should create a new book', async () => {
            const newBook = { // dato para simular el registro de un book
                title: 'New Book',
                description: 'Book descrption',
                author: 'Author',
                price: 100,
                category: Category.FANTASY
            }

            mockBookservice.create = jest.fn().mockResolvedValueOnce(mockBook)
            const result = await bookController.createBook(newBook as CreateBookDto, mockUser as User);

            expect(bookService.create).toHaveBeenCalled();
            expect(result).toEqual(mockBook)
        })
    });

    describe('getBook', () => {
        it('should get a book by Id', async () => {
            const result = await bookController.getBook(mockBook._id);

            expect(bookService.findById).toHaveBeenCalled();
            expect(result).toEqual(mockBook)
        })
    });

    describe('updateBook', () => {
        it('should update a book by Id', async () => {

            const updatedBook = { ...mockBook, title: 'Update name' } // dato de simulacion de prueba
            const book = { title: 'Update name' };

            mockBookservice.updateById = jest.fn().mockResolvedValueOnce(updatedBook);

            const result = await bookController.updateBook(mockBook._id, book as UpdateBookDto);

            expect(bookService.updateById).toHaveBeenCalled();
            expect(result).toEqual(updatedBook)
        })
    });

    describe('deleteBook', () => {
        it('should delete a book by Id', async () => {

            const result = await bookController.deteleBook(mockBook._id);

            expect(bookService.deleteById).toHaveBeenCalled();
            expect(result).toEqual({ deleted: true })
        })
    });
})
