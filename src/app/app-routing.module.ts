import { Inject, NgModule, inject } from '@angular/core';
import { RedirectCommand, Router, RouterModule, Routes } from '@angular/router';
import { AuthenticationService, authenticationRoutes, requireAuthentication } from '@muziehdesign/angularcore';
import { cartRoutes } from './cart/cart.routes';
import { checkoutLazyLoadingRoutes } from './checkout/checkout-routing.module';
import { orderLazyLoadingRoutes } from './order/order-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginCallbackComponent } from './login-callback/login-callback.component';

const routes: Routes = [
    { path: '', redirectTo: '/items', pathMatch: 'full' },
    { path: 'logout', redirectTo: '/', pathMatch: 'full' },
    ...authenticationRoutes,
    ...orderLazyLoadingRoutes,
    ...checkoutLazyLoadingRoutes,
    { path: 'items', loadChildren: () => import('./item/item.routes').then((x) => x.itemRoutes) },
    ...cartRoutes,
    { path: 'profile', component: ProfileComponent, canActivate: [requireAuthentication] }, // TODO
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
