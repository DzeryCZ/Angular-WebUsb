import { Component } from '@angular/core';
import { WebusbSerivce } from './webusb/webusb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private webusbSerivce: WebusbSerivce) {
    this.webusbSerivce.connectToPairedDevice();
  }

  public connect() {
    this.webusbSerivce.connectToNewDevice();
  }

  public disconnect() {
    this.webusbSerivce.disconnect();
  }
}