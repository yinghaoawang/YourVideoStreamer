import { Component, OnInit } from '@angular/core';
import { Video } from '../video';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})

export class VideosComponent implements OnInit {
    video: Video = {
        name: "file.mp4",
        size: 500,
        duration: 5000,
        date_recorded: "2018-04-17 24:34:12",
        url: "https://yourvideostreamer.s3.us-west-1.amazonaws.com/file.mp4"
    };

    constructor() { }

    ngOnInit() {
    }

}
