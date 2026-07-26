function toggledark() {
    document.body.classList.toggle("dark");
}

var perpage = 8;
function set_perpage(v : number) {
    perpage = v;
    repopulate();
}

var page = 0;
function set_page(v : number) {
    page = Math.min(registry_meta?.max_page ?? 0, Math.max(0, v));

    repopulate();
}
let next_page = () => { set_page(page + 1) }
let prev_page = () => { set_page(page - 1) }
let first_page = () => { set_page(0) }
let last_page = () => { set_page(registry_meta?.max_page ?? 0) }

var paginator : {
    start : HTMLButtonElement;
    back : HTMLButtonElement;

    curr : HTMLSpanElement;
    total : HTMLSpanElement;

    next : HTMLButtonElement;
    end : HTMLButtonElement;
} | null = null;

var registry : {
    loc: string,
    hash: string,
}[] | null = null;

var registry_meta : {
    max_page : number
} | null = null;

function repopulate() {
    let imglib = document.getElementById("imglib") as HTMLDivElement;
    imglib.innerHTML = "";
    registry_meta = null;

    if (!paginator) throw "cannot call repopulate before paginator initialized";

    if (!registry) {
        imglib.innerHTML = "<div>waiting for fetch...</div>"
        paginator.start.disabled = true;
        paginator.back.disabled = true;
        paginator.next.disabled = true;
        paginator.end.disabled = true;
    }
    else {
        // assume registry is valid array
        registry_meta = {
            max_page: Math.floor(registry.length / perpage)
        }

        if (registry.length == 0) {
            imglib.innerHTML = "<div>no files hosted, check host machine</div>";
            return;
        }

        const page_start = perpage*page;
        const page_end = perpage*(page + 1);

        const registry_view = registry.slice( page_start, page_end );

        for (const v of registry_view) {
            imglib.innerHTML += `<img src="${v.loc}" alt="host image ${v.hash}" onclick="toggle_fs(this)"/>\n`
        }


        paginator.start.disabled = page <= 0;
        paginator.back.disabled = page <= 0;
        paginator.curr.innerText = page as any;
        paginator.total.innerText = registry_meta.max_page as any;
        paginator.end.disabled = page >= registry_meta.max_page;
        paginator.next.disabled = page >= registry_meta.max_page;
    }

}
function assign_repopulate(v : typeof registry) {
    registry = v;
    repopulate();
}

function toggle_fs(e : HTMLElement) {
    e.classList.toggle("fs");
}

window.onload = () => {
    console.log("Loaded");
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        toggledark();
    }
    (document.getElementById("perpage_ctl") as HTMLInputElement).value = perpage as any;

    paginator = {
        start: document.getElementById("pag_start") as HTMLButtonElement,
        back: document.getElementById("pag_back") as HTMLButtonElement,

        curr: document.getElementById("pag_curr") as HTMLSpanElement,
        total: document.getElementById("pag_total") as HTMLSpanElement,

        next: document.getElementById("pag_next") as HTMLButtonElement,
        end: document.getElementById("pag_end") as HTMLButtonElement,
    }

    repopulate();
    fetch("/files").then(v => v.json(), v => console.warn(v)).then(assign_repopulate, v => console.warn(v));
}