import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalProductsService } from 'src/app/core/services/api/localProducts.service';
import { MartProductsService } from 'src/app/core/services/api/martProducts.service';

@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.component.html',
  styleUrls: ['./catalog-detail.component.scss']
})
export class CatalogDetailComponent implements OnInit {

  shopType;
  productId;
  productData;
  productLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private martProductsService: MartProductsService,
    private localProductsService: LocalProductsService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.productId = params['productId'];
    });
    this.activatedRoute.data.subscribe((data) => {
      this.shopType = data['shopType'];
    });
  }

  ngOnInit(): void {
    if(this.shopType === 'mart') {
      this.getProductData();
    } else {
      this.getLocalProductData();
    }
  }

  getProductData() {
    this.productLoading = true;

    this.martProductsService.getById(this.productId).subscribe(
      (response) => {
        this.productData = response.data;
        this.productLoading = false;
      },
      (error) => {
        console.log("error", error);
        this.productLoading = false;
      }
    );
  }

  getLocalProductData() {
    this.productLoading = true;

    this.localProductsService.getById(this.productId).subscribe(
      (response) => {
        this.productData = response.data;
        this.productLoading = false;
      },
      (error) => {
        console.log("error", error);
        this.productLoading = false;
      }
    );
  }
}
