import p6 from 'p6';

export default function Terminal(view) {

    var schema =  {
        LP : 'int',
        KP : 'int',
        PE : 'int',
        terminal_id : 'int',
        fin_chunks  : 'int',
        data_size   : 'int',
        fin_hops    : 'int',
        fin_chunks_time : 'float',
        busy_time       : 'float',
        VT              : 'time',
        fwd_events      : 'int',
        rev_events      : 'int'
    };

    return {
        model: 'terminal',

        allocate: function(metadata) {
            return p6.cstore({
                size: metadata.line,
                struct: schema
            });
        },

        preprocess: function(text) {
            return text.map(function(d){
                var row =  d.split(',');
                return row;
            });
        },

        visualize: function(data) {

            var terminals = p6({
                data: data,
                viewport: [1, 1]
            });

            var stats = {};
            stats.KP = terminals
            .aggregate({
                $group: ['KP', 'PE'],
                terminals: {$count: '*'},
                total_data_size: {$sum: 'data_size'},
                total_busy_time: {$sum: 'busy_time'},
                total_forward_events: {$sum: 'fwd_events'},
                total_reverse_events: {$sum: 'rev_events'}
            })
            .result('row');

            stats.VT = terminals
            .head()
            .aggregate({
                $group: ['PE', 'VT'],
                total_data_size: {$sum: 'data_size'},
                total_busy_time: {$sum: 'busy_time'},
                total_forward_events: {$sum: 'fwd_events'},
                total_reverse_events: {$sum: 'rev_events'},
            })
            .result('row');

            stats.LP = terminals
            .head()
            .aggregate({
                $group: ['terminal_id'],
                PE: {$max: 'PE'},
                KP: {$max: 'KP'},
                total_data_size: {$sum: 'data_size'},
                total_busy_time: {$sum: 'busy_time'},
                total_forward_events: {$sum: 'fwd_events'},
                total_reverse_events: {$sum: 'rev_events'},
            })
            .result('row');

            return stats;
        }
    }
}
