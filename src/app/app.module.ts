import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { WebusbSerivce } from './webusb/webusb.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    WebusbSerivce
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
