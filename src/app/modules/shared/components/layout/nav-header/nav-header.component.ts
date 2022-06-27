import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/api/cart.service';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss'],
})
export class NavHeaderComponent implements OnInit {
  mainMenuToggle = false;
  userMenuToggle = false;
  submenuSelection: any;
  paddingvalue: any;
  currentUser;
  mName: any;
  submenuItem;
  selectedSubMenuItem;

  cartData = [];
  cartTotal = 0;

  @Input() menuHidden = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private helperService: HelperService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.helperService.getUserLogoutStatus().subscribe((res) => {
      this.getCurrentUser();
      if(res) this.getCartData();
    });
    this.helperService.getCartDataStatus().subscribe(() => {
      this.getCartData();
    });
  }

  toggleMenu(link) {
    this.submenuItem = this.submenuSelection.find((e) => e.path === link);

    this.mainMenuToggle = false;
    this.paddingvalue = null;
    this.helperService.setTopmenuStatus(false);
    this.router.navigateByUrl(link);
  }

  toggleUserMenu() {
    this.userMenuToggle = !this.userMenuToggle;
  }

  logoutUser() {
    this.authService.logout();
  }

  selectedvalue(value: any) {
    if (this.submenuSelection) {
      this.submenuSelection = null;
    }

    if (value?.length > 0) {
      if (this.paddingvalue && this.paddingvalue === value[0].paddingvalue) {
        this.paddingvalue = null;
        this.helperService.setTopmenuStatus(false);
      } else {
        this.paddingvalue = value[0].paddingvalue;
        this.mainMenuToggle = true;
        this.helperService.setTopmenuStatus(true);
      }
    } else {
      this.paddingvalue = null;
      this.helperService.setTopmenuStatus(false);
    }
    this.submenuSelection = value;
  }

  menuname(value: any) {
    this.mName = value;
  }

  getCurrentUser() {
    this.currentUser = this.authService.getLoginData();
  }

  getCartData() {
    this.cartService.getData({user: this.currentUser?._id}).subscribe(
      (response) => {
        this.cartData = response.data;
        this.cartTotal = response.total;

        console.log(this.cartTotal);
      },
      (error) => {
        console.log(error);
        this.cartTotal = 0;
      }
    );
  }
}
