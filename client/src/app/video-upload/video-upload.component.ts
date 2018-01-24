import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { VideoService } from '../video.service';


@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})


export class VideoUploadComponent implements OnInit {
    @ViewChild('fileInput') fileInput: ElementRef;

    public message: string;

    constructor(
        private http: HttpClient,
        private videoService: VideoService,
    ) { }
    ngOnInit() { }


    fileChange(event): void {
        let URL = this.videoService.URL;
        this.fileInput.nativeElement.disabled = true;
        let fileList: FileList = event.target.files;
        if (fileList.length == 0) return;
        let file = fileList[0];

        let formData = new FormData();
        formData.append('title', 'title');
        formData.append('text', 'text');
        formData.append('music', 'sogod');
        formData.append('file', file);

        this.message = "Uploading...";
        this.http.post(URL + "/video", formData).subscribe(
            data => {
                this.fileInput.nativeElement.disabled = false;

                let prevValue = this.fileInput.nativeElement.value;
                this.message = prevValue + " uploaded.";

                this.fileInput.nativeElement.value = "";
            },
            error => {
                console.log(error);
                this.message = error.message;
            },
        );
    }
}
