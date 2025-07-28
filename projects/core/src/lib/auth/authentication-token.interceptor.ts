import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpContextToken } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export const AUTHENTICATED_REQUEST = new HttpContextToken<boolean>(() => false);


@Injectable()
export class AuthenticationTokenInterceptor implements HttpInterceptor {
    constructor(private auththenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const snapshot = this.auththenticationService.getSnapshot();
        console.log('[AuthenticationTokenInterceptor]intercept', snapshot);
        if(snapshot.authenticated) {
            request = request.clone({ setHeaders: { Authorization: `Bearer ${snapshot.token}` } });
        }
        return next.handle(request);
    }
}
