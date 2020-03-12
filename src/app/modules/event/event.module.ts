import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EventRoutingModule } from "./event-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { MaterialModule } from "src/app/shared/material.module";
import { AddEventComponent } from "./add-event/add-event.component";
import { EventListComponent } from "./event-list/event-list.component";
import { EventService } from "../../core/services/event.service";

@NgModule({
  declarations: [AddEventComponent, EventListComponent],
  imports: [CommonModule, EventRoutingModule, SharedModule, MaterialModule],
})
export class EventModule {}
