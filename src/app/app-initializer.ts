import { AuthenticationService, AuthorizationData, AuthorizationService, Logger } from '@muziehdesign/angularcore';
import { delay, firstValueFrom, map, tap } from 'rxjs';
import { ShoppingCartClient } from './api/shopping-cart/shopping-cart.client';

export const initializeApplication = (logger: Logger): (() => Promise<void>) => {
    return (): Promise<void> => {
        /*authenticationService.onUserSignedOut().pipe(tap((x) => authorizationService.reset()));
        authenticationService.onUserSignedIn().pipe(    
            delay(1000),  //this is to prevent the authorization api call from firing before authentication user is done being set      
            switchMap((x) => client.getAuthorization()),
            tap((x) => {
                const map = new Map<string, AuthorizationData>();
                map.set(ShoppingCartClient.name, x as AuthorizationData);
            })
        ).subscribe();

        return authenticationService.initialize();*/
        return Promise.resolve();
    };
};

export const initializeAuthorization = (authentication: AuthenticationService, authorization: AuthorizationService, client: ShoppingCartClient): (() => Promise<boolean>) => {
    return async (): Promise<boolean> => {
        await authentication.loadUser();
        console.log('initialize authorization, snapshot: ', authentication.getSnapshot());
        
        return true;

        /*
        return firstValueFrom(
            client.getAuthorization().pipe(
                tap((x) => authorization.register('ShoppingCartClient', x as AuthorizationData)),
                map((x) => true)
            )
        );*/
    };
};
