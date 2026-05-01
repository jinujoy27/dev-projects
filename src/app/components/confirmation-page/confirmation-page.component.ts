import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CURRENCY_CODE } from '../../core/products.data';
import { OrderService } from '../../core/order.service';
import { OrderRecord } from '../../core/storefront.models';

@Component({
  selector: 'app-confirmation-page',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './confirmation-page.component.html',
  styleUrl: './confirmation-page.component.scss',
})
export class ConfirmationPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  protected readonly currencyCode = CURRENCY_CODE;
  protected readonly order = signal<OrderRecord | null>(this.orderService.getOrderById(this.route.snapshot.paramMap.get('orderId')));

  constructor() {
    this.route.paramMap.subscribe((paramMap) => {
      this.order.set(this.orderService.getOrderById(paramMap.get('orderId')));
    });
  }
}
