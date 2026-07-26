use std::process::Command;

fn main() {
    println!("cargo::rerun-if-changed=src/webimg.ts");
    Command::new("tsc").arg("-v").output().expect("cargo::error=tsc presence check failed! do you have typescript installed?");

    if let Err(v) = Command::new("tsc").output() {
        println!("cargo::error=tsc failed to compile! error log below...\n{}", v);
    }
}