import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const ActiveUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user
})
/* 
    este es un decorador personalizado para ser usado en todas las peticiones
    el cual se encarga de capturar las request que traigan los datos del usuario
*/