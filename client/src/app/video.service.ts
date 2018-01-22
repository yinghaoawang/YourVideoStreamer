import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from './video';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class VideoService {
    path: string = 'http://localhost:3000/video';

    constructor(private http: HttpClient) { }

    getVideo(id: number): Observable<Video> {
        let path2 = this.path + "/" + id;
        return this.http.get(path2).map(data => {
            let video: Video;
            if (Object.keys(data).length == 0) return video;

            let entry = data[0];
            video = {
                id: entry.id,
                name: entry.name,
                size: entry.size,
                duration: entry.duration,
                date_recorded: entry.date_recorded,
                url: entry.url
            }
            console.log(video);

            return video;
        });
    }

    getVideoList(): Video[] {
        let videos: Video[] = [];
        this.http.get(this.path).subscribe(data => {
            for (let i in data) {
                let entry = data[i];
                let video = {
                    id: entry.id,
                    name: entry.name,
                    size: entry.size,
                    duration: entry.duration,
                    date_recorded: entry.date_recorded,
                    url: entry.url
                };
                videos.push(video);
            }
        });
        return videos;
    }
}
