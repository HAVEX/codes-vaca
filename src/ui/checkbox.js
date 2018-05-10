export default function Checkbox(arg) {
    var checkbox = document.createElement('div'),
        options = arg || {},
        container = options.container || document.body,
        name = options.name || options.variable || "",
        callback = options.onchange ||  function() {},
        text = options.text || options.label || null,
        type = options.type,
        types = options.types || [];

    if(type) types.push(type);
    var input = document.createElement('input'),
        label = document.createElement('label');

    checkbox.className = 'ui checkbox ' + types.join(' ');
    checkbox.style.margin = '10px';
    label.innerHTML = text;
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', name);
    input.onchange = callback;

    checkbox.appendChild(label);
    checkbox.appendChild(input);

    if(container) container.appendChild(checkbox);

    var jquery = window.jQuery || jQuery || $;
    if(typeof jquery !== 'undefined') {
        jquery('.ui.checkbox').checkbox();
    }

    Object.defineProperty(checkbox, 'onchange', {
        set: function(f) { callback = f; }
    })

    return checkbox;
}
