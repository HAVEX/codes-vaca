export default function Radios(arg) {
    var radios = document.createElement('div'),
        options = arg || {},
        container = options.container || document.body,
        data = options.data || [],
        name = options.name || options.variable || "",
        field = options.field || 'inline',
        callback = options.onchange || function() {},
        text = options.text || options.label || null,
        icon = options.icon || false,
        title = options.title || false,
        type = options.type,
        checked = options.checked || null,
        types = options.types || [];

    var choice = null;

    if(type) types.push(type);
    var wrapper = document.createElement('div'),
        label = document.createElement('label');

    wrapper.className = 'ui form';
    radios.className = field + ' fields';
    label.innerHTML = text;
    radios.appendChild(label);

    data.forEach(function(d){
        var box = document.createElement('div'),
            field = document.createElement('div'),
            label = document.createElement('label'),
            input = document.createElement('input');

        field.className = 'field';
        box.className = 'ui radio checkbox';
        label.innerHTML = d;
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'test');
        input.setAttribute('value', d);
        input.setAttribute('tabindex', '0');
        if(checked == d) input.setAttribute('checked', 'checked');
        input.className = 'hidden';
        input.onchange = function() {
             callback(this.value);
        };

        box.appendChild(label);
        box.appendChild(input);
        field.appendChild(box)
        radios.appendChild(field);
    });

    wrapper.appendChild(radios);

    if(container) container.appendChild(wrapper);

    var jquery = window.jQuery || jQuery || $;
    if(typeof jquery !== 'undefined') {
        jquery('.ui.radio.checkbox').checkbox();
    }

    Object.defineProperty(wrapper, 'onchange', {
        set: function(f) { callback = f; return radios; }
    });

    return wrapper;
}
