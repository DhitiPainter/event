import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEventComponent } from './add-event/add-event.component';
import { EventListComponent } from './event-list/event-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'add', pathMatch: 'full' },
  { path: 'add', component: AddEventComponent },
  { path: 'list', component: EventListComponent },
];

export const EventRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
