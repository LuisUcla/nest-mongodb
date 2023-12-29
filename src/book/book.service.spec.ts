import { Test, TestingModule } from "@nestjs/testing"
import { BookService } from "./book.service"
import { getModelToken } from '@nestjs/mongoose';
import { Book } from "./schemas/book.schema";
import mongoose, { Model } from "mongoose";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { User } from "../auth/schemas/user.schema";
import { Category } from "../shared/enums/category.enum";
 
describe('BookService', () => {
    let bookService:  BookService;
    let model: Model<Book>

    const mockBook = { // dato para simular la prueba
        _id: '61c0ccf11d7bf83d153d7c06',
        title: 'New Book',
        description: 'Book descrption',
        author: 'Author',
        price: 100,
        category: Category.ADVENTURE,
        user: '61c0ccf11d7bf83d153d7c06',
    }

    const mockUser = {
        _id: '61c0ccf11d7bf83d153d7c06',
        name: 'luis',
        email: "luis@gmail.com"
    }

    const mockBookservice = {
        find: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(), // para simular los casos de prueba sin usar datos reales
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn()
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookService, // para probar la inyeccion de la libreria de mongo
                { 
                    provide: getModelToken(Book.name),
                    useValue: mockBookservice
                } 
            ]
        }).compile()

        bookService = module.get<BookService>(BookService);
        model = module.get<Model<Book>>(getModelToken(Book.name))
    });

   /* =========== Aqui se escriben las pruebas de cada funcion de tu service =========== */

    describe('create', () => {
        it('should create and return a book', async () => {
            const newBook = { // dato para simular la prueba
                title: 'New Book',
                description: 'Book descrption',
                author: 'Author',
                price: 100,
                category: Category.FANTASY
            }

            jest
                .spyOn(model, 'create')
                .mockImplementationOnce(() => Promise.resolve(mockBook as any));

            const result = await bookService.create(
                newBook as CreateBookDto, 
                mockUser as User
            )

            expect(result).toEqual(mockBook)
        })
    });

    describe('updateById', () => {
        it('should update and return a book updated', async () => {
            const updatedBook = { ...mockBook, title: 'Update name' } // dato de simulacion de prueba
            const book = { title: 'Update name' };

            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedBook);

            const result = await bookService.updateById(mockBook._id, book as any);

            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, book , {
                new: true,
                runValidators: true
            });

            expect(result).toEqual(updatedBook);
        })
    });

    describe('findBooksFilterByKeyword', () => {
        it('should return an array of books', async () => {
            const query = { page: '1', keyword: 'test' };

            jest.spyOn(model, 'find').mockImplementation(
                () => ({
                    limit: () => ({
                        skip: jest.fn().mockResolvedValue([mockBook]),
                    }),
                } as any)
            );

            const result = await bookService.findBooksFilterByKeyword(query);

            expect(model.find).toHaveBeenCalledWith({
                title: { $regex: 'test', $options: 'i' }
            })

            expect(result).toEqual({ filter: [mockBook]})
        })
    })

    describe('findById', () => { // debe ser el nombre exacto de la funcion que se va a probar: findById
        it('should find and return a book by ID', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockBook);

            const result = await bookService.findById(mockBook._id)

            expect(model.findById).toHaveBeenCalledWith(mockBook._id);
            expect(result).toEqual(mockBook);
        });

        it('should throw BadRequestException if invalid ID is provided', async () => {
            const id = 'invalid-id';

            const isValidObjectIdMock = jest
                .spyOn(mongoose, 'isValidObjectId')
                .mockReturnValue(false);

            await expect(bookService.findById(id)).rejects.toThrow(
                BadRequestException
            );

            expect(isValidObjectIdMock).toHaveBeenCalledWith(id);
            isValidObjectIdMock.mockRestore();
        });

        it('should throw NotFoundException if book is not found', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(null);

            await expect(bookService.findById(mockBook._id)).rejects.toThrow(
               NotFoundException
            );

            expect(model.findById).toHaveBeenCalledWith(mockBook._id);
        });
    });

    describe('deleteById', () => {
        it('should delete and return a json { deleted: true }', async () => {
        
            jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue({ deleted: true });

            const result = await bookService.deleteById(mockBook._id);

            expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id)

            expect(result).toEqual({ deleted: true });
        })
    })
})