import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
  FormArray
} from "@angular/forms";
import { Observable } from "rxjs";
import { EventService } from "../event.service";

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
    private eventService: EventService
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
      desc: ["", [Validators.maxLength(100)]]
    });
  }

  addGuest(event: FormGroup) {
    let guest = event.get("guests") as FormArray;
    guest.push(this.formBuilder.control(["", [Validators.maxLength(50)]]));
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

  // get name() {
  //   return this.formGroup.get('name') as FormControl
  // }

  // checkPassword(control) {
  //   let enteredPassword = control.value
  //   let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  //   return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  // }

  checkInUseEmail(control) {
    // mimic http database access
    let db = ["tony@gmail.com"];
    return new Observable(observer => {
      setTimeout(() => {
        let result =
          db.indexOf(control.value) !== -1 ? { alreadyInUse: true } : null;
        observer.next(result);
        observer.complete();
      }, 4000);
    });
  }

  getErrorEmail(i) {
    return this.formGroup.controls["email"].hasError("required")
      ? "Field is required"
      : this.formGroup.controls["email"].hasError("pattern")
      ? "Invalid email"
      : this.formGroup.controls["email"].hasError("alreadyInUse")
      ? "Email already in use"
      : "";
  }

  onSubmit() {
    if (this.eventService.isDuplicateEmail(this.formGroup.value.email)) return;
    this.eventService.addEvent(this.formGroup.value);
  }
}
