import { Component } from '@angular/core';
import { WebusbSerivce } from './webusb/webusb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public temperature: string = '';
  public humidity: string = '';
  public title = 'app';

  constructor(private webusbSerivce: WebusbSerivce) {}

  public connect() {
    this.webusbSerivce.connect(this.showResult);
  }

  public showResult = (data) => {
      let lines = data.split(/\r?\n/);
      var dataObj = {
        t: Number,
        h: Number
      };
      lines.forEach(line => {
          try{
              dataObj = JSON.parse(line);
          } catch($e) {}
          return dataObj;
      });
      
      if (typeof dataObj.t === 'number' && typeof dataObj.h === 'number') {
        this.temperature = dataObj.t;
        this.humidity = dataObj.h; 
      }
  }
}