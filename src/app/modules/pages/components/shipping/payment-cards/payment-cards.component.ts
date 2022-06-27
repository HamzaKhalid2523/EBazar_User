import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { CartService } from 'src/app/core/services/api/cart.service';
import { UsersService } from 'src/app/core/services/api/users.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';
import { Router } from '@angular/router';

import  { NgForm } from "@angular/forms";
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
import { OrderService } from 'src/app/core/services/api/order.service';

@Component({
  selector: 'app-payment-cards',
  templateUrl: './payment-cards.component.html',
  styleUrls: ['./payment-cards.component.scss']
})
export class PaymentCardsComponent implements OnInit, AfterViewInit, OnDestroy {

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

  paymentHandler: any = null;
  success: boolean = false
  failure:boolean = false

  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;

  stripe;
  confirmation;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private usersService: UsersService,
    private orderService: OrderService,
    private helperService: HelperService,
    private location: Location,
    private cd: ChangeDetectorRef,
    private stripeService:AngularStripeService
  ) {
    this.cartSelection = JSON.parse(localStorage.getItem('selectedItems'));
    console.log(this.cartSelection);
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getCartData();
  }
  ngAfterViewInit() {
    this.stripeService.setPublishableKey('pk_test_51L2XybDvV0f5gkaHaxQnjtC31lwKB2zCNHW8mNqsEiG9R7yXLeKKiDJFPTWeFt8doLKCp8RRpouTEv9cZjhYeV4U00mw4W3L5F').then(
      stripe=> {
        this.stripe = stripe;
    const elements = stripe.elements();
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
    });
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    this.loading = true;
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form) {
    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Success!', token);
      this.createNewOrder(token);
    }
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

  createNewOrder(token) {
    const data = {
      items: this.cartSelection,
      token: token
    };

    this.orderService.createData(data).subscribe(
      (response) => {
        this.helperService.showToast('Order Craeted Successfully!', 'success', 10000, 'Seller will be notified shortly and will share the order status!');
        localStorage.removeItem('selectedItems');
        this.router.navigateByUrl('');
      },
      (error) => {
        console.log(error);
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
}
