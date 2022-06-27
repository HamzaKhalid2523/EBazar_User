import { Component, OnInit } from '@angular/core';
import { MartProductsService } from 'src/app/core/services/api/martProducts.service';

@Component({
  selector: 'app-home-mart',
  templateUrl: './home-mart.component.html',
  styleUrls: ['./home-mart.component.scss']
})
export class HomeMartComponent implements OnInit {

  dataList = [];
  dataTotalCount = 0;
  dataLoading = false;

  constructor(
    private martProductsService: MartProductsService
  ) { }

  ngOnInit(): void {
    this.getAllData();
  }

  // Get All Users
  getAllData() {
    this.dataLoading = true;
    let filterOptions = this.getQueryFilters();

    this.martProductsService.getData(filterOptions).subscribe(
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
