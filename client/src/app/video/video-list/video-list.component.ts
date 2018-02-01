import { Component, OnInit } from '@angular/core';
import { Video } from '../video';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-videos',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})

export class VideoListComponent implements OnInit {
    videos: Video[] = [];

    constructor(private videoService: VideoService) { }

    getVideoList(): void {
        this.videos = this.videoService.getVideoList();
    }

    ngOnInit() {
        this.getVideoList();
    }
}
