import { inject, Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpContextToken, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Authentication, AUTHENTICATION } from './authentication';

/**
 * @deprecated will be removed
 */
export const AUTHENTICATED_REQUEST = new HttpContextToken<boolean>(() => false);

@Injectable()
export class AuthenticationTokenInterceptor implements HttpInterceptor {
    constructor(@Inject(AUTHENTICATION) private auththenticationService: Authentication) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({ setHeaders: { Authorization: `Bearer ${this.auththenticationService.getSnapshot().token}` } });
        return next.handle(request);
    }
}

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const snapshot = inject<Authentication>(AUTHENTICATION).getSnapshot();
    if (snapshot.authenticated === true) {
        const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${snapshot.token}` } });
        return next(newReq);
    }

    return next(req);
}
