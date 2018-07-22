import { Component } from '@angular/core';
import { WebusbSerivce } from './webusb/webusb.service';

@Component({
  selector: 'webusb-content',
  templateUrl: './show-text.component.html'
})
export class ShowTextComponent {

  public text: string = '';

  constructor(private webusbSerivce: WebusbSerivce) {}

  public send() {
    this.webusbSerivce.sendSymbol(127); // delete screen
    this.webusbSerivce.sendString(this.text);
  }
}