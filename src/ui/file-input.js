export default function FileInput(arg) {
    var button;
    if(typeof arguments[0] === 'function') {
        button = arguments[0](arg);
    } else {
        button = Button(arg);
    }

    var button = document.createElement('div'),
        options = arg || {},
        container = options.container || document.body,
        callback = options.onclick || function() {},
        text = options.text || options.label || null,
        icon = options.icon || false,
        title = options.title || false,
        type = options.type,
        fontSize = options.fontSize || options.size || null,
        background = options.background || null,
        types = options.types || [];

    if(type) types.push(type);
    button.className = 'ui button ' + types.join(' ');
    button.onclick = callback;
    button.style.textAlign = 'center';
    button.style.verticalAlign = 'top';

    if(icon) {
        var i = document.createElement('i');
        i.className = icon + ' icon';
        i.style.marginRight = "10px";
        button.className += ' icon';
        button.appendChild(i);
    }
    if(text !== null) button.innerHTML += text;
    if(fontSize !== null) button.style.fontSize = fontSize;
    if(title) button.title = title;
    if(container) container.appendChild(button);

    return button;
}
