import { Component, OnInit } from "@angular/core";
import { EventService } from "../../../core/services/event.service";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-event-list",
  templateUrl: "./event-list.component.html",
  styleUrls: ["./event-list.component.scss"]
})
export class EventListComponent implements OnInit {
  events: any[];

  constructor(
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.events = this.eventService.getEventList();
  }

  addEvent() {
    this.router.navigate(['event/add']);
  }

  deleteEvent(event) {
    this.eventService.deleteEvent(event.email);
    this.snackBar.open("Event deleted", "Success", {
      duration: 2500,
      verticalPosition: "top"
    });
    this.getEvents();
  }
}
