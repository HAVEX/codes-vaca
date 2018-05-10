export default function List(arg) {
    var list= document.createElement('div'),
        options = arg || {},
        container = options.container || document.body,
        type = options.type,
        selectedColor = options.selectedColor || 'black',
        selectedIcon = options.selectedIcon || '',
        types = options.types || [];

    if(type) types.push(type);
    if(container) container.appendChild(list);
    list.className = 'ui list ' + types.join(' ');
    var items = [];

    let setSelected = (itemId, selected) => {
        if (selected == items[itemId]._selected) {
            return;
        }
        if (selected) {
            items[itemId]._selected = true;
            items[itemId].className += ' selected';
            if(items[itemId].hasOwnProperty('icon'))
                items[itemId].icon.className +=
                        ' ' + selectedColor + ' ' + selectedIcon;
            return;
        }
        items[itemId]._selected = false;
        items[itemId].className =
                items[itemId].className.replace('selected', '');
        if(items[itemId].hasOwnProperty('icon'))
            items[itemId].icon.className =
                    items[itemId].icon.className.replace(
                        selectedColor + ' ' + selectedIcon, '');
    };

    list.onselect = options.onselect || function() {};
    var onSelect = function(itemId) {
        if (types.indexOf('single') !== -1) {
            // single selection only
            list.clearSelected();
            setSelected(itemId, true);
        } else {
            // multiple selection
            setSelected(itemId, !items[itemId]._selected);
        }
        list.onselect.call(items[itemId], itemId);
    };

    list.append = function(li) {
        var item = document.createElement('div'),
            content = document.createElement('div');
        item.className = 'item';
        content.className = 'content';

        if(li.hasOwnProperty('icon')) {
            var icon = document.createElement('i');
            icon.className = li.icon + ' icon';
            item.appendChild(icon);
            item.icon = icon;
        }

        if(li.hasOwnProperty('img')) {
            var img = document.createElement('img');
            img.className ='ui avatar iamge';
            img.src = li.img;
            item.appendChild(img);
        }

        if(li.hasOwnProperty('header')) {
            var header = document.createElement('div');
            header.innerHTML = li.header;
            content.appendChild(header);
        }

        if(li.hasOwnProperty('text')) {
            // var text = document.createElement('div');
            content.innerHTML += li.text;
            // content.appendChild(text);
        }
        item.appendChild(content);
        var itemId = items.length;
        item._selected = false;
        items.push(item);
        list.appendChild(item);

        if(types.indexOf('selection') !== -1){
            item.onclick = onSelect.bind(this, itemId);
        }

        return list;
    };

    list.setSelectedItemIds = ids => {
        list.clearSelected();
        ids.forEach(id => {
            setSelected(id, true);
        });
    };

    list.clearSelected = () => {
        items.forEach((item, id) => {
            setSelected(id, false);
        });
    };

    list.getSelectedItemIds = function() {
        return items
            .map((d, i) => d._selected === true ? i : -1)
            .filter(id => id >= 0);
    };

    list.get = function(i) {
        return items[i];
    };

    list.select = function(i) {
        onSelect(i);
    };

    list.clear = function() {
        items = [];
        list.innerHTML = '';
    };

    list.remove = function(i) {
        list.removeChild(items[i]);
        return list;
    };

    return list;
}
