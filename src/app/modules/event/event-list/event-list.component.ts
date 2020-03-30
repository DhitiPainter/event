import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: any[] = [];

  constructor(
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.eventService.getEventList().subscribe((res: any) => {
      this.events = res;
    });
  }

  addEvent() {
    this.router.navigate(['event/add']);
  }

  deleteEvent(event) {
    this.eventService.deleteEvent(event.email).subscribe((res: any) => {
      this.snackBar.open(res.message, 'Success', {
        duration: 2500,
        verticalPosition: 'top'
      });
      this.getEvents();
    });
  }

  editEvent(email) {
    this.router.navigate(['event/add'], { queryParams: { email } });
  }
}
