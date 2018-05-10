export default function Icon(arg) {
    var icon = document.createElement('i'),
        options = arg || {},
        callback = options.onclick ||false,
        type = options.type,
        types = options.types || [],
        title = options.title || options.type || false;

    if(type) types.push(type);
    if(title) icon.title = title;
    icon.className = 'ui icon ' + types.join(' ');
    if(callback) {
         icon.onclick = callback;
         icon.className += ' link';
    }
    icon.change = function(i) {
        icon.className = icon.className.replace(type, d);
    };
    return icon;
}
