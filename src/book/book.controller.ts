import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { Query as ExpressQuery } from 'express-serve-static-core'
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserActiveInterface } from '../shared/interfaces/user-active.interface';
import { ActiveUser } from '../shared/decorators/active-user.decorator';

@UseGuards(AuthGuard) // para autenticar con uso de jwt
@Controller('books')
export class BookController {
    constructor(private bookService: BookService) {}

    @Post()
    async createBook(@Body() book: CreateBookDto, @ActiveUser() user: UserActiveInterface): Promise<Book> {
        return this.bookService.create(book, user)
    }

    @Get()
    async getAllBooks(): Promise <Book[]> {
        return this.bookService.findAll()
    }

    @Get('filter')
    async getBooksFilterByKeyword(@Query() query: ExpressQuery) {
        return this.bookService.findBooksFilterByKeyword(query)
    }

    @Get(':id')
    async getBook(@Param('id') id: string): Promise<Book> {
        return this.bookService.findById(id)
    }

    @Put(':id') 
    async updateBook(@Param('id') id: string, @Body() book: UpdateBookDto): Promise<Book> {
        return this.bookService.updateById(id, book)
    }

    @Delete(':id') 
    async deteleBook(@Param('id') id: string): Promise<{ deleted: boolean }> {
        return this.bookService.deleteById(id);
    }
}
