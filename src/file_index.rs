use std::{fs, hash::{DefaultHasher, Hash, Hasher}, path::Path};

use fast_glob::glob_match;

const GLOB_IMAGE_QUERY : &str = "./*.{png,jpeg,jpg,JPG,jfif,pjpeg,pjp,svg,webp,bmp,tiff,tif,gif,avif,apng,ico,cur}";

pub fn fetch_images() -> Vec<FileIndex> {
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
        }).map(|v| {
            FileIndex::new("/files/".to_owned() + &v)
        }).collect();
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct FileIndex {
    loc : String,
    hash : String,
}

impl FileIndex {
    pub fn new(loc : String) -> Self {
        let mut hash = DefaultHasher::new();
        loc.hash(&mut hash);

        FileIndex { loc : loc, hash: hash.finish().to_string() }
    }
}

pub fn transform_paths(paths : Vec<FileIndex>) -> Vec<String> {
    let mut o = Vec::new();
    for v in paths {
        o.push(serde_json::to_string(&v).expect("Failed to serialize a FileIndex!!"));
    };
    o
}