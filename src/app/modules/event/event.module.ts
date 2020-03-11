import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EventRoutingModule } from "./event-routing.module";
import { EventComponent } from "./event.component";
import { SharedModule } from "src/app/shared/shared.module";
import { MaterialModule } from "src/app/shared/material.module";
import { AddEventComponent } from "./add-event/add-event.component";
import { MapComponent } from "./add-event/map.component";
import { EventListComponent } from "./event-list/event-list.component";
import { MatGoogleMapsAutocompleteModule } from "@angular-material-extensions/google-maps-autocomplete";
import { EventService } from "./event.service";
import { ApiService } from "./map.service";

@NgModule({
  declarations: [
    EventComponent,
    AddEventComponent,
    EventListComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    SharedModule,
    MaterialModule,
    MatGoogleMapsAutocompleteModule
  ],
  providers: [EventService, ApiService]
})
export class EventModule {}
