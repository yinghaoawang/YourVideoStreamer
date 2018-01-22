import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';

const URL = 'http://localhost:3000/video';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})


export class VideoUploadComponent implements OnInit {
    @ViewChild('fileInput') fileInput: ElementRef;

    public message: string;

    constructor(private http: HttpClient) { }
    ngOnInit() { }


    fileChange(event): void {
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
        this.http.post(URL, formData).subscribe(data => {
            this.fileInput.nativeElement.disabled = false;

            let prevValue = this.fileInput.nativeElement.value;
            this.message = prevValue + " uploaded.";

            this.fileInput.nativeElement.value = "";
        });
    }
}
