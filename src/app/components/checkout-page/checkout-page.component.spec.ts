import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckoutPageComponent } from './checkout-page.component';

describe('CheckoutPageComponent', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the checkout page', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should render the empty checkout state when the cart is empty', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('No items to checkout');
  });
});
