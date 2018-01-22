import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideosComponent } from './videos/videos.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { VideoUploadComponent } from './video-upload/video-upload.component';

const routes: Routes = [
    { path: 'videos', component: VideosComponent },
    { path: 'videos/:id', component: VideoDetailComponent },
    { path: 'upload', component: VideoUploadComponent },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]

})
export class AppRoutingModule { }
