import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProductRatingComponent } from './catalog-product-rating.component';

describe('CatalogProductRatingComponent', () => {
  let component: CatalogProductRatingComponent;
  let fixture: ComponentFixture<CatalogProductRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogProductRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogProductRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
