import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgHttpLoaderModule } from 'ng-http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    NgHttpLoaderModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCaKbVhcX_22R_pRKDYuNA7vox-PtGaDkI',
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
