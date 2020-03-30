import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { HttpClientService } from './interceptors/http-client.service';
import { NotFoundComponent } from '../shared';
import { EventService, LocationService } from './services';

@NgModule({
  declarations: [NotFoundComponent],
  providers: [HttpClient, HttpClientService, EventService, LocationService],
  imports: [CommonModule, HttpClientModule, MatSnackBarModule]
})
export class CoreModule { }
