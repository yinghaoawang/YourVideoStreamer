import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { VideoListComponent } from './video-list/video-list.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { VideoUploadComponent } from './video-upload/video-upload.component';

import { VideoService } from './video.service';

@NgModule({
  imports: [
      CommonModule,
      RouterModule
  ],
  declarations: [
      VideoListComponent,
      VideoDetailComponent,
      VideoUploadComponent
  ],
  providers: [VideoService]
})

export class VideoModule { }
