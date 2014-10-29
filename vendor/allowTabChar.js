(function($) {
    function pasteIntoInput(el, text) {
        el.focus();
        if (typeof el.selectionStart == "number") {
            var val = el.value;
            var selStart = el.selectionStart;
            el.value = val.slice(0, selStart) + text + val.slice(el.selectionEnd);
            el.selectionEnd = el.selectionStart = selStart + text.length;
        } else if (typeof document.selection != "undefined") {
            var textRange = document.selection.createRange();
            textRange.text = text;
            textRange.collapse(false);
            textRange.select();
        }
    }

    function allowTabChar(el, config) {
        $(el).keydown(function(e) {
            if (e.which == 9) {
                pasteIntoInput(this, config.tabsToSpaces === true ? "    " : "\t");
                return false;
            }
        });

        // For Opera, which only allows suppression of keypress events, not keydown
        $(el).keypress(function(e) {
            if (e.which == 9) {
                return false;
            }
        });
    }

    $.fn.allowTabChar = function(config) {
        if (this.jquery) {
            this.each(function() {
                if (this.nodeType == 1) {
                    var nodeName = this.nodeName.toLowerCase();
                    if (nodeName == "textarea" || (nodeName == "input" && this.type == "text")) {
                        allowTabChar(this, config);
                    }
                }
            })
        }
        return this;
    }

    $.fn.pasteAfterCaret = function(text) {
        if(this.jquery) {
            this.each(function() {
                if (this.nodeType == 1) {
                    var nodeName = this.nodeName.toLowerCase();
                    if (nodeName == "textarea" || (nodeName == "input" && this.type == "text")) {
                        pasteIntoInput(this, text);
                        $(this).trigger('change');
                    }
                }
            })
        }
    }
})(jQuery);