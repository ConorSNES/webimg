# webimg

Tiny, all-in-one server instance for quickly exposing a directory of images to the local network via HTML, with a simple integrated gallery

> [!CAUTION]
> Running this program in a directory will (in a read-only sense) expose it to your LAN (or the internet, depending on your setup)! Understand the risks of doing this before running it on a network!

> [!NOTE]
> No image processing is performed on hosted images (images are served as-is from the host machine)

## features

- Tiny compiled program size (<4MiB on Linux!)
- Fully portable binary- everything needed is embedded
- Tiny, simple web image gallery with pagination, dark mode support and some optional configuration
- Fast and lightweight, with minimal cpu/memory footprint

## development/building from source

Requires both cargo toolkit and typescript compiler (`tsc`) ([installation method](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html)) as this is used in a build step to convert main.ts into a usable format.