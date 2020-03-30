import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
  FormArray,
  AbstractControl
} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Appearance } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import * as moment from 'moment';

import { LocationService, EventService } from '../../../core/services';
import { Location as GeoLocation } from './location';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  formGroup: FormGroup;
  eventArray: FormGroup;
  guests: FormControl[];

  latitude: number;
  longitude: number;
  selectedAddress: GeoLocation;
  appearance = Appearance;

  selectedEvent: any = {};
  selectedEventUser = '';
  editLocation = true;

  @ViewChild('eventLocation', { static: false }) eventLocation: any;
  autoCompleteOptions = {};

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
  ) { }

  ngOnInit() {
    this.createForm();

    // get params value and set form data
    this.route.queryParams.subscribe(x => {
      if (x.email) {
        this.selectedEventUser = x.email;
        this.eventService.getEvent(this.selectedEventUser).subscribe((res: any) => {
          this.selectedEvent = res;
          this.setForm();
          this.editLocation = false;
        });
      }
    });
  }

  setForm() {
    this.formGroup.patchValue(this.selectedEvent);
    if (this.selectedEvent.guests) {
      this.selectedEvent.guests.forEach(g => {
        this.addGuest(g);
      });
    }
    if (this.selectedEvent.selectedAddress) {
      this.autoCompleteOptions = { address: this.selectedEvent.selectedAddress };
      this.selectedAddress = this.selectedEvent.selectedAddress;
      this.formGroup.controls.location.setValue(this.selectedAddress.name);
      this.formGroup.controls.location.updateValueAndValidity();
    }
  }

  /**
   * create event form
   */
  createForm() {
    // tslint:disable-next-line:max-line-length
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      isMultipleDays: ['true', [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      location: ['', []],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      description: ['', [Validators.maxLength(100)]],
      guests: this.formBuilder.array([])
    });
  }

  getGuestsFormControls(): AbstractControl[] {
    return (this.formGroup.get('guests') as FormArray).controls;
  }

  addGuest(guest = null) {
    (this.formGroup.controls.guests as FormArray).push(
      this.formBuilder.control(guest, [])
    );
  }

  removeGuest(index) {
    (this.formGroup.get('guests') as FormArray).removeAt(index);
  }

  deleteGuests(index: number) {
    (this.formGroup.get('eventDetails') as FormArray).removeAt(index);
  }

  onAutocompleteSelected(result: PlaceResult) {
    this.locationService.addressComponent = result.address_components;

    this.selectedAddress = {
      name: result.name,
      address: result.formatted_address,
      city: this.locationService.getCity(),
      state: this.locationService.getState(),
      country: this.locationService.getCountry(),
      postalCode: this.locationService.getPostalCode(),
      lat: result.geometry.location.lat(),
      lng: result.geometry.location.lng()
    };
    this.formGroup.controls.location.setValue(this.selectedAddress.name);
    this.formGroup.controls.location.updateValueAndValidity();
    console.log(this.formGroup.controls.location, this.selectedAddress);
  }

  /**
   * validate email
   * @param i index
   */
  getErrorEmail(i) {
    return this.formGroup.controls.email.hasError('required')
      ? 'Field is required'
      : this.formGroup.controls.email.hasError('pattern')
        ? 'Invalid email'
        : '';
  }

  onSubmit() {
    const formValue = this.formGroup.value;

    // check for 'to' date is greater than 'from'
    if (moment(formValue.startDate).isAfter(moment(formValue.endDate))) {
      this.snackBar.open('End date must be greater', 'Error', {
        duration: 2500,
        verticalPosition: 'top'
      });
      return;
    }
    if (formValue.isMultipleDays === 'false' && !moment(formValue.endDate).isSame(moment(formValue.fromDate), 'day')) {
      this.snackBar.open('Start and end date must be same', 'Error', {
        duration: 2500,
        verticalPosition: 'top'
      });
      return;
    }
    formValue.location = this.selectedAddress;

    this.selectedEventUser ? this.updateEvent(formValue) : this.addEvent(formValue);
  }

  addEvent(event) {
    this.eventService.addEvent(event).subscribe(res => {
      this.snackBar.open('Event added', 'Success', {
        duration: 2500,
        verticalPosition: 'top'
      });
      this.goToList();
    }, err => {
      this.snackBar.open('Something went wrong', 'Error', {
        duration: 2500,
        verticalPosition: 'top'
      });
    });
  }

  updateEvent(event) {
    this.eventService.updateEvent(event).subscribe((res: any) => {
      this.snackBar.open(res.message, 'Success', {
        duration: 2500,
        verticalPosition: 'top'
      });
      this.goToList();
    }, err => {
      this.snackBar.open(err.message, 'Error', {
        duration: 2500,
        verticalPosition: 'top'
      });
    });
  }

  /**
   * navigate to list
   */
  goToList() {
    this.router.navigate(['event/list']);
  }
}
