export default function Dropdown(arg) {
    var dropdown = document.createElement('div'),
        wrapper = document.createElement('div');
        options = arg || {},
        container = options.container || null,
        type = options.type,
        id = options.id || false,
        label = options.label,
        items = options.items || options.menu || [],
        types = options.types || [];

    if(type) types.push(type);
    if(id) dropdown.setAttribute('id', id);
    dropdown.className = 'ui buttons ' + types.join(' ');

    if(container) container.appendChild(dropdown);
    var icon = document.createElement('div'),
        menu = document.createElement('div');

    dropdown.className = 'ui compact menu';
    wrapper.className = 'ui simple dropdown item'

    icon.className = 'dropdown icon';
    menu.className = 'menu';

    wrapper.appendChild(document.createTextNode(label));
    wrapper.appendChild(icon);
    wrapper.appendChild(menu);
    dropdown.appendChild(wrapper);

    dropdown.append = function(items) {
        if(!Array.isArray) items = [items];
        items.forEach(function(item){
            var label = item.label || item.name || '',
                callback = item.onclick || function(){};
            var itemDiv = document.createElement('div'),
                ic = document.createElement('i'),
                text = document.createTextNode(label);
            ic.className = item.icon + ' icon';
            itemDiv.appendChild(ic);
            itemDiv.appendChild(text);
            itemDiv.onclick = callback.bind(this, arg);
            itemDiv.className = 'item';
            menu.appendChild(itemDiv);
        })
    }
    dropdown.menu = function(items) {
        dropdown.append(items);
    }

    dropdown.menu(items);

    return dropdown;
}
