import { Component } from '@angular/core';
import { WebusbSerivce } from './webusb/webusb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public text: string = 'My Text';

  constructor(private webusbSerivce: WebusbSerivce) {}

  public async connect() {
    this.webusbSerivce.connect(this.showResult);
  }

  public send() {
    this.webusbSerivce.sendData(this.text);
  }

  public showResult = (data) => {
    console.log(data);
  }
}