import { Component, OnInit, Input } from '@angular/core';
import { VideoService } from '../video.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Video } from '../video';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})

export class VideoDetailComponent implements OnInit {
    @Input() video: Video;

    constructor(
        private route: ActivatedRoute,
        private videoService: VideoService,
        private location: Location
    ) { }

    ngOnInit() {
        this.getVideo();
    }

    getVideo(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        this.videoService.getVideo(id).subscribe(video => this.video = video);
    }

    goBack(): void {
        this.location.back();
    }
}
