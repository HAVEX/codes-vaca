import fileLoader    from './fileloader';
import modelKP       from './models/kp';
import modelTerminal from './models/terminal';
import modelRouter   from './models/router';

import p6Solo from 'p6-solo';

import linePlot      from './vis/lineplot';
import scatterPlot   from './vis/scatterplot';
import matrixPlot    from './vis/matrixplot';

import Layout      from './ui/layout';
import Panel       from './ui/panel';
import Button      from './ui/button';
import Table       from './ui/table';
import Dropdown    from './ui/dropdown';
import ProgressBar from './ui/progress';
import  * as d3  from 'd3-format';


export default function app(arg) {
    var progressBars = [];

    var views = {};

    var stats = {},
        data = arg.data || null,
        container = arg.container || document.body;

    var results = {};

    var fileList;
    var format = d3.format('.2s');
    var stats = p6Solo.stats;
    var dataopt = p6Solo.pipeline;

    function loadDataFromFile(file, fileId) {
        console.log(file, fileId);
        if(typeof file == 'undefined') return;
        var entity = false, db, rowTotal, rowCount = 0;

        if(file.name.match('kp')) entity = modelKP();
        if(file.name.match('router')) entity = modelRouter();
        if(file.name.match('terminal')) entity = modelTerminal();

        if(entity) {
            fileLoader({
                file: file,
                skip: 1,
                onstart: function(meta) {
                    rowTotal = meta.line;
                    db = entity.allocate(meta);
                    fileList.updateCell(fileId, 2, rowTotal);
                },
                onload:function (data) {
                    rowCount += data.length;
                    progressBars[fileId].percent = rowCount / rowTotal * 100;
                    var rows = entity.preprocess(data);
                    // console.log(rows);
                    if(Array.isArray(rows)) db.addRows(rows);
                },
                oncomplete: function() {
                    var data = db.data();
                    data.stats = db.stats();
                    console.log(data);
                    results[entity.model] = entity.visualize(data);
                }
            });
        }
    }

    var board = new Layout({
        margin: 10,
        cols: [
            { id: 'temporalAnalysis', width: 0.45 },
            { id: 'summary', width: 0.15 },
            { id: 'statsAnalysis',  width: 0.40 },
        ]
    });

    views.timelines = new Panel({
        container: board.cell('temporalAnalysis'),
        id: "panel-timeline",
        title: "Temporal Analysis (PE)",
        padding: 10,
        header: {height: 0.04, style: {backgroundColor: '#F4F4F4'}}
    });

    views.summary = new Panel({
        container: board.cell('summary'),
        id: "panel-summary",
        title: "Temporal Summary (PE)",
        padding: 10,
        style: {overflow: 'scroll'},
        header: {height: 0.04, style: {backgroundColor: '#F4F4F4'}}
    });

    views.timelines.append(
        '<div id="timeline-options" class="plot-options">'+
            '<span>Terminal:<select id="terminal-metrics"></select></span>'+
            '<span>Router:<select id="router-metrics"></select></span>'+
            '<span> KP:<select id="kp-metrics"></select></span>'+
        '</div>' +
        '<div id="terminal-timeline"></div>' +
        '<div id="router-timeline"></div>' +
        '<div id="kp-timeline"></div>'
    );

    views.stats = new Panel({
        container: board.cell('statsAnalysis'),
        id: "panel-stats",
        title: "Statistical Analysis (KP)",
        padding: 10,
        header: {height: 0.04, style: {backgroundColor: '#F4F4F4'}}
    });

    views.stats.append(
        '<div id="stats-options" class="plot-options">'+
            '<span>X:<select id="stats-x"></select></span>'+
            '<span>Y:<select id="stats-y"></select></span>'+
        //   '<span>Size:<select id="stats-size"></select></span> '+
            '<span>Color:<select id="stats-color"></select></span> '+
        '</div>' +
        '<div id="stats-scatterplot"></div>'
    );

    fileList = new Table({
        container: document.getElementById('upload-files'),
        // width: dataPanel.body * 0.8,
        columns: ['File Name', 'Data Size', 'Number of Records', 'Progress / Status']
    });

    fileList.style.display = 'none';

    var fileUploadButton = new Button({
        label: ' Open Files ',
        container: document.getElementById('upload-files'),
        types: ['primary', 'center'],
        icon: 'folder open',
        fileInput: {id: 'testFileUpload', onchange: function(evt) {
            var files = evt.target.files;
            fileList.style.display = 'table';
            console.log(files);
            // $('.ui.large.modal').modal('toggle');
            Object.keys(files).forEach(function(f, fi){
                var fileName = files[f].name;
                var tr = fileList.addRow([fileName, format(files[f].size)+'B', '--', '']);

                progressBars[f] = new ProgressBar({
                    percentage: 0,
                    container: tr.childNodes[3],
                    types: ['green']
                });
                progressBars[f].style.margin = '0';
                loadDataFromFile(files[f], fi);
            });
            startButton.className = startButton.className.replace('disabled', '');
        }}
    });

    var timeLinePlots = {};
    var lockBrush = false;

    function obtainTemporalSummary(domain, selEntity) {
        var aggrResult = [], tres, metrics = [];
        var se = selEntity || false,
            sem =  (se) ? $('#' +  selEntity + '-metrics').val(): 'PE';

        ["terminal", "router", "kp"].forEach(function(entity){
            var metric = $('#' + entity + '-metrics').val();
            metrics.push(metric);
            var dp = dataopt();

            if(Array.isArray(domain)){
                dp.match({
                    VT:  domain
                })
            }
            dp.aggregate({
                $group: ['PE'],
                $collect: {
                    value: {$sum: metric}
                }
            })

            tres = dp.execute(results[entity].VT)
            .map(function(d){
                return {
                    PE: d.PE,
                    metric: metric,
                    value: d.value
                };
            });

            aggrResult = aggrResult.concat(tres);
        });


        var pes = (se) ? aggrResult.filter(d => d.metric == sem).sort((a,b)=>b.value-a.value).map(d=>d.PE) : null;

        views.summary.clear();
        matrixPlot({
            data: aggrResult,
            container: '#panel-summary-body',
            width: views.summary.innerWidth,
            domainY: pes,
            domainX: metrics,
            height: Math.max(views.summary.innerHeight, aggrResult.length * 40/3),
            vmap: {
                color: 'PE',
                y: 'PE',
                x: 'metric'
            }
        })
    }

    function linkTimeLinePlots () {
        timeLinePlots['terminal'].onhover = function(mouse) {
            timeLinePlots['router'].showLineCursor(mouse);
            timeLinePlots['kp'].showLineCursor(mouse);
        }
        timeLinePlots['terminal'].onbrush = function(selection) {
            timeLinePlots['kp'].brushCallBack = false;
            timeLinePlots['router'].brushCallBack = false;
            timeLinePlots['router'].moveBrush(selection);
            timeLinePlots['kp'].moveBrush(selection);
        }

        timeLinePlots['router'].onhover = function(mouse) {
            timeLinePlots['terminal'].showLineCursor(mouse);
            timeLinePlots['kp'].showLineCursor(mouse);
        }
        timeLinePlots['router'].onbrush = function(selection) {
            timeLinePlots['kp'].brushCallBack = false;
            timeLinePlots['terminal'].brushCallBack = false;
            timeLinePlots['kp'].moveBrush(selection);
            timeLinePlots['terminal'].moveBrush(selection);
        }

        timeLinePlots['kp'].onhover = function(mouse) {
            timeLinePlots['router'].showLineCursor(mouse);
            timeLinePlots['terminal'].showLineCursor(mouse);
        }
        timeLinePlots['kp'].onbrush = function(selection) {

            timeLinePlots['router'].brushCallBack = false;
            timeLinePlots['terminal'].brushCallBack = false;
            timeLinePlots['router'].moveBrush(selection);
            timeLinePlots['terminal'].moveBrush(selection);

        }

        timeLinePlots['terminal'].onbrushend = function(selection, domain) {
            obtainTemporalSummary(domain, 'terminal');
            timeLinePlots['router'].brushCallBack = true;
            timeLinePlots['kp'].brushCallBack = true;
        }
        timeLinePlots['router'].onbrushend = function(selection, domain) {
            obtainTemporalSummary(domain, 'router');
            timeLinePlots['kp'].brushCallBack = true;
            timeLinePlots['terminal'].brushCallBack = true;
        }
        timeLinePlots['kp'].onbrushend = function(selection, domain) {
            obtainTemporalSummary(domain, 'kp');
            timeLinePlots['router'].brushCallBack = true;
            timeLinePlots['terminal'].brushCallBack = true;
        }
    }

    var startButton = new Button({
        label: 'Start Analysis',
        container: document.getElementById('upload-files'),
        types: ['green', 'center', 'disabled'],
        onclick: function() {
            ["terminal", "router", "kp"].forEach(function(entity){
                Object.keys(results[entity].VT[0]).filter(function(k){
                    return ['VT', 'KP', 'PE', 'terminal_id', 'router_id', 'LP'].indexOf(k) === -1;
                })
                .forEach(function(k){
                    $('#' + entity + '-metrics').append($("<option/>").attr('value', k).text(k))
                });

                $('#' + entity + '-metrics').change(function(v){
                    var metric = $(this).val();

                    $('#' + entity + '-timeline').html('');
                    var plotOption = {
                        data: results[entity].VT,
                        container: '#' + entity + '-timeline',
                        width: views.timelines.innerWidth,
                        height: (views.timelines.innerHeight-100) /3,
                        vmap: {
                            color: 'PE',
                            x: 'VT',
                            y: metric
                        },
                        title: entity
                    };

                    // if(entity == 'terminal') plotOption.legend = true;
                    timeLinePlots[entity] = linePlot(plotOption);
                    linkTimeLinePlots();
                    obtainTemporalSummary();
                });
            });


            timeLinePlots['terminal'] = linePlot({
                data: results.terminal.VT,
                container: '#terminal-timeline',
                width: views.timelines.innerWidth,
                height: (views.timelines.innerHeight - 100) /3,
                title: 'terminal',
                // legend: true,
                vmap: {
                    color: 'PE',
                    x: 'VT',
                    y: 'total_data_size'
                }
            });


            timeLinePlots['router'] = linePlot({
                data: results.router.VT,
                container: '#router-timeline',
                width: views.timelines.innerWidth,
                height: (views.timelines.innerHeight - 100) /3,
                title: 'router',
                vmap: {
                    color: 'PE',
                    x: 'VT',
                    y: 'total_traffic'
                },
                colorMap: timeLinePlots.terminal.colorMap
            });

            timeLinePlots['kp'] = linePlot({
                data: results.kp.VT,
                container: '#kp-timeline',
                width: views.timelines.innerWidth,
                height: (views.timelines.innerHeight - 100) /3,
                title: 'kp',
                vmap: {
                    color: 'PE',
                    x: 'VT',
                    y: 'total_rollback'
                },
                colorMap: timeLinePlots['terminal'].colorMap
            })
            linkTimeLinePlots();

            var mergedData = results.kp.KP.map(function(d, i) {
                var obj = d;
                if(obj.KP == results.terminal.KP[i].KP){
                    Object.keys(results.terminal.KP[i]).forEach(function(k){
                        obj[k] = results.terminal.KP[i][k];
                    });
                }
                if(obj.KP == results.router.KP[i].KP){
                    Object.keys(results.router.KP[i]).forEach(function(k){
                        obj[k] = results.router.KP[i][k];
                    });
                }

                return obj;
            })

            var statsVmap = {
                color: 'PE',
                x: 'total_data_size',
                y: 'total_rollback'
            };

            var encodings = ['x', 'y', 'color'];

            encodings.forEach(function(encode){
                Object.keys(mergedData[0])
                .forEach(function(k){
                    $('#stats-' + encode).append($("<option/>").attr('value', k).text(k))
                })
                $('#stats-' + encode).val(statsVmap[encode]);
                $('#stats-' + encode).change(function(v){
                    statsVmap[encode] = $(this).val();

                    $('#stats-scatterplot').html('');
                    scatterPlot({
                        data: mergedData,
                        container: '#stats-scatterplot',
                        width: views.stats.innerWidth,
                        height: views.stats.innerHeight - 100,
                        vmap: statsVmap
                    })
                })
            });

            scatterPlot({
                data: mergedData,
                container: '#stats-scatterplot',
                width: views.stats.innerWidth,
                height: views.stats.innerHeight - 100,
                vmap: {
                    color: 'PE',
                    x: 'total_data_size',
                    y: 'total_rollback'
                }
            })

            obtainTemporalSummary();

            $('.ui.large.modal').modal('toggle');

        }
    })

    return stats;
}
