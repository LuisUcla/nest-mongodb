import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
        const userIs = await this.userModel.findOne({email});

        if (userIs) {
            throw new ConflictException('User already exists...')
        }

        const hashedPassword = await bcrypt.hash(password, 10); // encrpto la contrasenna

        const user = await this.userModel.create({ // creo el object usuario en la db
            name,
            email,
            password: hashedPassword
        })

        const token = this.jwtService.sign({ id: user._id }); // se firma el token con el id del usuario

        return { token };
    }

    async signIn(signInDto: SignInDto): Promise<{ token: string }> {
        const { email, password } = signInDto;
        const user = await this.userModel.findOne({email});

        if (!user) {
            throw new UnauthorizedException('Invalid email...');
        }

        const isPasswordMatched = await bcrypt.compare( password, user.password );

        if (!isPasswordMatched) {
            throw new UnauthorizedException('Password is wrong...');
        }

        const token = this.jwtService.sign({ id: user._id }); // se firma el token con el id del usuario

        return { token } ;
    }
}
