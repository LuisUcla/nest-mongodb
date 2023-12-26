import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {

        const { name, email, password } = signUpDto;

        const hashedPassword = await bcrypt.hash(password, 10); // encrpto la contrasenna

        try {
            const user = await this.userModel.create({ // creo el object usuario en la db
                name,
                email,
                password: hashedPassword
            })
    
            const token = this.jwtService.sign({ id: user._id }); // se firma el token con el id del usuario
    
            return { token };
        } catch (error) {
            if (error?.code === 11000) { // codigo de error de correo duplicado
                throw new ConflictException('Duplicate Email entered...');
            }
        }
    }

    async signIn(signInDto: SignInDto): Promise<{ token: string }> {
        const { email, password } = signInDto;
        const user = await this.userModel.findOne({email});

        if (!user) {
            throw new NotFoundException('Invalid email...');
        }

        const isPasswordMatched = await bcrypt.compare( password, user.password );

        if (!isPasswordMatched) {
            throw new UnauthorizedException('Password is wrong...');
        }

        const payload = { _id: user._id, username: user.name }

        const token = this.jwtService.sign(payload); // se firma el token con el id del usuario

        return { token } ;
    }

    async getUsers(): Promise<User[]> {
        const users = await this.userModel.find();
        return users;
    }

    async getUser(id: string): Promise<User> {

        const isValidId = mongoose.isValidObjectId(id);
        
        if (!isValidId) {
            throw new BadRequestException('Id is invalid, enter Id Correct...')
        }
        
        const user = await this.userModel.findById(id);
        
        if (!user) {
            throw new NotFoundException('User Not Found...')
        }

        return user;
    }

    async updateById(id: string, user: User): Promise<User> {

        const isValidId = mongoose.isValidObjectId(id);
        
        if (!isValidId) {
            throw new BadRequestException('Id is invalid, enter Id Correct...')
        }

        return await this.userModel.findByIdAndUpdate(id, user, {
            new: true,
            runValidators: true
        });
    }

    async deleteById(id: string): Promise<User> {

        const isValidId = mongoose.isValidObjectId(id);
        
        if (!isValidId) {
            throw new BadRequestException('Id is invalid, enter Id Correct...')
        }
        
        return await this.userModel.findByIdAndDelete(id);
    }
}
