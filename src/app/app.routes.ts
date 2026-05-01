import { Routes } from '@angular/router';

import { cartNotEmptyGuard } from './core/cart-not-empty.guard';
import { CartPageComponent } from './components/cart-page/cart-page.component';
import { CheckoutPageComponent } from './components/checkout-page/checkout-page.component';
import { ConfirmationPageComponent } from './components/confirmation-page/confirmation-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProductDetailPageComponent } from './components/product-detail-page/product-detail-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Atelier South | Elevated wardrobe essentials',
  },
  {
    path: 'product/:slug',
    component: ProductDetailPageComponent,
    title: 'Atelier South | Product detail',
  },
  {
    path: 'cart',
    component: CartPageComponent,
    title: 'Atelier South | Your bag',
  },
  {
    path: 'checkout',
    component: CheckoutPageComponent,
    canActivate: [cartNotEmptyGuard],
    title: 'Atelier South | Checkout',
  },
  {
    path: 'confirmation/:orderId',
    component: ConfirmationPageComponent,
    title: 'Atelier South | Order confirmation',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
