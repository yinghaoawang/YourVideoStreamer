import { Component, OnInit } from '@angular/core';
import { Video } from '../video';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})

export class VideosComponent implements OnInit {
    videos: Video[] = [];
    //public data: any;
    //public localVar: any;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        let path = 'http://localhost:3000/video';
        this.http.get(path).subscribe(data => {
            for (let i in data) {
                let entry = data[i];
                let video = {
                    name: entry.name,
                    size: entry.size,
                    duration: entry.duration,
                    date_recorded: entry.date_recorded,
                    url: entry.url
                };
                //console.log(video.name);
                this.videos.push(video);
            }
        });
    }
}
