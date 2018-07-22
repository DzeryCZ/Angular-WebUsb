import { Component } from '@angular/core';
import { WebusbSerivce } from './webusb/webusb.service';

@Component({
  selector: 'webusb-content',
  templateUrl: './temperature.component.html'
})
export class TemperatureComponent {

  public temperature: string = '';
  public humidity: string = '';
  public title = 'app';

  constructor(private webusbSerivce: WebusbSerivce) {
    this.webusbSerivce.registerReadCallback(this.showResult);
  }

  public measure = function() {
    this.webusbSerivce.sendSymbol(128); // get temperature and Humidity
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
      
      console.log(dataObj);

      if (typeof dataObj.t === 'number' && typeof dataObj.h === 'number') {
        this.temperature = dataObj.t;
        this.humidity = dataObj.h; 
      }
  }
}