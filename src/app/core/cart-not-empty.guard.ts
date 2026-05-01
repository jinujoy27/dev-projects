import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { CartService } from './cart.service';

export const cartNotEmptyGuard: CanActivateFn = () => {
  const cartService = inject(CartService);
  const router = inject(Router);

  return cartService.itemCount() > 0 ? true : router.createUrlTree(['/cart']);
};
