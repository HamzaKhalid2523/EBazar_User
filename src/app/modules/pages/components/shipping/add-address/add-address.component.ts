import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AddressService } from 'src/app/core/services/api/address.service';
import { AdminsService } from 'src/app/core/services/api/admins.service';
import { FirebaseImageHandler } from 'src/app/core/services/api/firebase-image-handler.service';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {

  @Output() modalVisible = new EventEmitter<any>();
  @Input() formType = "Create";
  @Input() updatedData;

  addressForm: FormGroup;
  loading = false;
  referenceObj: any;
  currentLoggeduser: any;

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private helplerService: HelperService,
    private authService: AuthService,
    private firebaseImageHandler: FirebaseImageHandler,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.initializeForm();
  }

  createForm() {
    this.addressForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(4)]],
      phone: [ null, [ Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      province: [null, [Validators.required]],
      city: [null, [Validators.required]],
      area: [null, [Validators.required]],
      address: [null, [Validators.required]],
      building: [null, [Validators.required]],
      colony: [null, [Validators.required]],
      addressType: [null, [Validators.required]],
    });
  }

  initializeForm() {
    if(this.formType === 'Create') return;
    else if(this.formType === 'Update') {
      this.addressForm.reset();
      this.addressForm.patchValue(this.updatedData);

      this.addressForm.controls["password"].disable();
      this.createReference(this.addressForm.value);
    }
  }

  submitForm() {
    if (!this.addressForm.valid) return;
    const value = this.addressForm.value;

    if(this.formType === "Update") this.updateData(value);
    else if(this.formType === "Create") this.saveData(value);
  }

  // Udate User
  updateData(object) {
    this.loading = true;
    const data = this.helplerService.getChangedObj(this.referenceObj, object);

    this.addressService.updateData(this.updatedData["_id"], data)
    .subscribe(
      (response) => {
        const msg = response.message;
        this.showToast(msg, "success");
        this.modalVisible.emit();
      },
      (error) => {
        let errorMsg;
        if (error?.status === 422 || error?.error?.code === 422) {
          errorMsg = "No Field to be Updated!";
        } else {
          errorMsg = error?._message || error?.detail?._message ||
                    error?.error?.message || "Something Went Wrong. Server Error!!";
        }
        this.showToast(errorMsg, "error");
        this.loading = false;
      }
    );
  }

  // Add User
  async saveData(object) {
    this.loading = true;
    this.addressService.createData(object).subscribe(
      (response) => {
        if (response?.detail?.code === 11000 || response?.message === "Error") {
          const errorMsg = response?.message || response?.detail?._message || response?.error?.message ||
                          response?.message || "Something Went Wrong. Server Error!!";
          this.showToast(errorMsg, "error");
          this.loading = false;
        } else {
          const msg = response.message;
          this.showToast(msg, "success");
          this.loading = false;
          this.modalVisible.emit();
        }
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

  setDeliveryAddress(label) {
    this.addressForm.patchValue({addressType: label});
    console.log(this.addressForm.value);
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
