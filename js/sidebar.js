async function createSidebar() {
    var queryStrings = parseQueryStrings();
    let current_pallet = '';
    let current_extrinsic = '';
    if (queryStrings['p'] && queryStrings['e']) {
        current_pallet = queryStrings['p'];
        current_extrinsic = queryStrings['e'];
    }

    let db_page = window.location.pathname.includes('db-stats.html')

    let benchmarks = await d3.csv("./all_benchmarks.csv");

    let benchmarksOrganized = {}

    for (benchmark of benchmarks) {
        if (!(benchmark.pallet in benchmarksOrganized)) {
            benchmarksOrganized[benchmark.pallet] = []
        }
        benchmarksOrganized[benchmark.pallet].push(benchmark.extrinsic)

    }

    for ([pallet, extrinsics] of Object.entries(benchmarksOrganized)) {
        let sidebar = document.getElementById('sidebar');
        let h6 = document.createElement('h6');
        h6.classList.add(
            'sidebar-heading',
            'd-flex',
            'justify-content-between',
            'align-items-center',
            'px-3',
            'mt-4',
            'mb-1',
            'text-muted'
        );
        h6.innerText = pallet;

        let ul = document.createElement('ul');
        ul.classList.add('nav', 'flex-column', 'mb-2');

        for (extrinsic of extrinsics) {
            let li = document.createElement('li');
            li.classList.add('nav-item');
            let span = document.createElement('span');
            span.classList.add('nav-link-group');

            let a = document.createElement('a');
            a.classList.add('nav-link');
            if (pallet == current_pallet && extrinsic == current_extrinsic && !db_page) {
                a.classList.add('active');
            }
            a.href = './?p=' + pallet + '&e=' + extrinsic;
            a.innerText = extrinsic;
            a.onclick = function() {
                parseData(pallet, extrinsic);
            };

            let a2 = document.createElement('a');
            if (pallet == current_pallet && extrinsic == current_extrinsic && db_page) {
                a2.classList.add('active');
            }
            a2.href = './db-stats.html?p=' + pallet + '&e=' + extrinsic;
            a2.innerText = "(db stats)";
            a2.classList.add("badge", "badge-secondary", "ml-2");
            a2.onclick = function() {
                parseData(pallet, extrinsic);
            };

            span.appendChild(a);
            span.appendChild(a2);
            li.appendChild(span);
            ul.appendChild(li);
        }

        sidebar.appendChild(h6);
        sidebar.appendChild(ul);
    }
}

createSidebar().then(() => {
    if (document.getElementsByClassName('active')[0]) {
        document.getElementsByClassName('active')[0].scrollIntoView();
    }
});
