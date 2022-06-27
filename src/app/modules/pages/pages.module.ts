import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from '../pages/pages.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddAdminComponent } from './components/admin/add-admin/add-admin.component';
import { OriginalShopsComponent } from './components/original-shops/original-shops.component';
import { AddOriginalShopComponent } from './components/original-shops/add-original-shop/add-original-shop.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { ProductCategoriesComponent } from './components/products/product-form/product-categories/product-categories.component';
import { HomeComponent } from './components/home/home.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { HomeMartComponent } from './components/home/home-mart/home-mart.component';
import { HomeCategoriesComponent } from './components/home/home-categories/home-categories.component';
import { HomeProductsComponent } from './components/home/home-products/home-products.component';
import { CatalogDetailComponent } from './components/catalog/catalog-detail/catalog-detail.component';
import { CatalogProductDetailComponent } from './components/catalog/catalog-detail/catalog-product-detail/catalog-product-detail.component';
import { CatalogProductRatingComponent } from './components/catalog/catalog-detail/catalog-product-rating/catalog-product-rating.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { ShippingConfirmationComponent } from './components/shipping/shipping-confirmation/shipping-confirmation.component';
import { AddAddressComponent } from './components/shipping/add-address/add-address.component';
import { PaymentCardsComponent } from './components/shipping/payment-cards/payment-cards.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderRatingComponent } from './components/orders/order-rating/order-rating.component';

const components = [
  PagesComponent, DashboardComponent, AdminComponent, AddAdminComponent, OriginalShopsComponent, AddOriginalShopComponent,
  ProductsComponent,ProductFormComponent, ProductCategoriesComponent, HomeComponent, CatalogComponent, CatalogDetailComponent,
  HomeMartComponent, HomeCategoriesComponent, HomeProductsComponent, CatalogProductDetailComponent, CatalogProductRatingComponent,
  RegisterComponent, LoginComponent, CartComponent, OrdersComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
  ],
  declarations: [...components, ShippingConfirmationComponent, AddAddressComponent, PaymentCardsComponent, OrderRatingComponent],
  providers: []
})
export class PagesModule { }
