import { Injectable } from '@angular/core';
import { HttpClientService } from '../interceptors/http-client.service';
import { Observable } from 'rxjs';

import { EVENT_LIST } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClientService) { }

  /**
   * add event to local
   * @param event event
   */
  addEvent(event) {
    const eventList = JSON.parse(localStorage.getItem(EVENT_LIST)) || [];

    if (!this.isDuplicateEmail(eventList.email)) {
      eventList.push(event);
      localStorage.setItem(EVENT_LIST, JSON.stringify(eventList));
    }
  }

  /**
   * get event
   * @param email email
   */
  getEvent(email) {
    const eventList = JSON.parse(localStorage.getItem(EVENT_LIST));

    return eventList.find(x => x.email === email) as Array<any>;
  }

  /**
   * update added event to local
   * @param event event
   */
  updateEvent(event) {
    const eventList = JSON.parse(localStorage.getItem(EVENT_LIST)) || [];
    eventList[eventList.indexOf(eventList.find(x => x.email === event.email))] = event;
    console.log(eventList[eventList.indexOf(eventList.find(x => x.email === event.email))]);
    localStorage.setItem(EVENT_LIST, JSON.stringify(eventList));
  }

  /**
   * get events from local
   */
  getEventList() {
    return JSON.parse(localStorage.getItem(EVENT_LIST));
  }

  /**
   * check if duplicate email exists
   * @param email string
   */
  isDuplicateEmail(email): boolean {
    const eventList = JSON.parse(localStorage.getItem(EVENT_LIST));

    if (!eventList) { return false; }

    return (eventList as Array<any>).find(e => e.email === email) ? true : false;
  }

  /**
   * delete existing event
   * @param event eventModal
   */
  deleteEvent(event: any) {
    const eventList = JSON.parse(localStorage.getItem(EVENT_LIST));
    (eventList as Array<any>).splice(eventList.indexOf(event.email), 1);
    localStorage.setItem(EVENT_LIST, JSON.stringify(eventList));

    return eventList as Observable<any[]>;
  }

  /**
   * get static ahmedabad locations
   */
  getLocations() {
    return this.http.get('../../../assets/locations.json');
  }
}
