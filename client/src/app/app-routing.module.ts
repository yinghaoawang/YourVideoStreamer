import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoListComponent } from './video/video-list/video-list.component';
import { VideoDetailComponent } from './video/video-detail/video-detail.component';
import { VideoUploadComponent } from './video/video-upload/video-upload.component';

const routes: Routes = [
    { path: 'videos', component: VideoListComponent },
    { path: 'videos/:id', component: VideoDetailComponent },
    { path: 'upload', component: VideoUploadComponent },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]

})
export class AppRoutingModule { }
