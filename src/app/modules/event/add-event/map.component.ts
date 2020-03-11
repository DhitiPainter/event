import {
  Component,
  Inject,
  ElementRef,
  ViewChild,
  NgZone
} from "@angular/core";
// import * as turf from "@turf/turf";

import { ApiService, Maps } from "../map.service";
import { geolib } from "./geolib";

const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "brown",
  "BurlyWood",
  "Cyan",
  "DarkGreen",
  "DarkOrchid",
  "DarkOliveGreen",
  "Fuchsia",
  "GoldenRod",
  "Indigo",
  "LightCoral",
  "MediumSlateBlue"
];
let colorIndex = 0;

const place = null as google.maps.places.PlaceResult;
type Components = typeof place.address_components;

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html"
  //   styleUrls: [ './map.component.css' ]
})
export class MapComponent {
  @ViewChild("search", { static: true }) public searchElementRef: ElementRef;

  @ViewChild("map", { static: true }) public mapElementRef: ElementRef;

  public entries = [];

  public place: google.maps.places.PlaceResult;

  public locationFields = [
    "name",
    "cityName",
    "stateCode",
    "countryName",
    "countryCode"
  ];

  private map: google.maps.Map;

  constructor(apiService: ApiService, private ngZone: NgZone) {
    apiService.api.then(maps => {
      this.initAutocomplete(maps);
      //   this.initMap(maps);
    });
  }

  initAutocomplete(maps: Maps) {
    let autocomplete = new maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        this.onPlaceChange(autocomplete.getPlace());
      });
    });
  }

  //   initMap(maps: Maps) {
  //     this.map = new maps.Map(this.mapElementRef.nativeElement, {
  //       zoom: 7
  //     });
  //     this.map.addListener('click', event => {

  //       const ellipsePoints = toEllipse(this.entries[0].location.bounds);
  //       var line = turf.helpers.lineString(ellipsePoints.map(p => [p.longitude, p.latitude]));

  //       const pointLatLng = event.latLng as google.maps.LatLng;
  //       var point = turf.helpers.point([pointLatLng.lng(), pointLatLng.lat()]);
  //       //point = turf.helpers.point([this.entries[0].location.coordinates.longitude, this.entries[0].location.coordinates.latitude]);
  //       const isInside = geolib.isPointInside({latitude: pointLatLng.lat(), longitude: pointLatLng.lng()}, ellipsePoints);
  //       const distance = isInside ? 0 : turf.pointToLineDistance(point, line);
  //       console.log('distance', distance * 1000);
  //     });
  //   }

  onPlaceChange(place: google.maps.places.PlaceResult) {
    this.map.setCenter(place.geometry.location);

    const color = colors[colorIndex++ % colors.length];
    const pin = this.pin(color);

    const marker = new google.maps.Marker({
      position: place.geometry.location,
      animation: google.maps.Animation.DROP,
      map: this.map,
      icon: this.pin(color)
    });

    const rectangle = new google.maps.Rectangle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: this.map,
      bounds: place.geometry.viewport
    });

    const expandedRectangle = new google.maps.Rectangle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 0.5,
      fillColor: color,
      fillOpacity: 0.2,
      map: this.map,
      bounds: expandBounds(place.geometry.viewport.toJSON(), 5000)
    });

    const location = this.locationFromPlace(place);

    const ellipse = new google.maps.Polygon({
      paths: toEllipse(location.bounds).map(
        ({ latitude, longitude }) => new google.maps.LatLng(latitude, longitude)
      ),
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: 1,
      fillColor: color,
      fillOpacity: 0.3
    });
    ellipse.setMap(this.map);

    this.entries.unshift({
      place,
      marker,
      rectangle,
      expandedRectangle,
      ellipse,
      color,
      location
    });
  }

  remove(entry) {
    entry.marker.setMap(null);
    entry.rectangle.setMap(null);
    entry.expandedRectangle.setMap(null);
    entry.ellipse.setMap(null);
    this.entries = this.entries.filter(e => e !== entry);
  }

  pin(color) {
    return {
      path:
        "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0",
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#000",
      strokeWeight: 2,
      scale: 1
    };
  }

  public locationFromPlace(place: google.maps.places.PlaceResult) {
    const components = place.address_components;
    if (components === undefined) {
      return null;
    }

    const areaLevel3 = getShort(components, "administrative_area_level_3");
    const locality = getLong(components, "locality");

    const cityName = locality || areaLevel3;
    const countryName = getLong(components, "country");
    const countryCode = getShort(components, "country");
    const stateCode = getShort(components, "administrative_area_level_1");
    const name = place.name !== cityName ? place.name : null;

    const coordinates = {
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng()
    };

    const bounds = place.geometry.viewport.toJSON();

    // placeId is in place.place_id, if needed
    return {
      name,
      cityName,
      countryName,
      countryCode,
      stateCode,
      bounds,
      coordinates
    };
  }
}

function getComponent(components: Components, name: string) {
  return components.filter(component => component.types[0] === name)[0];
}

function getLong(components: Components, name: string) {
  const component = getComponent(components, name);
  return component && component.long_name;
}

function getShort(components: Components, name: string) {
  const component = getComponent(components, name);
  return component && component.short_name;
}

function toEllipse({ north, south, east, west }: cosmos.LatLngBoundsLiteral) {
  const latitude = (north + south) / 2;
  const longitude = (east + west) / 2;
  const r1 =
    geolib.getDistance(
      { latitude: north, longitude },
      { latitude: south, longitude }
    ) / 2;
  const r2 =
    geolib.getDistance(
      { latitude, longitude: west },
      { latitude, longitude: east }
    ) / 2;

  const center = { latitude, longitude };
  const latitudeConv =
    geolib.getDistance(center, { latitude: latitude + 0.1, longitude }) * 10;
  const longitudeCong =
    geolib.getDistance(center, { latitude, longitude: longitude + 0.1 }) * 10;

  const points: cosmos.Coordinates[] = [];
  const FULL = Math.PI * 2;
  for (let i = 0; i <= FULL + 0.0001; i += FULL / 8) {
    points.push({
      latitude: latitude + (r1 * Math.cos(i)) / latitudeConv,
      longitude: longitude + (r2 * Math.sin(i)) / longitudeCong
    });
  }
  return points;
}

function expandBounds(bounds: cosmos.LatLngBoundsLiteral, meters: number) {
  const SQRT_2 = 1.4142135623730951;
  const { longitude: west, latitude: north } = geolib.computeDestinationPoint(
    {
      latitude: bounds.north,
      longitude: bounds.west
    },
    SQRT_2 * meters,
    315
  );
  const { longitude: east, latitude: south } = geolib.computeDestinationPoint(
    {
      latitude: bounds.south,
      longitude: bounds.east
    },
    SQRT_2 * meters,
    135
  );
  return { west, north, east, south };
}

namespace cosmos {
  export interface Coordinates {
    /**
     * Coordinates latitude.
     * @type {number}
     */
    latitude: number;
    /**
     * Coordinates longitude.
     * @type {number}
     */
    longitude: number;
  }
  export interface LatLngBoundsLiteral {
    /**
     * LatLngBoundsLiteral east.
     * @type {number}
     */
    east: number;
    /**
     * LatLngBoundsLiteral north.
     * @type {number}
     */
    north: number;
    /**
     * LatLngBoundsLiteral south.
     * @type {number}
     */
    south: number;
    /**
     * LatLngBoundsLiteral west.
     * @type {number}
     */
    west: number;
  }
}
