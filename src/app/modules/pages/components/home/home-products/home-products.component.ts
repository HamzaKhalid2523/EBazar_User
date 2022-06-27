import { Component, OnInit } from '@angular/core';
import { LocalProductsService } from 'src/app/core/services/api/localProducts.service';

@Component({
  selector: 'app-home-products',
  templateUrl: './home-products.component.html',
  styleUrls: ['./home-products.component.scss']
})
export class HomeProductsComponent implements OnInit {

  dataList = [];
  dataTotalCount = 0;
  dataLoading = false;

  constructor(
    private localProductsService: LocalProductsService
  ) { }

  ngOnInit(): void {
    this.getAllData();
  }

  // Get All Users
  getAllData() {
    this.dataLoading = true;
    let filterOptions = this.getQueryFilters();

    this.localProductsService.getData(filterOptions).subscribe(
      (response) => {
        this.dataList = response?.data;
        this.dataTotalCount = response?.total;
        this.dataLoading = false;
      },
      (error) => {
        console.log("error", error);
        this.dataLoading = false;
      }
    );
  }

  getQueryFilters() {
    const limit = 10;
    const skip = 0;
    const sort = '-createdAt';

    let filters = [];
    let filterOptions = { filters, limit, skip, sort, isLogged: true };

    return filterOptions;
  }

}
