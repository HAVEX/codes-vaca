export default function ButtonGroup(arg) {
    var buttonGroup = document.createElement('div'),
        options = arg || {},
        buttons = options.buttons || [],
        container = options.container || null,
        type = options.type,
        id = options.id || false,
        types = options.types || [];

    if(type) types.push(type);
    if(id) buttonGroup.setAttribute('id', id);
    buttonGroup.className = 'ui buttons ' + types.join(' ');
    function addButtons(buttons) {
        buttons.forEach(function(b) {
            buttonGroup.appendChild(b);
        });
    }
    addButtons(buttons);

    if(container) container.appendChild(buttonGroup);

    buttonGroup.add = function(buttons) {
        if(Array.isArray(buttons)) buttons = [buttons];
        addButtons(buttons);
    }
    buttonGroup.append = buttonGroup.add;

    if(types.indexOf('dropdown')!==-1) {
        var dropdown = document.createElement('div'),
            icon = document.createElement('div'),
            menu = document.createElement('div');

        dropdown.className = 'ui floating dropdown icon button';
        icon.className = 'dropdown icon';
        menu.className = 'menu';

        dropdown.appendChild(icon);
        dropdown.appendChild(menu);
        buttonGroup.appendChild(dropdown);

        buttonGroup.menu.append = function(items) {
            items.forEach(function(item){
                var label = item.label || item.name || '',
                    callback = item.onclick || function(){};
                var itemDiv = document.createElement('div'),
                    ic = document.createElement('i'),
                    text = document.createTextNode(label);
                ic.className = item.icon + ' icon';
                itemDiv.appendChild(ic);
                itemDiv.appendChild(text);
                itemDiv.onclick = callback.call(this, arg);
                itemDiv.className = 'item';
                menu.appendChild(itemDiv);
            })
        }
    }

    return buttonGroup;
}
