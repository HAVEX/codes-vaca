import p6 from 'p6';

export default function Router(view) {
    return {
        model: 'router',

        preprocess: function(text) {
            return text.map(function(d){
                var row =  d.split(',');
                var result = row.slice(0, 7); //get the first 7 columns which are not sat.time or traffic
                var metrics = 7 + (row.length-7) / 2;
                result.push( row.slice(7, metrics).reduce((a,b) => a+b) );
                result.push( row.slice(metrics).reduce((a,b) => parseFloat(a)+parseFloat(b)) );
                return result;
            });
        },

        allocate: function(metadata) {
            return p6.cstore({
                size: metadata.line,
                struct: {
                    LP : 'int',
                    KP : 'int',
                    PE : 'int',
                    router_id  : 'int',
                    VT   : 'time',
                    fwd_events : 'int',
                    rev_events : 'int',
                    total_sat_time : 'float',
                    total_traffic  : 'float'
                }
            });
        },

        visualize: function(data) {
            var routers = p6({
                data: data,
                viewport: [1, 1]
            });

            var stats = {};

            stats.KP = routers
            .aggregate({
                $group: ['KP', 'PE'],
                routers: {$count: '*'},
                total_traffic_KB: {$sum: 'total_traffic'},
                total_sat_time: {$sum: 'total_sat_time'},
                total_forward_events: {$sum: 'fwd_events'},
                total_reverse_events: {$sum: 'rev_events'},
            })
            .result('row');

            stats.VT = routers
            .head()
            .aggregate({
                $group: ['PE', 'VT'],
                total_traffic: {$sum: 'total_traffic'},
                total_sat_time: {$sum: 'total_sat_time'},
                total_forward_events: {$sum: 'fwd_events'},
                total_reverse_events: {$sum: 'rev_events'},
            })
            .result('row');

            stats.LP = routers
            .head()
            .aggregate({
                $group: ['LP'],
                PE: {$max: 'PE'},
                KP: {$max: 'KP'},
                total_traffic: {$sum: 'total_traffic'},
                total_sat_time: {$sum: 'total_sat_time'},
                total_forward_events: {$sum: 'fwd_events'},
                total_reverse_events: {$sum: 'rev_events'},
            })
            .result('row');

            return stats;
        }
    }
}
