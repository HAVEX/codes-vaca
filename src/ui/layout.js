export default function Layout(arg) {
    'use strict';
    var options = arg || {},
        layoutId = options.id || false,
        className = options.class || "",
        margin = options.margin || 0,
        spacing = options.spacing || 5,
        padding = options.padding || 0,
        rows = options.rows || [],
        cols = options.cols || [],
        divRows = [],
        divCols = [],
        container = options.container || document.body;

    if(typeof container == 'string')
        container = document.getElementById(container);

    if(container == document.body ) {
        container.style.height = window.innerHeight + 'px';
        container.style.padding = 0;
        container.style.margin = 0;
        container.style.overflow = 'hidden';
    }

    var setting = {
        rowHeights: [],
        colWidths : [],
    };

    var width = options.width ||  container.clientWidth || window.innerWidth,
        height = options.height || container.clientHeight|| window.innerHeight;

    width -= margin*2;
    height -= margin*2;

    var divs = {},
        cells = [];


    function createRow(w, h) {
        var row = document.createElement('div');
        row.style.width = w + 'px';
        row.style.height = h + 'px';
        row.className = 'davi-row';
        row.style.overflow = 'hidden';
        return row;
    }

    function createColumn(w, h) {
        var col = document.createElement('div');
        col.style.display = 'inline-block';
        col.className = 'davi-col';
        col.style.verticalAlign = "top";
        col.style.width = w + 'px';
        col.style.height = h + 'px';
        col.style.overflow = 'hidden';
        return col;
    }

    function createColumns(spec, container, w, h) {
      var columns = [],
          widthTotal = w,
          widthRemaining = widthTotal;

      spec.forEach(function(cs, i){
          var colWidth = (cs.width > 1) ? cs.width : cs.width * widthTotal;
          columns[i] = createColumn(colWidth, h);
          widthRemaining -= colWidth;
          if(cs.id !== undefined) {
              columns[i].setAttribute('id', cs.id)
              divs[cs.id] = columns[i];
          }
          container.appendChild(columns[i]);
          if(cs.rows) columns[i] = createRows(cs.rows, columns[i], w, h);

      });

      return columns;
    }

    function createRows(spec, container, w, h) {
        var rows = [],
            rowWidth = w,
            heightTotal = h,
            heightRemaining = heightTotal;

        spec.forEach(function(rs, i){
            var rowHeight = (rs.height > 1) ? rs.height : rs.height * heightTotal;
            rows[i] = createRow(rowWidth, rowHeight);
            heightRemaining -= rowHeight;
            if(rs.id !== undefined) {
                rows[i].setAttribute('id', rs.id)
                divs[rs.id] = rows[i];
            }
            container.appendChild(rows[i]);
            if(rs.cols) rows[i] = createColumns(rs.cols, rows[i], rowWidth, rowHeight);

        });

        return rows;
    }

    function createLayout(width, height) {

        var layout = document.createElement('div');

        if(layoutId)
            layout.setAttribute('id', layoutId);

        if(typeof className == 'string')
            layout.className = className;

        // container.style.overflow = 'hidden';
        layout.style.height = height + "px";
        layout.style.width = width + "px";

        layout.style.margin = margin + 'px';
        layout.className = 'davi-layout';
        // layout.style.overflow = 'hidden';
        // layout.style.padding = '0';


        return layout;
    }

    var layout = createLayout(width, height);

    if(rows.length) cells = createRows(rows, layout, width, height);
    if(cols.length) cells = createColumns(cols, layout, width, height);

    Object.keys(divs).forEach(function(k){
        divs[k].append = divs[k].appendChild;
    })

    layout.cell = function(id, cid) {
        if(typeof id === 'number')
            if(typeof cid === 'number' && typeof cells[id][cid] != 'undefined')
                return cells[id][cid];
            else
                return cells[id];
        else
            return divs[id];
    }


    layout.get = layout.cell;
    container.appendChild(layout);
    // container.onresize = function() {
    //     var newLayout = createLayout(container.clientWidth, container.clientHeight);
    //     layout.replaceWith(newLayout);
    // }
    return layout;
};
