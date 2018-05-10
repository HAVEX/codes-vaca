import p6 from 'p6';

export default function KP(view) {
    return {
        model: 'kp',
        
        preprocess: function(text) {
            return text.map(function(d){
                var row =  d.split(',');
                return row;
            });
        },

        allocate: function(metadata) {
            return p6.cstore({
                size: metadata.line,
                struct: {
                    KP                 : "int",
                    PE                 : "int",
                    VT                 : "time",
                    RT                 : "time",
                    time_ahead_gvt     : "float",
                    total_rollback     : "int",
                    primary_rollback   : "int",
                    secondary_rollback : "int"
                }
            });
        },

        visualize: function(data) {
            var kps = p6({
                data: data,
                // container: 'stats-scatterplot',
                viewport: [1,1]
            });

            var stats = {};

            // kps.visualize({
            //     mark: 'dot ',
            //     x: 'VT',
            //     y: 'RT',
            //     opacity: 'total_rollback',
            //     perpcetual: 1
            // })

            stats.VT = kps.aggregate({
                $group: ['PE', 'VT'],
                // real_time: {$max: 'RT'},
                total_rollback: {$sum: 'total_rollback'},
                primary_rollback : {$sum: 'primary_rollback'},
                secondary_rollback: {$sum: 'secondary_rollback'},
                time_ahead_gvt : {$sum: 'time_ahead_gvt'}
            })
            .result('row');

        stats.KP = kps
            .head()
            .aggregate({
                $group: ['KP', 'PE'],
                total_rollback: {$sum: 'total_rollback'},
                primary_rollback: {$sum: 'primary_rollback'},
                secondary_rollback: {$sum: 'secondary_rollback'},
                time_ahead_gvt : {$sum: 'time_ahead_gvt'}
            })
            .result('row');

            console.log(stats);
            return stats;
        }
    };
}

