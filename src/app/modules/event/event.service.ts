import { Injectable } from "@angular/core";
import { EVENT_LIST } from "../../core/constants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class EventService {
  addEvent(event) {
    let eventList = JSON.parse(localStorage.getItem(EVENT_LIST)) || [];
    if (!this.isDuplicateEmail(eventList.email)) {
      eventList.push(event);
      localStorage.setItem(EVENT_LIST, JSON.stringify(eventList));
    }
  }

  getEventList() {
    return JSON.parse(localStorage.getItem(EVENT_LIST));
  }

  isDuplicateEmail(email): boolean {
    let eventList = JSON.parse(localStorage.getItem(EVENT_LIST));
    if (!eventList) return false;

    return <Array<any>>eventList.find(e => e.email === email) ? true : false;
  }

  deleteEvent(event: any) {
    let eventList = JSON.parse(localStorage.getItem(EVENT_LIST));
    <Array<any>>eventList.splice(eventList.indexOf(event.email), 1);
    localStorage.setItem(EVENT_LIST, JSON.stringify(eventList));
    return eventList as Observable<any[]>;
  }
}
