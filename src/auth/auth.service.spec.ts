import { Test, TestingModule } from "@nestjs/testing"
import { getModelToken } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { AuthService } from "./auth.service";
import { User } from "./schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
 
describe('AuthService', () => {
    let authService:  AuthService;
    let model: Model<User>;
    let jwtService: JwtService

    const mockUser = {
        _id: '61c0ccf11d7bf83d153d7c06',
        name: 'luis',
        email: "luis@gmail.com"
    }

    let token = 'jwtToken'

    const mockAuthservice = {
        findOne: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService, // para probar la inyeccion de la libreria de mongo
                JwtService,
                { 
                    provide: getModelToken(User.name),
                    useValue: mockAuthservice
                } 
            ]
        }).compile()

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        model = module.get<Model<User>>(getModelToken(User.name))
    });

    // primera prueba
    it ('should be defined', () => {
        expect(authService).toBeDefined()
    })

    describe('signUp', () => {
        const signUpDto = {
            name: 'Luis Fernando',
            email: 'luis@gmail.com',
            password: '123456'
        }

        it ('should register the new user...', async () => {
            
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
            jest.spyOn(model, 'create').mockImplementation(() => Promise.resolve(mockUser as any));

            jest.spyOn(jwtService, 'sign').mockReturnValue(token);

            const result = await authService.signUp(signUpDto);

            expect(bcrypt.hash).toHaveBeenCalled();
            expect(result).toEqual({ token })
        });

        it ('should throw duplicate email entered...', async () => {
            
            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.reject({ code: 11000 }));


            await expect(authService.signUp(signUpDto)).rejects.toThrow(
                ConflictException
            );
        })
    });

    describe('signIn', () => {
        const loginDto = {
            email: 'luis@gmail.com',
            password: '123456'
        }

        it('should login user and return the token', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
            jest.spyOn(jwtService, 'sign').mockReturnValue(token)

            const result = await authService.signIn(loginDto);

            expect(result).toEqual({ token });
        });

        it('should throw invalid email error', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

            expect(authService.signIn(loginDto)).rejects.toThrow(
                NotFoundException
            )
        });

        it('should thorw invalid password error', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);


            expect(authService.signIn(loginDto)).rejects.toThrow(
                UnauthorizedException
            );
        });
    });

});