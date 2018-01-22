import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';

const URL = 'http://localhost:3000/video';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})


export class VideoUploadComponent implements OnInit {
    constructor(private http: HttpClient) { }
    ngOnInit() { }


    fileChange(event): void {
        let fileList: FileList = event.target.files;
        if (fileList.length == 0) return;
        let file = fileList[0];

        let formData = new FormData();
        formData.append('title', 'title');
        formData.append('text', 'text');
        formData.append('music', 'sogod');
        formData.append('file', file);

        this.http.post(URL, formData).subscribe(data => console.log(data));
        /*
        let params = new HttpParams();
        let formData = new FormData();
        formData.append('upload', selectedFile.nativeElement.files[0]);

        const options =  {
            headers: new HttpHeaders().set('Accept', 'application/json'),
            params: params,
            reportProgress: true,
            withCredentials: true,
        };
        this.http.post(URL, formData, options).subscribe(data => {
            data => {
                console.log("Subscribe data", data);
            };
        });
*/
    }



    /*
    fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length == 0) return;
    let file: File = fileList[0];
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    this.http.post('${
    */
}
