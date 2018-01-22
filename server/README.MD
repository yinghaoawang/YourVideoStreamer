# Server
An API server that utilizes Amazon Web Services Simple Storage (AWS S3 to store videos.
The database stores the aws file link as well as information to organize the videos.

## Getting started
    * Create a config.json with the following keys
        ```
        {
            "accessKeyId": "myKey",
            "secretAccessKey": "mySecret",
            "region": "myRegion",
            "bucketName": "myBucket",
            "mysql": {
                "host": "myHost",
                "user": "myUser",
                "password": "myPass",
                "database": "myDb"
            }
        }
        ```
    * Install dependencies with `npm install`
    * Build mySql db and tables with `mysql -u <youruser> -p createDB.sql` (it will query you for password)
    * Start node server
        * Normally with `npm start`
        * or with a watcher `npm run devstart`

## Built with
- NodeJS - Javascript backend
- AWS S3 - File store
- MySQL - Basic relation database
