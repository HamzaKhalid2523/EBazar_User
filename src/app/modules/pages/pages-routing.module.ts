import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { isLoginGuard } from 'src/app/core/guards/islogin.guard';
import { AdminComponent } from './components/admin/admin.component';
import { OriginalShopsComponent } from './components/original-shops/original-shops.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { HomeComponent } from './components/home/home.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { CatalogDetailComponent } from './components/catalog/catalog-detail/catalog-detail.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { ShippingConfirmationComponent } from './components/shipping/shipping-confirmation/shipping-confirmation.component';
import { PaymentCardsComponent } from './components/shipping/payment-cards/payment-cards.component';
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
        },
      },
      {
        path: 'mart-catalog',
        component: CatalogComponent,
        data: {
          shopType: 'mart'
        },
      },
      {
        path: 'mart-catalog-detail/:productId',
        component: CatalogDetailComponent,
        data: {
          shopType: 'mart'
        },
      },
      {
        path: 'catalog',
        component: CatalogComponent,
        data: {
          shopType: 'local'
        },
      },
      {
        path: 'catalog-detail/:productId',
        component: CatalogDetailComponent,
        data: {
          shopType: 'local'
        },
      },
      {
        path: 'cart',
        component: CartComponent,
        data: {
        },
      },
      {
        path: 'shipping-confirmation',
        component: ShippingConfirmationComponent,
        data: {
        },
      },
      {
        path: 'payment-methods',
        component: PaymentCardsComponent,
        data: {
        },
      },
      {
        path: 'orders',
        component: OrdersComponent,
        data: {
        },
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: {
        },
      },
      {
        path: 'login',
        component: LoginComponent,
        data: {
        },
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
