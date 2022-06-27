import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RatingsService } from 'src/app/core/services/api/ratings.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';

@Component({
  selector: 'app-order-rating',
  templateUrl: './order-rating.component.html',
  styleUrls: ['./order-rating.component.scss']
})
export class OrderRatingComponent implements OnInit {

  @Input() data;
  @Output() modalVisible = new EventEmitter<any>();

  ratingForm: FormGroup;
  loading = false;
  referenceObj: any;
  currentLoggeduser: any;
  ratingStar = 4;

  constructor(
    private fb: FormBuilder,
    private helplerService: HelperService,
    private ratingsService: RatingsService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.ratingForm = this.fb.group({
      rating: [ "", [ Validators.required ]],
      review: [ "", [ Validators.required ]]
    });
  }

  logRatingChange(value) {
    this.ratingStar = value;
    this.ratingForm.patchValue({ rating: this.ratingStar });
  }

  submitForm() {
    if (!this.ratingForm.valid) return;
    const value = this.ratingForm.value;
    this.saveData(value);
  }

  // Add User
  async saveData(object) {
    this.loading = true;
    const data = {
      ...object,
      productType: this.data?.product?.productType,
      order: this.data?._id,
      product: this.data?.product?.product?._id,
    };

    this.ratingsService.createData(data).subscribe(
      (response) => {
        const msg = response.message;
        this.showToast(msg, "success");
        this.loading = false;
        this.modalVisible.emit();
      },
      (error) => {
        const errorMsg = error?.message || error?._message || error?.detail?._message ||
                        error?.error?.message || "Something Went Wrong. Server Error!!";
        this.showToast(errorMsg, "error");
        this.loading = false;
      }
    );
  }

  createReference(obj: any) {
    this.referenceObj = Object.assign({}, obj);
  }

  // Show Toaster
  showToast(msg, status = "success") {
    if (status == "success") {
      this.helplerService.showToast(msg, "success");
    } else {
      this.helplerService.showToast(msg, "error");
    }
  }
}
