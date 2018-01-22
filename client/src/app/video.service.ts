import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from './video';

@Injectable()
export class VideoService {
    constructor(private http: HttpClient) { }

    getVideoList(): Video[] {
        let videos: Video[] = [];
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
            videos.push(video);
            }
        });
        return videos;
    }
}
