import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MainScrComponent } from './main-scr/main-scr.component';
import { ZipFormComponent } from './zip-form/zip-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MainScrComponent,
    ZipFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
