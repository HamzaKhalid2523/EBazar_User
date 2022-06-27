import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListingService } from 'src/app/core/services/helper/listings.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  selectedCategories = [];
  categoriesList = [];
  firstList = [];
  secondList = [];
  thirdList = [];

  bgImageArraySelector = ['.section-banner .bg-img.bg-img1 img','.section-banner .bg-img.bg-img2 img','.section-banner .bg-img.bg-img3 img'];
  bgContentArraySelector = ['.section-banner .slider .item.item1','.section-banner .slider .item.item2','.section-banner .slider .item.item3'];
  currentbgImg = 'https://themes.envytheme.com/vaximo/wp-content/uploads/2020/08/bg-1-1.jpg';
  currentBgIndex = 0;
  interval = null;

  constructor(
    private listingService: ListingService
  ) { }

  ngOnInit(): void {
    this.backgroundSequence();
  }

  backgroundSequence() {
    this.interval = setInterval(() => this.setDataInterval(), 10000);
  }

  prevSlide() {
    this.currentBgIndex = this.currentBgIndex === 0 ? 2: --this.currentBgIndex;

    clearInterval(this.interval);
    this.setDataInterval(true);
    this. interval = setInterval(() => this.setDataInterval(), 10000);
  }

  nextSlide() {
    this.currentBgIndex = this.currentBgIndex === 2 ? 0: ++this.currentBgIndex;

    clearInterval(this.interval);
    this.setDataInterval(true);
    this.interval = setInterval(() => this.setDataInterval(), 10000);
  }

  setDataInterval(manualToggle = false) {
    if(!manualToggle) {
      this.currentBgIndex = this.currentBgIndex === 2 ? 0: ++this.currentBgIndex;
    }

    for (let i = 0; i < this.bgContentArraySelector.length; i++) {
      if(this.currentBgIndex === i) {
          (document.querySelector(this.bgContentArraySelector[i]) as HTMLElement).style.display = "block";

          document.querySelector(this.bgImageArraySelector[i]).classList.remove('hidden');
          document.querySelector(this.bgImageArraySelector[i]).classList.remove('visuallyhidden');
      } else {
          (document.querySelector(this.bgContentArraySelector[i]) as HTMLElement).style.display = "none";

          document.querySelector(this.bgImageArraySelector[i]).classList.add("visuallyhidden");
          document.querySelector(this.bgImageArraySelector[i]).classList.add('hidden');
      }
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
