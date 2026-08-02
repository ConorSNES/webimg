"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toggledark() {
    document.body.classList.toggle("dark");
}
var perpage = 8;
function set_perpage(v) {
    perpage = Math.max(0, v);
    repopulate();
}
var page = 0;
function set_page(v) {
    page = Math.min(registry_meta?.max_page ?? 0, Math.max(0, v));
    repopulate();
}
let next_page = () => { set_page(page + 1); };
let prev_page = () => { set_page(page - 1); };
let first_page = () => { set_page(0); };
let last_page = () => { set_page(registry_meta?.max_page ?? 0); };
var img_size = "half";
function set_img_size(v) {
    let imglib = document.getElementById("imglib");
    if (!imglib)
        return;
    imglib.classList.value = "";
    img_size = v;
    imglib.classList.add(img_size);
}
var paginator = null;
var registry = null;
var registry_meta = null;
function repopulate() {
    let imglib = document.getElementById("imglib");
    imglib.innerHTML = "";
    registry_meta = null;
    if (!paginator)
        throw "cannot call repopulate before paginator initialized";
    if (!registry) {
        imglib.innerHTML = "<div>waiting for fetch...</div>";
        paginator.top.start.disabled = true;
        paginator.bottom.start.disabled = true;
        paginator.top.back.disabled = true;
        paginator.bottom.back.disabled = true;
        paginator.top.curr.value = page.toString();
        paginator.bottom.curr.value = page.toString();
        paginator.top.total.innerText = "~";
        paginator.bottom.total.innerText = "~";
        paginator.top.next.disabled = true;
        paginator.bottom.next.disabled = true;
        paginator.top.end.disabled = true;
        paginator.bottom.end.disabled = true;
    }
    else {
        // assume registry is valid array
        registry_meta = {
            max_page: Math.floor((registry.length - 1) / perpage)
        };
        page = Math.max(0, Math.min(page, registry_meta.max_page));
        if (registry.length == 0) {
            imglib.innerHTML = "<div>no files hosted, check host machine</div>";
            return;
        }
        const page_start = perpage * page;
        const page_end = perpage * (page + 1);
        const registry_view = registry.slice(page_start, page_end);
        for (const v of registry_view) {
            imglib.innerHTML += `<img src="${v.loc}" alt="host image ${v.hash}" onclick="toggle_fs(this)"/>\n`;
        }
        paginator.top.start.disabled = page <= 0;
        paginator.bottom.start.disabled = page <= 0;
        paginator.top.back.disabled = page <= 0;
        paginator.bottom.back.disabled = page <= 0;
        paginator.top.curr.value = page.toString();
        paginator.top.curr.max = registry_meta.max_page.toString();
        paginator.bottom.curr.value = page.toString();
        paginator.bottom.curr.max = registry_meta.max_page.toString();
        paginator.top.total.innerText = registry_meta.max_page;
        paginator.bottom.total.innerText = registry_meta.max_page;
        paginator.top.end.disabled = page >= registry_meta.max_page;
        paginator.bottom.end.disabled = page >= registry_meta.max_page;
        paginator.top.next.disabled = page >= registry_meta.max_page;
        paginator.bottom.next.disabled = page >= registry_meta.max_page;
    }
}
function assign_repopulate(v) {
    registry = v;
    repopulate();
}
function toggle_fs(e) {
    e.classList.toggle("fs");
}
window.onload = () => {
    console.log("Loaded");
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        toggledark();
    }
    document.getElementById("perpage_ctl").value = perpage;
    document.getElementById("img_size_ctl").value = img_size;
    paginator = {
        top: {
            start: document.getElementById("tpag_start"),
            back: document.getElementById("tpag_back"),
            curr: document.getElementById("tpag_curr"),
            total: document.getElementById("tpag_total"),
            next: document.getElementById("tpag_next"),
            end: document.getElementById("tpag_end"),
        },
        bottom: {
            start: document.getElementById("pag_start"),
            back: document.getElementById("pag_back"),
            curr: document.getElementById("pag_curr"),
            total: document.getElementById("pag_total"),
            next: document.getElementById("pag_next"),
            end: document.getElementById("pag_end"),
        }
    };
    repopulate();
    fetch("/files").then(v => v.json(), v => console.warn(v)).then(assign_repopulate, v => console.warn(v));
};
