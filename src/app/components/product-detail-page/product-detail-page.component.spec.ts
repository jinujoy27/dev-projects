import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProductDetailPageComponent } from './product-detail-page.component';

describe('ProductDetailPageComponent', () => {
  beforeEach(async () => {
    localStorage.clear();

    const routeStub = {
      snapshot: { paramMap: convertToParamMap({ slug: 'meridian-trench' }) },
      paramMap: of(convertToParamMap({ slug: 'meridian-trench' })),
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetailPageComponent],
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: routeStub }],
    }).compileComponents();
  });

  it('should create the product detail page', () => {
    const fixture = TestBed.createComponent(ProductDetailPageComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should render the selected product name', () => {
    const fixture = TestBed.createComponent(ProductDetailPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Meridian Trench');
  });
});
