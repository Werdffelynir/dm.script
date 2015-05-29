(function(window){

    var Dm = function(param) {
        return new Dm.controller.init(param);
    };

    Dm.private = {};
    Dm.private.hideToggle = true;

    Dm.controller = {

        /** Количество рабочих елементов */
        length: 0,

        /** Рабочие елементы */
        elements: [],

        /** Обрабатываемый селектор */
        selector: null,

        /**
         * Constructor инициализатор
         * @param param
         * @returns {null}
         */
        init: function(param){

            // clear all property
            this.length = 0;
            this.elements = [];
            this.selector = null;

            if(param == 'body' && document.body) {
                this.selector = param;
                this.elements[0] = document.body;
                this.length = 1;
            }
            else if(typeof param === 'string') {

                this.selector = param;
                var node = window.document.querySelectorAll(this.selector);

                if(typeof node === 'object') {
                    if (node.length > 0) {
                        for(var i = 0; i < node.length; i++)
                            this.elements[i] = this[i] = node[i];
                        this.length = node.length;
                    }
                }
            }
            else if(typeof param === 'function'){
                var isReady = false;
                function loadReady(){
                    if(isReady) return;
                    isReady = true;
                    param();
                }
                window.document.addEventListener( "DOMContentLoaded", loadReady, false );
                window.addEventListener('load', loadReady, false);
            }
            else if(typeof param === 'object' && param.nodeType == window.Node.ELEMENT_NODE){
                this.elements[0] = param;
                this.length = 1;
            }
            else
                return null;
        },

        /**
         * Перебор рабочих елементов
         * @param param
         */
        each: function(param){
            if(typeof param === 'function'){
                this.elements.forEach(param);
            }
        },

        /**
         * Возвращает первый обрабатываемый елемент
         * @returns {*}
         */
        node: function(){
            return this.elements[0];
        },

        /**
         * Возвращает массив обрабатываемых елементов
         * @returns {*}
         */
        nodes: function(){
            return this.elements;
        },

        /**
         * Возвращает обект с назначиными в обработку дочерними елементами
         * если указан index назначин будет дочерниий елемент по индексу
         * @param index
         * @returns {Dm.controller}
         */
        children: function(index)
        {
            var nodes = [];
            var elements = [];

            for(var i = 0; i < this.length; i++){
                if(index !== undefined && index >= 0){
                    var children = this.elements[i].children;
                    if(children[index])
                        nodes.push(children[index]);
                }
                else
                    nodes.push(this.elements[i].children);
            }

            if(typeof nodes === 'object' && nodes.length > 0) {
                for(i = 0; i < nodes.length; i++){
                    for(var iIn = 0; iIn < nodes[i].length; iIn++){
                        elements.push(nodes[i][iIn]);
                    }
                }
                this.classParametersInsert(elements,'');
            }
            return this;
        },

        /**
         * Возвращает обект с назначиными в обработку родительским елементом
         * @returns {Dm.controller}
         */
        parent: function() {
            if (this.elements[0].parentNode) {
                var node = this.elements[0].parentNode;
                this.classParametersInsert(node,'');
            }
            return this;
        },

        /**
         * Возвращает обект с переназначеным в обработку первым дочерним елементом
         * @returns {Dm.controller}
         */
        first: function() {
            this.children();
            var node = this.elements[0];
            this.classParametersInsert(node,'');
            return this;
        },

        /**
         * Возвращает обект с переназначеным в обработку последним дочерним елементом
         * @returns {Dm.controller}
         */
        last: function() {
            this.children();
            var node = this.elements[this.length-1];
            this.classParametersInsert(node,'');
            return this;
        },

        /**
         * Возвращает обект с переназначеным в обработку следующим елементом
         * Работает с первым елементом обработки
         * @returns {Dm.controller}
         */
        next: function() {
            var node = this.elements[0].nextElementSibling;
            this.classParametersInsert(node,'');
            return this;
        },

        /**
         * Возвращает обект с переназначеным в обработку предведущим елементом
         * Работает с первым елементом обработки
         * @returns {Dm.controller}
         */
        prev: function() {
            var node = this.elements[0].previousElementSibling;
            this.classParametersInsert(node,'');
            return this;
        },

        /**
         * Возвращает обект. Удаляет елементы обработки или указаный по селектору
         * в обрабатываемых елементах
         * @param param
         * @returns {Dm.controller}
         */
        remove: function(param) {
            if(param != undefined){
                for(var i=0; i<this.length; i++) {
                    var query = this.elements[i].querySelectorAll(param);
                    for(var inn=0; inn<query.length; inn++) {
                        if(typeof query[inn] == 'object' && query[inn].nodeType == Node.ELEMENT_NODE)
                            query[inn].parentNode.removeChild(query[inn]);
                    }
                }
            }
            else{
                for(var i=0; i<this.length; i++) {
                    var parent = this.elements[i].parentNode;
                    if(parent != null && typeof parent === 'object' && parent.nodeType === Node.ELEMENT_NODE)
                        parent.removeChild(this.elements[i]);
                }
            }
            return this;
        },

        /**
         * Возвращает обект. Добавляет param как дочерный елемент в обрабатываемый первый елемент
         * Использует Node.appendChild
         * Работает с первым елементом обработки
         * @param param добавляемый елемент - node, string, Dm обект
         * @param elem  если тип param string создется елемент span или указаный
         * @returns {Dm.controller}
         */
        append: function(param, elem) {
            var appended = null;
            elem = elem || 'span';

            if(typeof param == 'object' && param.nodeType == Node.ELEMENT_NODE) {
                appended = this.elements[0].appendChild(param);
            }
            else if(typeof param == 'object' && param instanceof Dm.controller.init) {
                appended = this.elements[0].appendChild(param.elements[0]);
            }
            else if(typeof param == 'string') {
                var newElem = document.createElement(elem);
                newElem.appendChild(document.createTextNode(param));
                appended = this.elements[0].appendChild(newElem);
            }

            this.classParametersInsert(appended,'');
            return this;
        },

        /**
         * Возвращает обект. Добавляет param как дочерный елемент перед обрабатываемым первым елементом
         * Использует Node.insertBefore
         * Работает с первым елементом обработки
         * @param param
         * @param elem
         * @returns {Dm.controller}
         */
        insert: function(param, elem) {
            elem = elem || 'span';
            var parent = this.elements[0].parentNode;
            var element = this.elements[0];
            var inserted = null;

            if(typeof param == 'object' && param.nodeType == Node.ELEMENT_NODE) {
                inserted = parent.insertBefore(param, element);
            }
            else if(typeof param == 'object' && param instanceof Dm.controller.init) {
                inserted = parent.insertBefore(param.elements[0], element);
            }
            else if(typeof param == 'string'){
                var newElem = document.createElement(elem);
                newElem.appendChild(document.createTextNode(param));
                inserted = parent.insertBefore(newElem, element);
            }

            this.classParametersInsert(inserted,'');
            return this;
        },

        /**
         * Возвращает обект. Добавляет param после всех обрабатываемых елементов
         * Работает с всеми елементами обработки
         * @param param
         * @returns {Dm.controller}
         */
        after: function(param){
            var i = 0;
            if(typeof param == 'object' && param.nodeType == Node.ELEMENT_NODE){
                for(i = 0; i < this.elements.length; i++)
                    this.htmlAfter(param.outerHTML);
            }
            else if(typeof param == 'object' && param instanceof Dm.controller.init){
                var html = '';
                for(i = 0; i < param.length; i++)
                    html += param.elements[i].outerHTML;
                this.htmlAfter(html);
            }
            else if(typeof param == 'string'){
                this.htmlAfter(param);
            }
            return this;
        },

        /**
         * Возвращает обект. Добавляет param перед всеми елементами обработки
         * @param param
         * @returns {Dm.controller}
         */
        before: function(param){
            var i = 0;
            if(typeof param == 'object' && param.nodeType == Node.ELEMENT_NODE){
                for(i = 0; i < this.elements.length; i++)
                    this.htmlBefore(param.outerHTML);
            }
            else if(typeof param == 'object' && param instanceof Dm.controller.init){
                var html = '';
                for(i = 0; i < param.length; i++)
                    html += param.elements[i].outerHTML;
                this.htmlBefore(html);
            }
            else if(typeof param == 'string'){
                this.htmlBefore(param);
            }
            return this;
        },

        /**
         * Возвращает обект. Добавляет HTML param после елементов обработки
         * Работает с всеми елементами обработки
         * @param param
         * @returns {Dm.controller}
         */
        htmlAfter: function(param){
            for(var i = 0; i < this.elements.length; i++){
                if(this.elements[i].parentNode)
                    this.elements[i].outerHTML = this.elements[i].outerHTML + param;
            }
            return this;
        },

        /**
         * Возвращает обект. Добавляет HTML param перед елементами обработки
         * Работает с всеми елементами обработки
         * @param param
         * @returns {Dm.controller}
         */
        htmlBefore: function(param){
            for(var i = 0; i < this.elements.length; i++){
                if(this.elements[i].parentNode)
                    this.elements[i].outerHTML = param + this.elements[i].outerHTML;
            }
            return this;
        },

        /**
         * Возвращает обект. Перемещает первый елемент обработки с елементом param
         * Работает с первым елементом обработки
         * @param param
         * @returns {Dm.controller}
         */
        replace: function(param){
            var parent = this.elements[0].parentNode;
            parent.replaceChild(this.elements[0], param);
            return this;
        },

        /**
         * Возвращает склонированый первый елемент обработки
         * @param deep если true клонируется полный елемент
         * @returns {Node}
         */
        clone: function(deep){
            var param = (deep == true || deep == undefined) ? true : false;
            return this.elements[0].cloneNode(param);
        },


        /**
         * Возвращает обект this. Получить или установить текстовый контент с первого елемента обработки
         * Работает с первым елементом обработки
         * @param param
         * @returns {*}
         */
        text:function(param){
            if(param === undefined)
                return this.elements[0].textContent;
            else if(this.elements[0] !== undefined)
                this.elements[0].textContent = param;
            return this;
        },

        /**
         * Возвращает обект this. Получить или установить HTML контент с первого елемента обработки
         * Работает с первым елементом обработки
         * @param param
         * @returns {*}
         */
        html:function(param){
            if(param === undefined)
                return this.elements[0].innerHTML;
            else if(this.elements[0] !== undefined)
                this.elements[0].innerHTML = param;
            return this;
        },

        /**
         * Возвращает обект this. Получить или установить атрибут(ы) первого елемента обработки
         * Работает с первым елементом обработки
         * @param key
         * @param val
         * @returns {*}
         */
        attr:function(key, val){
            if(key === undefined && val === undefined)
                return this.elements[0].attributes;
            else if(val === undefined)
                return this.elements[0].getAttribute(key);
            else
                this.elements[0].setAttribute(key, val);
            return this;
        },

        /**
         * Возвращает обект this. Удалет указаный атрибут param первого елемента обработки
         * Работает с первым елементом обработки
         * @param param
         * @returns {Dm.controller}
         */
        attrRemove: function(param){
            this.elements[0].removeAttribute(param);
            return this;
        },

        /**
         * Проверяет на существование атрибута param в первом елементе обработки
         * Работает с первым елементом обработки
         * @param param
         * @returns {boolean}
         */
        attrHas: function(param){
            return this.elements[0].hasAttribute(param);
        },

        /**
         * Возвращает обект this. Добавляет css стиль к всем елементам
         * Использует elem.style.cssText
         * Работает с всеми елементами обработки
         * @param param
         */
        css: function(param){
            if(this.length > 0){
                for(var i = 0; i < this.length; i++)
                    this.elements[i].style.cssText = param;
            }
            return this;
        },

        /**
         * Возвращает обект this. Добавляет css стиль к всем елементам
         * Использует elem.style.param
         * @param param
         * @param value
         */
        addCss: function(param, value){

        },

        /**
         * Возвращает обект this. Прячит елементы обработки
         * Использует elem.style.display = 'none'
         * Работает с всеми елементами обработки
         */
        hide: function(){
            if(this.length > 0){
                for(var i = 0; i < this.length; i++)
                    this.elements[i].style.display = 'none';
            }
            return this;
        },

        /**
         * Возвращает обект this. Прячет. показывает (переключатель) все елементы обработки
         * Использует elem.style.display = 'none'
         * Работает с всеми елементами обработки
         */
        hideToggle: function(){
            if(this.length > 0){
                var i = 0;
                if(Dm.private.hideToggle) {
                    Dm.private.hideToggle = false;
                    for(i=0; i<this.length; i++)
                        this.elements[i].style.display = 'none';
                }
                else{
                    Dm.private.hideToggle = true;
                    for(i=0; i<this.length; i++)
                        this.elements[i].style.display = '';
                }
            }
            return this;
        },

        /**
         * Возвращает обект this. Добавляет указаный класс param во все елементы обработки
         * Использует elem.classList
         * Работает с всеми елементами обработки
         * @param param
         * @returns {Dm.controller}
         */
        class: function(param){
            if(this.length > 0){
                for(var i = 0; i < this.length; i++)
                    this.elements[i].classList.add(param);
            }
            return this;
        },

        /**
         * Возвращает обект this. Удаляет указаное значение атрибута class
         * Использует elem.classList
         * Работает с всеми елементами обработки
         * @param param
         * @returns {Dm.controller}
         */
        classRemove: function(param){
            if(this.length > 0){
                for(var i = 0; i < this.length; i++)
                    this.elements[i].classList.remove(param);
            }
            return this;
        },

        /**
         * Возвращает обект this. Переключатель. Удаляет/Добавляет указаное значение атрибута class
         * Использует elem.classList
         * Работает с всеми елементами обработки
         * @param param
         * @returns {Dm.controller}
         */
        classToggle: function(param){
            if(this.length > 0){
                for(var i = 0; i < this.length; i++)
                    this.elements[i].classList.toggle(param);
            }
            return this;
        },

        /**
         * Возвращает булевое значение. Проверяет на сущестование указаного класса в первом елементе обработки
         * Использует elem.classList
         * Работает с первым елементамом обработки
         * @param param
         * @returns {boolean}
         */
        classHas: function(param){
            return this.elements[0].classList.contains(param);
        },

        /**
         * Возвращает массив, все значение атребута class
         * Использует elem.classList
         * Работает с первым елементамом обработки
         * @returns {Array}
         */
        classAll: function(){
            var classes = [];
            if(this.elements[0].classList.length > 0)
                for(var i=0; i<this.elements[0].classList.length; i++)
                    classes[i] = this.elements[0].classList[i];
            return classes;
        },


        /**
         * Прикрепляет слушатель событий к всем елементам обработки
         * Работает с всеми елементами обработки
         * @param type
         * @param listener
         * @param useCapture
         */
        eventAdd: function(type,listener,useCapture){
            if(this.length > 0){
                for(var i = 0; i < this.length; i++)
                    this.elements[i].addEventListener(type,listener,useCapture);
            }
        },

        /**
         * Удаляет слушатель событий из всех елементов обработки
         * Работает с всеми елементами обработки
         * @param type
         * @param listener
         * @param useCapture
         */
        eventDel: function(type,listener,useCapture){
            if(this.length > 0){
                for(var i = 0; i < this.length; i++)
                    this.elements[i].removeEventListener(type,listener,useCapture);
            }
        },

        /**
         * Базовые методы событий
         * @param func
         */
        click: function(func){ this.eventAdd('click',func,false); },
        mouseover: function(func){ this.eventAdd('mouseover',func,false); },
        mousedown: function(func){ this.eventAdd('mousedown',func,false); },
        mouseup: function(func){ this.eventAdd('mouseup',func,false); },
        select: function(func){ this.eventAdd('select',func,false); },
        change: function(func){ this.eventAdd('change',func,false); },
        input: function(func){ this.eventAdd('input',func,false); },
        submit: function(func){ this.eventAdd('submit',func,false); },
        focus: function(func){ this.eventAdd('focus',func,false); },
        keydown: function(func){ this.eventAdd('keydown',func,false); },
        keyup: function(func){ this.eventAdd('keyup',func,false); },

        /**
         * Очищает параметры
         */
        classParametersClear: function() {
            for(var i=0; i<this.length; i++){
                delete this[i];
                delete this.elements[i];
            }
            this.length = 0;
            this.elements.length = 0;
        },

        /**
         * Назначает параметры
         * @param elements
         * @param selector
         */
        classParametersInsert: function(elements, selector) {
            if( !elements.hasOwnProperty('length') ) elements = [elements];
            var elementsCopy = elements.slice();
            this.classParametersClear();
            var length = elementsCopy.length;
            for(var i=0; i<length; i++)
                this[i] = this.elements[i] = elementsCopy[i];
            if( selector != undefined) this.selector = selector;
            this.length = length;
        },

        toString: function(){
            return this.toString('Dm');
        }
    };

    Dm.all = function(param){};

    /**
     *
     * @param param
     * @returns {*}
     */
    Dm.getFirstchild = function(param){
        if(typeof param == 'object' && param.nodeType == Node.ELEMENT_NODE){
            var node = param.firstChild;
            while(node != null && node.nodeType != Node.ELEMENT_NODE){
                node = node.nextSibling;
            }
            return node;
        }
        return null;
    };

    /**
     *
     * @param param
     * @returns {*}
     */
    Dm.getLastchild = function(param){
        if(typeof param == 'object' && param.nodeType == Node.ELEMENT_NODE){
            var node = param.lastChild;
            while(node != null && node.nodeType != Node.ELEMENT_NODE){
                node = node.previousSibling;
            }
            return node;
        }
        return null;
    };

    /**
     *
     * @param param
     * @returns {*}
     */
    Dm.getNextSibling = function(param){
        if(typeof param == 'object' && param.nodeType == Node.ELEMENT_NODE){
            var node = param.nextSibling;
            while(node != null && node.nodeType != Node.ELEMENT_NODE){
                node = node.nextSibling;
            }
            return node;
        }
        return null;
    };

    /**
     *
     * @param param
     * @returns {*}
     */
    Dm.getPreviousSibling = function(param){
        if(typeof param == 'object' && param.nodeType == Node.ELEMENT_NODE){
            var node = param.previousSibling;
            while(node != null && node.nodeType != Node.ELEMENT_NODE){
                node = node.previousSibling;
            }
            return node;
        }
        return null;
    };

    /**
     *
     * @param param
     * @returns {*}
     */
    Dm.getParentNode = function(param){
        if(typeof param == 'object' && param.nodeType == Node.ELEMENT_NODE){
            return param.parentNode;
        }
        return null;
    };

    /**
     *
     * @param param
     * @returns {*}
     */
    Dm.getChildNodes = function(param){
        if(typeof param == 'object' && param.nodeType == Node.ELEMENT_NODE){
            var childs = param.childNodes;
            var nodes = [];
            if(childs != null && childs.length > 0) {
                for(var i=0; i<childs.length; i++){
                    if(typeof childs[i] == 'object' && childs[i].nodeType == Node.ELEMENT_NODE){
                        nodes.push(childs[i]);
                    }
                }
            }
            return nodes;
        }
        return null;
    };

    /**
     * Возврящает созданый Node елемент element 'div', добавляет атрибуты attr {id:'my-id'},
     * помещает в елемент все поледующие аргументы
     * @param element   по умолчанию 'div'
     * @param attr      атрибуты в виде обекта {id:'my-id'}
     * @param ...       контент добавляемый в element
     * @returns {HTMLElement}
     */
    Dm.createNode = function(element, attr) {
        element = element || 'div';
        if(typeof attr !== 'object') attr = {};
        var elem = document.createElement(element);
        if(arguments.length > 1){
            for(var i=2; i<arguments.length; i++){
                if(typeof arguments[i] === 'string') elem.innerHTML += arguments[i];
                else if(typeof arguments[i] === 'object' && arguments[i].nodeType == Node.ELEMENT_NODE)
                    elem.innerHTML += arguments[i].outerHTML;
            }
        }
        for(var key in attr)
            elem.setAttribute(key,attr[key]);
        return elem;
    };

    Dm.controller.init.prototype = Dm.controller;
    window.Dm = Dm;

})(window);