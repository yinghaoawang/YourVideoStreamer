DROP DATABASE yourvideostreamer;

CREATE DATABASE yourvideostreamer;

USE yourvideostreamer;

CREATE TABLE videos(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    size INT,
    duration INT,
    date_recorded DATETIME,
    url varchar(255) NOT NULL
);
