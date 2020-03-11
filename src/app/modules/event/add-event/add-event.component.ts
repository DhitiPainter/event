import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
  FormArray,
  AbstractControl
} from "@angular/forms";
import { Observable } from "rxjs";
import { EventService } from "../event.service";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";

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
  post: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
  }

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
    return (<FormArray> this.formGroup.get('guests')).controls
  }

  addGuest() {
    (this.formGroup.controls.guests as FormArray).push(this.formBuilder.control(null));
  }

  removeGuest(index){
    (this.formGroup.get('guests') as FormArray).removeAt(index);
  }

  deleteGuests(index: number) {
    (<FormArray>this.formGroup.get("eventDetails")).removeAt(index);
  }

  onAutocompleteSelected(event) {
    console.log(event);
  }

  onLocationSelected(event) {
    console.log(event);
  }

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
    if (this.eventService.isDuplicateEmail(this.formGroup.value.email)) {
      this.snackBar.open("Duplicate email", "Error", {
        duration: 2500,
        verticalPosition: "top"
      });
      return;
    }
    this.eventService.addEvent(this.formGroup.value);
  }

  goToList() {
    this.router.navigate(["event/list"]);
  }
}
