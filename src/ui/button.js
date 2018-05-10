export default function Button(arg) {
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
        fileInput = options.fileInput || false,
        value = options.value || null,
        types = options.types || [];

    if(type) types.push(type);
    types.push('ui button');
    button.className = types.join(' ');
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

    if(value !== null) {
        button.setAttribute('value', value);
    }

    if(fileInput) {
        var input = document.createElement('input'),
            inputName = fileInput.name || 'files[]';

        input.setAttribute('type', 'file');
        input.setAttribute('multiple', '');
        if(fileInput.hasOwnProperty('id')){
            input.setAttribute('id', fileInput.id);
        }
        input.style.display = 'none';
        if(typeof fileInput.onchange === 'function') {
            input.addEventListener('change', function(evt) {
                // fileInput.onchange(evt.target.files);
                fileInput.onchange(evt);
                return false;
            }, false);
        }

        button.appendChild(input);
        button.onclick = function(evt) {
            input.click();
            return false;
        }

        button.fileInput = input;
    }

    if(text !== null) button.innerHTML += text;
    if(fontSize !== null) button.style.fontSize = fontSize;
    if(title) button.title = title;
    if(container) container.appendChild(button);

    button.showLoading = function() {
        if((' ' + button.className + ' ').indexOf(' loading ') === -1)
            button.className += ' loading';
    }

    button.hideLoading = function() {
        button.className = button.className.replace(/\bloading\b/, '');
    }

    button.toggleLoading = function() {
        if((' ' + button.className + ' ').indexOf(' loading ') === -1)
            button.className += ' loading';
        else
            button.hideLoading();
    }


    return button;
}
