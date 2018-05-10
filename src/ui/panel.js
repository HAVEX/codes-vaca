export default function Panel(arg) {
    'use strict';
    var panel,
        option = arg || {},
        container = option.container || document.body,
        header = option.header || null,
        title = option.title || "",
        margin = option.margin || 5,
        style = option.style || {},
        padding = option.padding || 0,
        types = option.types || [],
        classNames = 'panel ui segment',
        angularJS = option.AngularJS || option.angularJS || false,
        headerHeight;

    if (container) {
        container = (typeof(container) == "string") ? document.getElementById(container) : container;
    }

    if (option.id) {
        panel = document.getElementById(option.id);
        if (panel === null) {
            panel = document.createElement("div");
            panel.setAttribute('id', option.id);
            container.appendChild(panel);
        }
    } else {
        panel = document.createElement("div");
        container.appendChild(panel);
    }

    var fullScreen = false,
        width = option.width || container.clientWidth,
        height = option.height || container.clientHeight;

    width -= margin * 2;
    height -= margin * 2;

    panel.className = "ui";
    panel.style.margin = margin + 'px';

    panel.style.width = width + "px";
    panel.style.height = height + "px";
    // panel.style.boxSizing = 'border-box';

    if (header) {
        headerHeight = option.header.height || 0.08 * height;
        if (headerHeight < 1) headerHeight *= height;
        panel.header = document.createElement('div');
        panel.header.className = "ui top attached block header primary";
        panel.header.style.backgroundColor = "#FFFFFF";
        panel.header.style.height = headerHeight + "px";
        panel.header.style.width = width + "px";
        panel.header.style.fontSize = headerHeight * 0.36 + 'px';

        if (option.header.hasOwnProperty('style')) {
            Object.keys(option.header.style).forEach(function(s) {
                panel.header.style[s] = option.header.style[s];
            });
        }
        panel.header.style.padding = 0;
        panel.header.style.paddingLeft = panel.header.style.fontSize;

        var panelTitle = document.createElement('span');
        panelTitle.innerHTML = title;
        panelTitle.style.float = 'left';
        panelTitle.style.marginTop = (headerHeight * 0.25) + 'px';

        panel.header.appendChild(panelTitle);
        panel.appendChild(panel.header);
        Object.defineProperty(panel, "title", {
            get: function() {
                return title;
            },
            set: function(title) {
                panelTitle.innerHTML = title;
            }
        });
        classNames += ' bottom attached';

        if (Array.isArray(option.header.controls)) {
            option.header.controls.forEach(function(ctrl) {
                panel.header.appendChild(ctrl);
            })
        }

        var controls = document.createElement('div');
        controls.style.float = 'right';
        controls.style.marginTop = (headerHeight * 0.25) + 'px';
        controls.style.marginRight = panel.header.style.fontSize;
        panel.header.appendChild(controls)


        panel.header.append = function(elem) {
            if (typeof elem == 'string')
                controls.innerHTML += elem;
            else
                controls.appendChild(elem);
            return panel;
        };

    } else {
        headerHeight = 0;
    }

    panel.body = document.createElement("div");
    panel.body.className = classNames + ' panel-body ' + types.join(' ');
    panel.body.style.width = width + "px";
    panel.body.style.height = height - headerHeight + "px";
    panel.body.style.padding = padding + 'px';
    if (option.hasOwnProperty('style')) {

        Object.keys(option.style).forEach(function(s) {
            panel.body.style[s] = option.style[s];
        });
    }

    panel.appendChild(panel.body);

    if(option.id)
        panel.body.setAttribute('id', option.id+"-body");
    panel.innerWidth = width - padding * 2;
    panel.innerHeight = height - headerHeight - padding * 2;

    if (angularJS && angularJS.hasOwnProperty('ng-controller')) {
        panel.setAttribute('ng-controller', angularJS['ng-controller']);
        panel.body.setAttribute(angularJS['view'], '');
        panel.body.setAttribute('id', angularJS['id'])
    }

    panel.showLoading = function() {
        if((' ' + panel.body.className + ' ').indexOf(' loading ') === -1)
            panel.body.className += ' loading';
    };

    panel.hideLoading = function() {
        panel.body.className = panel.body.className.replace(/\bloading\b/, '');
    };

    panel.toggleLoading = function() {
        if((' ' + panel.body.className + ' ').indexOf(' loading ') === -1)
            panel.body.className += ' loading';
        else
            panel.hideLoading();
    };

    panel.append = function(child) {
        if (typeof child == 'string')
            panel.body.innerHTML += child;
        else
            panel.body.appendChild(child);
        return panel;
    };

    panel.clear = function() {
        panel.body.innerHTML = "";
    };

    panel.update = function(domArray) {
        panel.clear();
        panel.body.appendChild(domArray);
    };


    panel.toggleFullScreen = function() {
        if (!fullScreen) {
            panel.style.position = 'fixed';
            panel.style.top = '1px';
            panel.style.left = '1px';
            panel.style.zIndex = 9999;
            panel.resize(document.body.clientWidth, document.body.clientHeight);
        } else {
            panel.style.position = 'relative';
            panel.style.zIndex = 0;
            panel.resize(container.clientWidth - margin * 2, container.clientHeight - margin * 2);
        }

        fullScreen = !fullScreen;

    }

    panel.resize = function(w, h) {
        if (typeof w == 'undefined' || typeof h == 'undefined') {
            width = container.clientWidth;
            height = container.clientHeight;
        } else {
            width = w;
            height = h;
        }

        panel.style.width = width + "px";
        panel.style.height = height + "px";
        panel.body.style.width = width + "px";
        panel.body.style.height = height - headerHeight + "px";
        if (header) {
            panel.header.style.height = headerHeight + "px";
            panel.header.style.width = width + "px";
        }
    }


    return panel;
}
