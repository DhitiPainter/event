import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone
} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
  FormArray,
  AbstractControl
} from "@angular/forms";
import { Observable } from "rxjs";
import { EventService } from "../../../core/services/event.service";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { MapsAPILoader } from "@agm/core";
import { startWith, map } from "rxjs/operators";

declare var google;

@Component({
  selector: "app-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.scss"]
})
export class AddEventComponent implements OnInit {
  formGroup: FormGroup;
  eventArray: FormGroup;
  guests: FormControl[];
  titleAlert: string = "This field is required";

  locations = [];
  filteredLocations: Observable<any[]>;

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.getLocations();
    // filter locations based on search value
    this.filteredLocations = this.formGroup.controls.location.valueChanges.pipe(
      startWith(""),
      map(location =>
        location ? this.filterLocations(location) : this.locations.slice()
      )
    );
  }

  /**
   * create event form
   */
  createForm() {
    let emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroup = this.formBuilder.group({
      title: ["", [Validators.required]],
      isAllDay: [true, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      location: ["", []],
      email: ["", [Validators.required, Validators.pattern(emailRegex)]],
      desc: ["", [Validators.maxLength(100)]],
      guests: this.formBuilder.array([])
    });
  }

  getGuestsFormControls(): AbstractControl[] {
    return (<FormArray>this.formGroup.get("guests")).controls;
  }

  addGuest() {
    (this.formGroup.controls.guests as FormArray).push(
      this.formBuilder.control(null)
    );
  }

  removeGuest(index) {
    (this.formGroup.get("guests") as FormArray).removeAt(index);
  }

  deleteGuests(index: number) {
    (<FormArray>this.formGroup.get("eventDetails")).removeAt(index);
  }

  /**
   * get locations
   */
  getLocations() {
    this.eventService.getLocations().subscribe((res: any) => {
      res.predictions.forEach(l => {
        this.locations.push({ key: l.id, name: l.description });
      });
    });
  }

  filterLocations(name: string) {
    return this.locations.filter(
      l => l.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  /**
   * validate email
   * @param i index
   */
  getErrorEmail(i) {
    return this.formGroup.controls["email"].hasError("required")
      ? "Field is required"
      : this.formGroup.controls["email"].hasError("pattern")
      ? "Invalid email"
      : this.eventService.isDuplicateEmail(
          this.formGroup.controls["email"].value
        )
      ? "Email already in use"
      : "";
  }

  onSubmit() {
    // check for duplicate email
    if (this.eventService.isDuplicateEmail(this.formGroup.value.email)) {
      this.snackBar.open("Duplicate email", "Error", {
        duration: 2500,
        verticalPosition: "top"
      });
      return;
    }
    // check for 'to' date is greater than 'from'
    if (
      new Date(this.formGroup.controls.startDate.value) >
      new Date(this.formGroup.controls.endDate.value)
    ) {
      this.snackBar.open("End date must be greater", "Error", {
        duration: 2500,
        verticalPosition: "top"
      });
      return;
    }
    this.eventService.addEvent(this.formGroup.value);
    this.snackBar.open("Event added", "Success", {
      duration: 2500,
      verticalPosition: "top"
    });
    this.goToList();
  }

  /**
   * navigate to list
   */
  goToList() {
    this.router.navigate(["event/list"]);
  }
}
