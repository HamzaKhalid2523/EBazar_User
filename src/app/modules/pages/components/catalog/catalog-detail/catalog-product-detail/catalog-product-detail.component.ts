import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/api/cart.service';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';

@Component({
  selector: 'app-catalog-product-detail',
  templateUrl: './catalog-product-detail.component.html',
  styleUrls: ['./catalog-product-detail.component.scss']
})
export class CatalogProductDetailComponent implements OnInit {

  @Input() shopType;
  @Input() productData;
  @Input() productLoading = false;

  cartLoading = false;
  quantity = 1;
  currentUser;

  constructor(
    private authService: AuthService,
    private router: Router,
    private helperService: HelperService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getLoginData();
  }

  addToCart() {
    if(!this.currentUser) this.router.navigateByUrl('login');
    this.cartLoading = true;

    const data = {
      quantity: this.quantity,
      user: this.currentUser?._id,
      seller: this.productData?.seller?._id,
      product: {productType: this.shopType},
      shop: {shopType: this.shopType}
    };

    if(this.shopType === 'local') {
      data['product']['localProduct'] = this.productData?._id;
      data['shop']['localShop'] = this.productData?.shop?._id;
    }
    else {
      data['product']['martProduct'] = this.productData?._id;
      data['shop']['martShop'] = this.productData?.shop?._id;
    }

    this.cartService.createData(data).subscribe(
      (response) => {
        this.cartLoading = false;
        this.helperService.showToast("Added Successfully");

        this.helperService.setCartDataStatus();
      },
      (error) => {
        const errorMsg =
          error?.error.Error ||
          error?.detail?._message ||
          error?.error?.message ||
          error?.error?.errmsg ||
          "Something Went Wrong. Server Error!!";
        console.log("error", error, errorMsg);
        0;

        this.helperService.showToast(errorMsg, "error");
        this.cartLoading = false;
      }
    );
  }

  buyNow() {
    if(!this.currentUser) this.router.navigateByUrl('login');
  }

  decrementQuantity() {
    if(this.quantity > 1) --this.quantity;
  }

  incrementQuantity() {
    if(this.quantity < 100) ++this.quantity;
  }

}
