use std::process::Command;

fn main() {
    println!("cargo::rerun-if-changed=src/webimg.ts");

    #[cfg(windows)]
    let tsc_dir = "tsc.cmd"; // as is typical, windows is quirky and installs tsc in some weird format
    #[cfg(not(windows))]
    let tsc_dir = "tsc";


    Command::new(tsc_dir).arg("-v").output().expect("cargo::error=tsc presence check failed! do you have typescript installed?");

    if let Err(v) = Command::new(tsc_dir).output() {
        println!("cargo::error=tsc failed to compile! error log below...\n{}", v);
    }
}