import { Component, OnInit } from '@angular/core';
import { Video } from '../video';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})

export class VideosComponent implements OnInit {
    videos: Video[] = [];

    constructor(private videoService: VideoService) { }

    getVideoList(): void {
        this.videos = this.videoService.getVideoList();
    }

    ngOnInit() {
        this.getVideoList();
    }
}
