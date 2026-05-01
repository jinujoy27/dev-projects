import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ConfirmationPageComponent } from './confirmation-page.component';

describe('ConfirmationPageComponent', () => {
  beforeEach(async () => {
    localStorage.clear();

    const routeStub = {
      snapshot: { paramMap: convertToParamMap({ orderId: 'missing-order' }) },
      paramMap: of(convertToParamMap({ orderId: 'missing-order' })),
    };

    await TestBed.configureTestingModule({
      imports: [ConfirmationPageComponent],
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: routeStub }],
    }).compileComponents();
  });

  it('should create the confirmation page', () => {
    const fixture = TestBed.createComponent(ConfirmationPageComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should render the missing order state when no order is found', () => {
    const fixture = TestBed.createComponent(ConfirmationPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Order unavailable');
  });
});
