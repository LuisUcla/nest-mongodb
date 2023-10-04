import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BookController {
    constructor(private bookService: BookService) {}

    @Post()
    async createBook(@Body() book: CreateBookDto): Promise<Book> {
        return this.bookService.createBook(book)
    }

    @Get()
    async getAllBooks() {
        return this.bookService.findAll()
    }

    @Get(':id') 
    async getBook(@Param('id') id: string) {
        return this.bookService.findById(id)
    }

    @Put(':id') 
    async updateBook(@Param('id') id: string, @Body() book: UpdateBookDto) {
        return this.bookService.updateById(id, book)
    }

    @Delete(':id') 
    async deteleBook(@Param('id') id: string) {
        return this.bookService.deleteById(id);
    }
}
