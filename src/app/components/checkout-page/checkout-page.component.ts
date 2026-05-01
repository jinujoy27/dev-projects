import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CartService } from '../../core/cart.service';
import { CURRENCY_CODE, DELIVERY_OPTIONS } from '../../core/products.data';
import { OrderService } from '../../core/order.service';
import { CheckoutPayload } from '../../core/storefront.models';

@Component({
  selector: 'app-checkout-page',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);

  protected readonly cartService = inject(CartService);
  protected readonly currencyCode = CURRENCY_CODE;
  protected readonly deliveryOptions = DELIVERY_OPTIONS;
  protected readonly steps = [
    { number: 1, label: 'Contact', caption: 'Email and shipping details' },
    { number: 2, label: 'Payment', caption: 'Delivery method and card' },
    { number: 3, label: 'Review', caption: 'Confirm and place order' },
  ];
  protected readonly currentStep = signal(1);
  protected readonly isSubmitting = signal(false);
  protected readonly checkoutForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+() -]{8,20}$/)]],
    address: ['', [Validators.required, Validators.minLength(4)]],
    apartment: [''],
    city: ['', [Validators.required, Validators.minLength(2)]],
    state: ['', [Validators.required, Validators.minLength(2)]],
    postcode: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z -]{3,10}$/)]],
    country: ['Australia', [Validators.required]],
    delivery: [DELIVERY_OPTIONS[0].id, [Validators.required]],
    cardholder: ['', [Validators.required, Validators.minLength(2)]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^(\d{4} ?){3}\d{4}$/)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    notes: [''],
  });
  protected readonly selectedDeliveryId = toSignal(this.checkoutForm.controls.delivery.valueChanges, {
    initialValue: this.checkoutForm.controls.delivery.value,
  });
  protected readonly selectedDelivery = computed(
    () => DELIVERY_OPTIONS.find((option) => option.id === this.selectedDeliveryId()) ?? DELIVERY_OPTIONS[0],
  );
  protected readonly tax = computed(() => Math.round(Math.max(0, this.cartService.subtotal() - this.cartService.discount()) * 0.1));
  protected readonly total = computed(
    () => Math.max(0, this.cartService.subtotal() - this.cartService.discount()) + this.tax() + this.selectedDelivery().price,
  );
  protected readonly cardLastFour = computed(() =>
    this.checkoutForm.controls.cardNumber.value.replace(/\D/g, '').slice(-4) || '0000',
  );

  private readonly contactFields = [
    'email',
    'firstName',
    'lastName',
    'phone',
    'address',
    'city',
    'state',
    'postcode',
    'country',
  ] as const;
  private readonly paymentFields = ['delivery', 'cardholder', 'cardNumber', 'expiry', 'cvc'] as const;

  protected goToStep(step: number): void {
    if (step <= this.currentStep()) {
      this.currentStep.set(step);
      return;
    }

    if (step === 2 && this.validateControls(this.contactFields)) {
      this.currentStep.set(2);
    }

    if (step === 3 && this.validateControls(this.contactFields) && this.validateControls(this.paymentFields)) {
      this.currentStep.set(3);
    }
  }

  protected advanceToPayment(): void {
    if (this.validateControls(this.contactFields)) {
      this.currentStep.set(2);
    }
  }

  protected advanceToReview(): void {
    if (this.validateControls(this.paymentFields)) {
      this.currentStep.set(3);
    }
  }

  protected showError(controlName: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  protected formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? digits;

    this.checkoutForm.controls.cardNumber.setValue(formatted, { emitEvent: false });
    input.value = formatted;
  }

  protected formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;

    this.checkoutForm.controls.expiry.setValue(formatted, { emitEvent: false });
    input.value = formatted;
  }

  protected formatCvc(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 4);

    this.checkoutForm.controls.cvc.setValue(digits, { emitEvent: false });
    input.value = digits;
  }

  protected async placeOrder(): Promise<void> {
    const allRequiredFields = [...this.contactFields, ...this.paymentFields];

    if (!this.validateControls(allRequiredFields)) {
      this.currentStep.set(2);
      return;
    }

    const cartSnapshot = this.cartService.getCartSnapshot();

    if (!cartSnapshot.items.length) {
      await this.router.navigate(['/cart']);
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formValue = this.checkoutForm.getRawValue();
      const checkoutPayload: CheckoutPayload = {
        customer: {
          email: formValue.email,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          phone: formValue.phone,
          address: formValue.address,
          apartment: formValue.apartment,
          city: formValue.city,
          state: formValue.state,
          postcode: formValue.postcode,
          country: formValue.country,
        },
        delivery: this.selectedDelivery(),
        payment: {
          cardholder: formValue.cardholder,
          cardNumber: formValue.cardNumber,
          expiry: formValue.expiry,
          cvc: formValue.cvc,
        },
        notes: formValue.notes,
      };

      const order = await firstValueFrom(
        this.orderService.placeOrder(checkoutPayload, cartSnapshot, this.tax(), this.total()),
      );

      const navigated = await this.router.navigate(['/confirmation', order.id]);

      if (navigated) {
        this.cartService.clearCart();
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private validateControls(controlNames: readonly string[]): boolean {
    let isValid = true;

    for (const controlName of controlNames) {
      const control = this.checkoutForm.get(controlName);
      control?.markAsTouched();

      if (!control || control.invalid) {
        isValid = false;
      }
    }

    return isValid;
  }
}
