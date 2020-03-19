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

import { EventService } from '../../../core/services/event.service';

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
  selectedAddress: PlaceResult;
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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.createForm();

    // get params value and set form data
    this.route.queryParams.subscribe(x => {
      if (x.email) {
        this.selectedEventUser = x.email;
        this.selectedEvent = this.eventService.getEvent(this.selectedEventUser);
        this.setForm();
        this.editLocation = false;
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
      desc: ['', [Validators.maxLength(100)]],
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
    this.selectedAddress = result;
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
        : this.eventService.isDuplicateEmail(
          this.formGroup.controls.email.value
        )
          ? 'Email already in use'
          : '';
  }

  onSubmit() {
    const formValue = this.formGroup.value;
    // check for duplicate email
    if (!this.selectedEvent.email && this.eventService.isDuplicateEmail(formValue.email)) {
      this.snackBar.open('Duplicate email', 'Error', {
        duration: 2500,
        verticalPosition: 'top'
      });
      return;
    }
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
    formValue.selectedAddress = this.selectedAddress;
    this.selectedEvent.email
      ? this.eventService.updateEvent(formValue)
      : this.eventService.addEvent(formValue);
    this.snackBar.open(this.selectedEvent.email ? 'Event updated' : 'Event added', 'Success', {
      duration: 2500,
      verticalPosition: 'top'
    });
    this.goToList();
  }

  /**
   * navigate to list
   */
  goToList() {
    this.router.navigate(['event/list']);
  }
}
