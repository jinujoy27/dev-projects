import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { CartService } from '../../core/cart.service';
import { STORE_NAME, SUPPORT_EMAIL } from '../../core/products.data';
import { printGrid } from '../../grid-printer';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  protected readonly cartService = inject(CartService);
  protected readonly storeName = STORE_NAME;
  protected readonly supportEmail = SUPPORT_EMAIL;

  async testPrintGrid() {
    await printGrid('http://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub');
  }
}
