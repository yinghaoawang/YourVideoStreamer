# Server
An API server that utilizes Amazon Web Services Simple Storage (AWS S3 to store videos.
The database stores the aws file link as well as information to organize the videos.

## Getting started
- Set configuration variables to your AWS and SQL connections
    - Export environment variables by typing in the commands or putting it into your bashrc or equivalent
        ```
            export MYSQL_HOST="myHost"
            export MYSQL_USER="myUser"
            export MYSQL_PASSWORD="myPass"
            export MYSQL_DATABASE="myDb"

            export ACCESS_KEY_ID="mYaCcEsSKeY"
            export SECRET_ACCESS_KEY="mYSeCReTkEy"
            export REGION="my-region-1"
            export BUCKET_NAME="myBucket"
        ```
* To view the videos, set public get bucket policy for your AWS S3 bucket
    - Go to http://awspolicygen.s3.amazonaws.com/policygen.html
    - Use these settings
        - Type of Policy: S3 Bucket Policy
        - Effect: Allow
        - Principal: *
        - AWS Service: Amazon S3
        - Actions:
            - [x] GetObject
        - Amazon Resource Name (ARN): arn:aws:s3:::<bucket_name>/*
    - Click Add Statement
    - Click Generate Policy
        - Copy the text onto clipboard
    - Go to your bucket on AWS console
    - Go to Permissions > Bucket Policy
        - Paste text from clipboard and save
* Install dependencies with `npm install`
* Build mySql db and tables with `mysql -h <yourhost> -u <youruser> -p < createDB.sql` (it will query you for password)
* Start node server with `npm start`

## Built with
- NodeJS - Javascript backend
- AWS S3 - File store
- MySQL - Basic relation database


## Weaknesses
- Uploads the file twice
    - frontend to backend
    - backend to file host (aws s3)
- Reads the file three times
    - frontend
        -form-data reading
    - backend
        - ffprobe reads to get metadata
        - fs creates a readstream to upload to aws s3 because they don't accept stream uploading
