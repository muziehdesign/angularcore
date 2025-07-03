import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ItemFacade } from '../item.facade';
import { ItemDetailComponent } from './item-detail.component';

describe('ItemDetailComponent', () => {
  let component: ItemDetailComponent;
  let fixture: ComponentFixture<ItemDetailComponent>;
  const sku = 'ITEMSKU-12';

  beforeEach(async () => {
      const itemFacade = jasmine.createSpyObj<ItemFacade>(ItemFacade.name, { getItem: of(), getItems: of() });

      await TestBed.configureTestingModule({
          imports: [ItemDetailComponent],
          providers: [
              { provide: ActivatedRoute, useValue: { snapshot: { params: sku } } },
              { provide: ItemFacade, useValue: itemFacade }
          ],
      }).compileComponents();

      fixture = TestBed.createComponent(ItemDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
      expect(component).toBeTruthy();
  });
});