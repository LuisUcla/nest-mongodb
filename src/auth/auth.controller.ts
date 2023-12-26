import { Body, Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
        return this.authService.signUp(signUpDto)
    }

    @Post('signin')
    signIn(@Body() signInDto: SignInDto): Promise<{ token: string }> {
        return this.authService.signIn(signInDto)
    }

    //@UseGuards(AuthGuard) // metodo de ejemplo de los guardas
    @Get('profile')
    profile(@Request() req) {
        return req.user
    }
}
