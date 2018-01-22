import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { VideosComponent } from './videos/videos.component';

import { VideoService } from './video.service';
import { AppRoutingModule } from './app-routing.module';

import { VideoDetailComponent } from './video-detail/video-detail.component';


@NgModule({
  declarations: [
      AppComponent,
      VideosComponent,
      VideoDetailComponent
  ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      AppRoutingModule
  ],
  providers: [VideoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
