import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideosComponent } from './videos/videos.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';
//import { AppComponent } from './app.component';

const routes: Routes = [
    { path: 'videos', component: VideosComponent },
    { path: 'videos/:id', component: VideoDetailComponent },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]

})
export class AppRoutingModule { }
