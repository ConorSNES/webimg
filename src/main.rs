use std::{io::{Write, stdin, stdout}, process::exit};

use rocket::{
    fs::{FileServer, Options}, http::Status, response::{content, status::Custom},
};

use crate::file_index::{fetch_images, transform_paths};

mod file_index;

#[macro_use]
extern crate rocket;

const STYLE: &str = include_str!("style.css");
const WEBUI: &str = include_str!("webimg.html");
const SCRIPT: &str = include_str!("tsc/webimg.js");

#[get("/")]
fn base() -> content::RawHtml<String> {
    content::RawHtml(WEBUI.into())
}

#[get("/style.css")]
fn style() -> content::RawCss<String> {
    content::RawCss(STYLE.into())
}

#[get("/webimg.js")]
fn script() -> content::RawJavaScript<String> {
    content::RawJavaScript(SCRIPT.into())
}

#[get("/favicon.png")]
async fn favicon() -> Custom<Vec<u8>> {
    Custom(Status::Ok, include_bytes!("./favicon.png").into())
}

#[get("/files")]
fn registry() -> content::RawJson<String> {
    // find all image files on disk
    let images = fetch_images();
    let strings = transform_paths(images);    
    let fin = format!("[{}]", strings.join(","));

    content::RawJson(fin)
}

#[launch]
fn init() -> _ {
    // handle args here
    // assign to singleton??

    println!("[webimg] Performing initial checks...");
    // find all in dir
    // performs fetch images twice, but please tell me how to share the iterator (collect it??)
    let images = fetch_images();
    println!("[webimg] Found {} files.", images.len());
    if images.len() == 0 {
        println!("[webimg] Continue?");
        let mut so = stdout();
        so.write(b"  [Y/n]: ").expect("stdout not available. aborting");
        so.flush().unwrap();
        let mut uinput = String::new();
        stdin().read_line(&mut uinput).expect("stdin not available. aborting");
        if uinput.chars().nth(0) != Some('Y') { println!("Aborting."); exit(0); }
    }

    // todo: pipe this into fileserver!! security warning!!
    let fs = FileServer::new("./", Options::None);

    let figment = rocket::Config::figment()
        .merge(("port", 8080))
        .merge(("address", "0.0.0.0"));

    rocket::build()
        .mount("/", routes![base, style, favicon, script, registry])
        .mount("/files", fs)
        .configure(figment)
}
