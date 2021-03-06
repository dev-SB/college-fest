import {Component, OnInit} from '@angular/core';
import {FirebaseDatabaseService} from '../firebase-database.service';
import {User} from '../user';
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {toTitleCase} from 'codelyzer/util/utils';
import {SnackbarService} from '../snackbar.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {pinCode} from '../data/pincode-data';
import {CustomSnackbarService} from '../custom-snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  userDetailsForm: FormGroup;
  genders = [{id: 'f', value: 'Female'}, {id: 'm', value: 'Male'}, {id: 'o', value: 'Other'}];
  userDetailsValidMsg = {
    name: [{type: 'required', message: 'Enter your Full Name'},
      {type: 'pattern', message: 'Special Characters not allowed'}],
    phoneNo: [{type: 'required', message: 'Please enter your mobile number'},
      {type: 'pattern', message: 'Enter valid mobile number'}],
    pinCode: [{type: 'required', message: 'Please enter your pincode'},
      {type: 'pattern', message: 'Enter valid pincode'}],
    gender: [{type: 'required', message: 'Please select a gender'}],
    city: [{type: 'required', message: 'Enter your city name'},
      {type: 'pattern', message: 'Only city name allowed'}],
    state: [{type: 'required', message: 'Enter your state name'},
      {type: 'pattern', message: 'Special Characters not allowed'}],
    college: [{type: 'required', message: 'Enter your College name'},
      {type: 'pattern', message: 'Special Characters not allowed'}],
    address: [{type: 'required', message: 'Please enter your address'},
      {type: 'pattern', message: 'Special Characters not allowed'}]
  };


  constructor(private databaseService: FirebaseDatabaseService,
              private snackBarService: SnackbarService,
              private location: Location,
              private customSnackbar: CustomSnackbarService
  ) {
    this.userDetailsForm = this.createFormGroup();
  }

  ngOnInit() {
    // console.log('subscribed');
    this.city.valueChanges
      .subscribe((city) => {
        // console.log(this.transport);
        if (city.toString().trim().toLowerCase() === 'jaipur') {
          this.transport.enable();
        } else {
          this.transport.disable();
        }
      });
    this.pinCode.valueChanges
      .subscribe((pin) => {
        if (pin.toString().trim().length === 3) {
          // console.log(pin);
          if (pinCode.hasOwnProperty(pin)) {
            // console.log(pinCode[pin][1].toString());
            this.userDetailsForm.get('city').setValue(toTitleCase(pinCode[pin][1].toString().trim()));
            this.userDetailsForm.get('state').setValue(toTitleCase(pinCode[pin][0].toString().trim()));

          }
        }
      });
  }


  createFormGroup() {
    const data = this.getData();
    return new FormGroup({
      email: new FormControl({value: data.email, disabled: true}, []),
      name: new FormControl(toTitleCase(data.name), [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z\\s.]*')]),
      phoneNo: new FormControl(data.phoneNo, [Validators.required, Validators.pattern('[9876][0-9]{9}')]),
      pinCode: new FormControl(data.pinCode, [Validators.required, Validators.pattern('[0-9]{6}')]),
      gender: new FormControl(data.gender, [Validators.required]),
      city: new FormControl(toTitleCase(data.city), [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z\\s.]*')]),
      state: new FormControl(toTitleCase(data.state), [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z\\s.]*')]),
      college: new FormControl(toTitleCase(data.college), [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z\\s.,\-_\*#]*')]),
      address: new FormControl(toTitleCase(data.address),
        [Validators.required, Validators.pattern('[a-zA-Z0-9#][a-zA-Z0-9\\s.,/()\-_#&\*]*')]),
      transport: new FormControl({
          value: this.transStringToBool(data.transport),
          disabled: this.disableStringToBool(data.transport)
        },
      )
    });
  }

  disableStringToBool(transport) {
    return transport.value === '-1';
  }

  transStringToBool(trans) {
    return trans === '1';
  }

  transBoolToString(trans) {
    if (trans.value) {
      return '1';
    } else if (trans.enabled) {
      return '0';
    } else {
      return '-1';
    }
  }


  getData() {
    return this.databaseService.loggedInUserData;

  }

  get name() {
    return this.userDetailsForm.get('name');
  }

  get phoneNo() {
    return this.userDetailsForm.get('phoneNo');
  }

  get pinCode() {
    return this.userDetailsForm.get('pinCode');
  }

  get gender() {
    return this.userDetailsForm.get('gender');
  }

  get city() {
    return this.userDetailsForm.get('city');
  }

  get state() {
    return this.userDetailsForm.get('state');
  }

  get college() {
    return this.userDetailsForm.get('college');
  }

  get address() {
    return this.userDetailsForm.get('address');
  }

  get transport() {
    // console.log('trans');
    // console.log(this.userDetailsForm.get('transport'));
    return this.userDetailsForm.get('transport');
  }

  onSubmit() {
    if (this.userDetailsForm.valid) {
      const data = {
        name: this.name.value.toString().trim(),
        gender: this.gender.value,
        phoneNo: this.phoneNo.value,
        pinCode: this.pinCode.value,
        city: this.city.value.toString().trim(),
        state: this.state.value.toString().trim(),
        college: this.college.value.toString().trim(),
        address: this.address.value.toString().trim(),
        transport: this.transBoolToString(this.transport),
        newUser: false
      };
      // console.log(this.transport.value);
      // console.log(this.databaseService.updateData(data));
      this.databaseService.updateData(data);
      this.customSnackbar.showSnackBar('Details Updated Successfully.', '', 3);
      this.databaseService.updateData(null);
      this.location.back();
      //  TODO: Reload Page
    } else {
      this.customSnackbar.showSnackBar('All fields are required', '', 3);
    }
  }


}
