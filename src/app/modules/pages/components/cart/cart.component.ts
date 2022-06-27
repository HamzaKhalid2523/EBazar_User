import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/api/cart.service';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  loading = false;
  cartData = [];
  cartTotal = 0;
  currentUser;

  selectedItems = [];
  allItems = [];
  allStatus = false;

  itemsTotal = 0;
  shippingTotal = 0;
  subTotal = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getCartData();
  }

  getCurrentUser() {
    this.currentUser = this.authService.getLoginData();
  }

  getCartData() {
    this.loading = true;
    this.cartService.getData({user: this.currentUser?._id}).subscribe(
      (response) => {
        this.cartData = response.data;
        this.cartTotal = response.total;

        this.cartData.forEach((item) => {
          item['product']['product'] = item['product']?.martProduct || item['product']?.localProduct;
          item['shop']['shop'] = item['shop']?.martShop || item['shop']?.localShop;
          item['selectedQuantity'] = item?.quantity || 1;

          this.allItems.push(false);
        });

        console.log(this.cartData);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.cartTotal = 0;
        this.loading = false;
      }
    );
  }

  decrementQuantity(index) {
    if(this.cartData[index]['selectedQuantity'] > 1) --this.cartData[index]['selectedQuantity'];
  }

  incrementQuantity(index) {
    if(this.cartData[index]['selectedQuantity'] < 100) ++this.cartData[index]['selectedQuantity'];
  }

  selecSingle(status, index) {
    this.allItems[index] = status;

    if(status) {
      this.selectedItems.push({
        id: this.cartData[index]?._id,
        quantity: this.cartData[index]?.selectedQuantity
      });
      this.itemsTotal += this.cartData[index]?.product?.product?.price * this.cartData[index]?.selectedQuantity;
      this.shippingTotal += this.cartData[index]?.product?.product?.deliveryPrice * this.cartData[index]?.selectedQuantity;
      this.subTotal = this.itemsTotal + this.shippingTotal;

      if(this.selectedItems.length === this.allItems.length) this.allStatus = true;
    } else {
      let id = this.cartData[index]?._id;
      let i = 0;
      this.selectedItems.forEach((item, innerIndex) => {
        if(id === item?.id) {
          i = innerIndex;
          return;
        }
      });
      this.selectedItems.splice(i, 1);
      if(!this.selectedItems.length) this.allStatus = false;

      this.itemsTotal -= this.cartData[index]?.product?.product?.price * this.cartData[index]?.selectedQuantity;
      this.shippingTotal -= this.cartData[index]?.product?.product?.deliveryPrice * this.cartData[index]?.selectedQuantity;
      this.subTotal = this.itemsTotal + this.shippingTotal;
    }
  }

  selectAll(status) {
    this.itemsTotal = 0;
    this.shippingTotal = 0;
    this.subTotal = 0;

    this.allItems = [];
    this.selectedItems = [];

    if(status) {
      this.cartData.forEach((item) => {
        this.allItems.push(true);
        this.selectedItems.push({
          id: item?._id,
          quantity: item?.selectedQuantity
        });

        this.itemsTotal += item?.product?.product?.price * item?.selectedQuantity;
        this.shippingTotal += item?.product?.product?.deliveryPrice * item?.selectedQuantity;
      });
      this.subTotal = this.itemsTotal + this.shippingTotal;
    } else {
      this.cartData.forEach(() => {
        this.allItems.push(false);
      });
    }
  }

  deleteManyRecords() {
    if(this.selectedItems.length) {
      this.loading = true;

      const data = [];
      this.selectedItems.forEach((item) => {
        data.push(item?.id);
      });

      this.cartService.deleteMany({ids: data}).subscribe(
        (response) => {
          this.getCartData();
          this.helperService.setCartDataStatus();
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
    }
  }

  checkout() {
    localStorage.setItem('selectedItems', JSON.stringify(this.selectedItems));
    this.router.navigateByUrl('shipping-confirmation');
  }
}
