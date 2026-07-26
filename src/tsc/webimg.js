"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toggledark() {
    document.body.classList.toggle("dark");
}
var perpage = 8;
function set_perpage(v) {
    perpage = v;
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
        paginator.start.disabled = true;
        paginator.back.disabled = true;
        paginator.next.disabled = true;
        paginator.end.disabled = true;
    }
    else {
        // assume registry is valid array
        registry_meta = {
            max_page: Math.floor(registry.length / perpage)
        };
        if (registry.length == 0) {
            imglib.innerHTML = "<div>no files hosted, check host machine</div>";
            return;
        }
        const page_start = perpage * page;
        const page_end = perpage * (page + 1);
        const registry_view = registry.slice(page_start, page_end);
        for (const v of registry_view) {
            imglib.innerHTML += `<img src="${v.loc}" />\n`;
        }
        paginator.start.disabled = page <= 0;
        paginator.back.disabled = page <= 0;
        paginator.curr.innerText = page;
        paginator.total.innerText = registry_meta.max_page;
        paginator.end.disabled = page >= registry_meta.max_page;
        paginator.next.disabled = page >= registry_meta.max_page;
    }
}
function assign_repopulate(v) {
    registry = v;
    repopulate();
}
window.onload = () => {
    console.log("Loaded");
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        toggledark();
    }
    document.getElementById("perpage_ctl").value = perpage;
    paginator = {
        start: document.getElementById("pag_start"),
        back: document.getElementById("pag_back"),
        curr: document.getElementById("pag_curr"),
        total: document.getElementById("pag_total"),
        next: document.getElementById("pag_next"),
        end: document.getElementById("pag_end"),
    };
    repopulate();
    fetch("/files").then(v => v.json(), v => console.warn(v)).then(assign_repopulate, v => console.warn(v));
};
