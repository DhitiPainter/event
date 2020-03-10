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
      apiKey: 'AIzaSyB4SClLrwlRjD3RjZ4yBADSC1ablmNG3mA&input=ahme',
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
