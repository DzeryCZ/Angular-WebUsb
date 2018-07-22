import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';
import { TemperatureComponent } from './temperature.component';
import { ShowTextComponent } from './show-text.component';
import { WebusbSerivce } from './webusb/webusb.service';

const appRoutes: Routes = [
  { 
    path: '',
    redirectTo: '/temperature-humidity',
    pathMatch: 'full'
  },
  {
    path: 'temperature-humidity',
    component: TemperatureComponent
  },
  { 
    path: 'show-text',
    component: ShowTextComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TemperatureComponent,
    ShowTextComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { 
        useHash: true,
        enableTracing: true // <-- debugging purposes only
      } 
    )
  ],
  providers: [
    WebusbSerivce
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
