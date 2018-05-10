export default function Progress(arg) {
    var div = document.createElement('div'),
        bar = document.createElement('div'),
        progress = document.createElement('div'),
        label = document.createElement('div'),
        options = arg || {},
        container = options.container || null,
        percent = options.percentage || 0,
        type = options.type,
        text = options.text || '',
        types = options.types || [];

    if(type) types.push(type);
    div.className = 'ui progress ' + types.join(' ');

    progress.className = 'progress';
    bar.className = 'bar';
    label.className = 'label';


    label.innerHTML = text;
    bar.appendChild(progress);
    div.appendChild(bar);
    div.appendChild(label);
    if(container) container.appendChild(div);

    var jquery = window.jQuery || $;

    Object.defineProperty(div, 'percent', {
        set: function(f) {
            percent = f;
            setPercentage(percent);
            return div;
        }
    });

    function setPercentage() {
        if(typeof jquery == 'function') {
            jquery(div).progress({percent: percent});
        }
    }

    setPercentage(percent);

    div.hide = function() {
        div.style.display = 'none';
    };

    div.show = function() {
        div.style.display = 'block';
    };

    div.label = function(text) {
        label.innerHTML = text;
    };

    return div;
}
