import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { CartService } from 'src/app/core/services/api/cart.service';
import { UsersService } from 'src/app/core/services/api/users.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shipping-confirmation',
  templateUrl: './shipping-confirmation.component.html',
  styleUrls: ['./shipping-confirmation.component.scss']
})
export class ShippingConfirmationComponent implements OnInit {

  cartSelection: any = [];

  loading = false;
  cartData = [];
  cartTotal = 0;
  currentUser;

  itemsTotal = 0;
  shippingTotal = 0;
  subTotal = 0;

  addressModalVisible = false;
  modalData;
  formType;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private usersService: UsersService,
    private helperService: HelperService,
    private location: Location
  ) {
    this.cartSelection = JSON.parse(localStorage.getItem('selectedItems'));
    console.log(this.cartSelection);
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getCartData();
  }

  getCurrentUser() {
    this.currentUser = this.authService.getLoginData();
  }

  getCartData() {
    this.loading = true;
    this.cartService.getData(this.getCartFilters()).subscribe(
      (response) => {
        this.cartData = response.data;
        this.cartTotal = response.total;

        this.cartData.forEach((item, index) => {
          item['product']['product'] = item['product']?.martProduct || item['product']?.localProduct;
          item['shop']['shop'] = item['shop']?.martShop || item['shop']?.localShop;
          item['selectedQuantity'] = this.cartSelection[index]?.quantity || 1;

          this.itemsTotal += item?.product?.product?.price * item?.selectedQuantity;
          this.shippingTotal += item?.product?.product?.deliveryPrice * item?.selectedQuantity;
        });
        this.subTotal = this.itemsTotal + this.shippingTotal;

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

  getCartFilters() {
    const filters = [{key: 'user', value: this.currentUser?._id, operator: 'equals'}];
    const ids  = [];

    this.cartSelection.forEach((item) => ids.push(item?.id));
    filters.push({key: '_id', value: ids, operator: 'like'});

    const response = { filters: filters };

    return response;
  }

  showCreateModal() {
    this.modalData = null;
    this.formType = "Create";
    this.addressModalVisible = true;
  }
  showEditModal(data) {
    this.modalData = data;
    this.formType = "Update";
    this.addressModalVisible = true;
  }

  getUser() {
    this.addressModalVisible = false;
    this.usersService.getData({_id: this.currentUser?._id}).subscribe(
      (response) => {
        localStorage.setItem('ebazar_login_data', JSON.stringify(response.data[0]));
        this.currentUser = this.authService.getLoginData();
      },
      (error) => {
        console.log(error);
        this.cartTotal = 0;
        this.loading = false;
      }
    );
  }

  checkout() {
    this.router.navigateByUrl('payment-methods');
  }
}
