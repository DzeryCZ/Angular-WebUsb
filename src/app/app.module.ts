import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';
// import { TemperatureCom ponent } from './temperature.component';
import { WebusbSerivce } from './webusb/webusb.service';

const appRoutes: Routes = [
  // {
  //   path: 'temperature-humidity',
  //   component: TemperatureComponent
  // },
  { 
    path: 'show-text',
    component: AppComponent
  },
  { 
    path: '',
    redirectTo: '/show-text',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    // TemperatureComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    WebusbSerivce
  ],
  bootstrap: [
    AppComponent,
    // TemperatureComponent
  ]
})
export class AppModule { }
