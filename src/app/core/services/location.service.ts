import { Injectable } from '@angular/core';
import { HttpClientService } from '../interceptors/http-client.service';
import GeocoderAddressComponent = google.maps.GeocoderAddressComponent;
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    addressComponent: GeocoderAddressComponent[] = [];

    constructor(private http: HttpClientService) { }

    getCity(): string {
        let city = '';
        this.addressComponent.forEach(a => {
            const types = _.get(a, 'types');
            if (_.includes(types, 'locality')) {
                city = _.get(a, 'long_name');
            }
        });
        return city;
    }

    getState(): string {
        let state = '';
        this.addressComponent.forEach(a => {
            const types = _.get(a, 'types');
            if (_.includes(types, 'administrative_area_level_1')) {
                state = _.get(a, 'short_name');
            }
        });
        return state;
    }

    getCountry(): string {
        let country = '';
        this.addressComponent.forEach(a => {
            const types = _.get(a, 'types');
            if (_.includes(types, 'country')) {
                country = _.get(a, 'long_name');
            }
        });
        return country;
    }

    getPostalCode(): string {
        let postalCode = '';
        this.addressComponent.forEach(a => {
            const types = _.get(a, 'types');
            if (_.includes(types, 'postal_code')) {
                postalCode = _.get(a, 'long_name');
            }
        });
        return postalCode;
    }
}
