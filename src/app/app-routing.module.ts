import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticationRoutes, AuthorizationGuard } from '@muziehdesign/angularcore';
import { cartRoutes } from './cart/cart.routes';
import { checkoutLazyLoadingRoutes } from './checkout/checkout-routing.module';
import { orderLazyLoadingRoutes } from './order/order-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
    { path: '', redirectTo: '/about', pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    { path: 'logout', redirectTo: '/', pathMatch: 'full' },
    ...authenticationRoutes,
    ...orderLazyLoadingRoutes,
    ...checkoutLazyLoadingRoutes,
    { path: 'items', loadChildren: () => import('./item/item.routes').then((x) => x.itemRoutes) },
    ...cartRoutes,
    { path: 'profile', component: ProfileComponent, canActivate: [AuthorizationGuard] }, // TODO
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
