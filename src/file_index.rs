use std::{fs, path::Path};

use fast_glob::glob_match;

const GLOB_IMAGE_QUERY : &str = "./*.{png,jpeg,jpg,JPG,jfif,pjpeg,pjp,svg,webp,bmp,tiff,tif,gif,avif,apng,ico,cur}";

pub fn fetch_images() -> Vec<String> {
    // find all in dir
    let here = Path::new(".");
    let subelements = match fs::read_dir(here) {
        Err(v) => panic!("Could not get contents of local dir: {}", v),
        Ok(v) => v
    };

    return 
        subelements.map(|v| match v {
            Err(w) => panic!("Could not find fname: {}", w),
            Ok(w) => w.path().display().to_string()
        }).filter(|v| {
            glob_match(GLOB_IMAGE_QUERY, v.as_bytes())
        }).collect();
}

pub fn transform_paths(paths : Vec<String>) -> Vec<String> {
    let mut o = Vec::new();
    for v in paths {
        o.push(format!("{{ \"loc\":\"/files/{}\" }}", v));
    };
    o
}