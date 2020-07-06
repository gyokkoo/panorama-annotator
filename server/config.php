<?php

class Config
{
    static $SITE_FN = "62117, 62137";
    static $SITE_CREATOR = "Gyokan Syuleymanov, Ilknur Mustafa";
    static $SITE_ADMIN_EMAIL = "gyokan.syuleymanov@gmail.com or ilknurmustafa99@gmail.com";
    static $SITE_INFO = "This project was created during 2020 year, on Web Technologies, Sofia University, FMI, lead by: Milen Petrov";
    static $SITE_URL = "http://ec2-3-93-172-10.compute-1.amazonaws.com/panorama-annotator/app/index.html";
    static $ROOT_FOLDER = "/panorama-annotator/app/index.html";
    static $SITE_DESCRIPTION = "Create panorama annotations and share memories";

    // Database configuration public for DEV purposes only
    // Edit when deploying to EC2 instance.
    static $DB_HOST = "localhost";
    static $DB_NAME = "panorama";
    static $DB_USER = "root";
    static $DB_PASS = "";
}
