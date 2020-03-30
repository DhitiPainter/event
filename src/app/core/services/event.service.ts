import { Injectable } from '@angular/core';
import { HttpClientService } from '../interceptors/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClientService) { }

  /**
   * add event
   * @param event event
   */
  addEvent(event) {
    return this.http.post('event', event);
  }

  /**
   * get event details by email
   */
  getEvent(email) {
    return this.http.get(`event/${email}`);
  }

  /**
   * update selected event
   * @param event event
   */
  updateEvent(event) {
    return this.http.put(`event/${event.email}`, event);
  }

  /**
   * get events list
   */
  getEventList() {
    return this.http.get('events');
  }

  /**
   * delete existing event
   * @param email email
   */
  deleteEvent(email: string) {
    return this.http.delete(`event/${email}`);
  }

  /**
   * get static ahmedabad locations
   */
  getLocations() {
    return this.http.get('../../../assets/locations.json');
  }
}
