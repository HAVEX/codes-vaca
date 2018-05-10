export default function Table(arg) {
    var table = document.createElement('table'),
        options = arg || {},
        container = options.container || document.body,
        rows = options.rows || false,
        columns = options.columns || options.cols || false,
        type = options.type,
        width = options.width || container.clientWidth * 0.9,
        types = options.types || [];

    if(type) types.push(type);
    if(container) container.appendChild(table);
    table.className = 'ui table ' + types.join(' ');
    table.style.margin = '5px auto';
    table.style.width = width + 'px';
    var tableHead = document.createElement('thead'),
        tableBody = document.createElement('tbody'),
        tr = document.createElement('tr');
    tableHead.appendChild(tr);
    if(columns) {
        columns.forEach(function(col){
            var c = document.createElement('th');
            c.innerHTML = col;
            tr.appendChild(c);
        });
    }
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    table.addRow = function(_row) {
        var row = (Array.isArray(_row)) ? _row : [_row];

        var tr = document.createElement('tr');
        row.forEach(function(col){
            var td = document.createElement('td');
            if(col instanceof HTMLElement)
                td.appendChild(col);
            else
                td.innerHTML = col;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
        return tr;
    }

    table.updateCell = function(row, col, html) {
        var tr = tableBody.childNodes[row];
        var td = tr.childNodes[col];
        td.innerHTML = html;
        return td;
    }

    if (options.hasOwnProperty('style')) {
        Object.keys(options.style).forEach(function(s) {
            table.style[s] = options.style[s];
        });
    }

    table.tbody = tableBody;

    return table;
}
