import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";


describe('AuthController', () => {
    let authService:  AuthService;
    let authController: AuthController;

    const mockUser = { // datos de simulacion
        _id: '61c0ccf11d7bf83d153d7c06',
        name: 'luis',
        email: "luis@gmail.com"
    }

    let jwtToken = 'jwtToken' // datos de simulacion

    const mockAuthService = {
        signUp: jest.fn().mockResolvedValueOnce(jwtToken),
        signIn:jest.fn().mockResolvedValueOnce(jwtToken),

    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            //  imports: [JwtModule], para usar los guards de jwt
            controllers: [AuthController],
            providers: [
               {
                provide: AuthService,
                useValue: mockAuthService
               }
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
        authController = module.get<AuthController>(AuthController)
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('signUp', () => {
        it('should register a new user', async () => {
            const signUpDto = {
                name: 'Luis Fernando',
                email: 'luis@gmail.com',
                password: '123456'
            };

            const result = await authController.signUp(signUpDto);
            expect(authService.signUp).toHaveBeenCalled();
            expect(result).toEqual(jwtToken);
        })
    });

    describe('signIn', () => {
        it('should sign-in user', async () => {
            const signInDto = {
                email: 'luis@gmail.com',
                password: '123456'
            };

            const result = await authController.signIn(signInDto)
            expect(authService.signIn).toHaveBeenCalled();
            expect(result).toEqual(jwtToken);
        })
    });

})