import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';
import { ListingService } from 'src/app/core/services/helper/listings.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit, OnChanges {

  @Input() submenuItem;
  @Output() selection = new EventEmitter<string>();
  @Output() menuname = new EventEmitter<string>();

  selectedMenuTitle: any;
  selectedMenu = 'Dashboard';
  menu = [];
  generalMenu = [
    {
      path: '/products',
      title: 'Categories',
      icon: 'fas fa-chart-area',
      submenu: 'category'
    },
    {
      path: 'http://localhost:2002',
      title: 'Sell on Daraz',
      icon: 'fas fa-chart-area',
      sellPlatform: true
    },
    {
      path: '/login',
      title: 'Login',
      icon: 'fas fa-chart-area',
      isLogin: true
    },
    {
      path: '/register',
      title: 'Signup',
      icon: 'fas fa-chart-area',
      isLogin: true
    },
    // {
    //   path: '/pages/dashboard',
    //   title: 'Dashboard',
    //   icon: 'fas fa-chart-area',
    // },
    // {
    //   path: '/pages/products',
    //   title: 'Products',
    //   icon: 'fas fa-chart-area',
    // },
    // {
    //   path: '/pages/admin',
    //   title: 'Admin',
    //   icon: 'fas fa-calendar',
    // },
    // {
    //   path: '/pages/mart-shops',
    //   title: 'Mart Shops',
    //   icon: 'fas fa-server',
    // }
  ];

  selectedCategories = [];
  categoriesList = [];
  firstList = [];
  secondList = [];
  thirdList = [];

  currentUser;

  constructor(
    private router: Router,
    private authService: AuthService,
    private helperService: HelperService,
    private listingService: ListingService
  ) {}

  ngOnInit(): void {
    this.helperService.getUserLogoutStatus().subscribe(() => {
      this.getCurrentUser();
    });
    this.categoriesList = this.listingService.productCategories;
    this.firstList = this.categoriesList;
    this.secondList = this.firstList[0].children;
    this.thirdList = this.secondList[0]?.children.length ? this.secondList[0]?.children : [];

    const currentUrl = this.router.url.split('?')[0];
    this.menu.forEach((item: any) => {
      if (item.path && item.path === currentUrl) {
        this.selectedMenu = item.title;
        return;
      } else if (item.children && item.children.length) {
        for (let ch of item.children) {
          if (ch.path && ch.path === currentUrl) {
            this.selectedMenu = ch.title;
            return;
          }
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.menu = this.generalMenu;

    if (
      changes.submenuItem?.previousValue !== changes.submenuItem?.currentValue
    ) {
      for (let menuItem of this.menu) {
        if (menuItem.children && menuItem.children.length) {
          for (let child of menuItem.children) {
            if (child.path === this.submenuItem.path) {
              this.selectedMenu = menuItem.title;
              return;
            }
          }
        }
      }
    }
  }

  getCurrentUser() {
    this.currentUser = this.authService.getLoginData();
  }

  itemSelected(data) {
    if(data.level === 1) {
      this.thirdList = [];
      this.secondList = data.children;
      this.selectedCategories = [data.name];
    } else if(data.level === 2) {
      this.selectedCategories = [this.selectedCategories[0],data.name];

      if(data.parent) this.thirdList = data.children;
      else this.thirdList = [];
      console.log(this.thirdList);
    } else if(data.level === 3) {
      this.selectedCategories = [this.selectedCategories[0],this.selectedCategories[1],data.name];
    }
  }

  itemClicked(data) {
    this.itemSelected(data);
  }

  toggleMenu(menu) {
    if(menu.sellPlatform) {
      window.open(menu.path, '_blank');
      return;
    }
    if (menu.title === 'Categories') {
      return;
    }
    this.selectedMenu = menu.title;
    this.router.navigateByUrl(menu.path);
  }
}
