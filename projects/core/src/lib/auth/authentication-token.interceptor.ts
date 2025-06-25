import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpContextToken } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';

/**
 * @deprecated will be removed
 */
export const AUTHENTICATED_REQUEST = new HttpContextToken<boolean>(() => false);

@Injectable()
export class AuthenticationTokenInterceptor implements HttpInterceptor {
    constructor(private auththenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({ setHeaders: { Authorization: `Bearer ${this.auththenticationService.getSnapshot().token}` } });
        return next.handle(request);
    }
}
