import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CartPageComponent } from './cart-page.component';

describe('CartPageComponent', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CartPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the cart page', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should render the empty bag message when there are no items', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Empty bag');
  });
});
