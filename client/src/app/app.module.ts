import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { VideoModule } from './video/video.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
      AppComponent,
  ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      AppRoutingModule,
      VideoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
