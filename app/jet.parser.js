(function (jet) {
    "use strict";

    var symbols = {
        escape: '\\',
        macro: '$'
    };

    function Iterator(template, pos) {
        this.template = template;
        this.pos = typeof pos == "number" && !isNaN(pos) && isFinite(pos) ? pos : 0;
        this.buffer = [];
    }

    jet.Iterator = Iterator;

    Iterator.prototype = {
        move: function (step) {

            if (!this.canMove()) {
                throw new Error("Reached the end of string");
            }

            if (typeof step == "number") {
                var c = step;
                while (--c) {
                    console.log("step: ", c);
                    this.move();
                }
            }

            this.pos++;

        },
        char: function () {
            return this.template[this.pos];
        },
        isEscaped: function () {
            return this.pos > 0 && this.template[this.pos - 1] == '\\';
        },
        isEscapeSymbol: function () {
            return this.char() === symbols.escape && this.pos < this.template.length - 1;
        },
        canMove: function () {
            console.assert(this.pos < this.template.length, "Incorrect position");
            return this.pos < this.template.length - 1;
        },
        readUntil: function (chars) {
            var result = [];

            while (chars.indexOf(this.char()) < 0 || this.isEscaped()) {
                if (!this.isEscapeSymbol()) {
                    result.push(this.char());
                }
                this.move();
            }

            return result.join('');
        },
        append:function() {
            this.buffer.push(this.char());
        },
        getBuffer:function() {
            var str = this.buffer.join('');
            this.buffer.length = 0;
            return str;
        },
        logState:function(prefix) {
           console.log((prefix || '') + ': ' + this.state());
        },
        state:function() {
            return this.template.substring(0, this.pos)
            + '>' + this.char() + '<'
            + this.template.substring(this.pos+1);
        }
    };


    jet.createParser = function () {
        return new JetTokenParser();
    }

    function JetTokenParser() {
    }

    JetTokenParser.prototype = {
        parse: function (template) {
            var it = this.iterator = new Iterator(template),
                tokens = [],
                ch;

            while (it.canMove()) {
                ch = it.char();

//                if (it.isEscapeSymbol()) {
//                    continue;
//                }

                if (ch == symbols.macro) {
                    tokens.push(this.readToken());
                    continue;
                }

                it.move();
            }

            return tokens;
        },

        readString:function(startChar) {
            var s = this.iterator.readUntil(startChar)
        },

        readToken: function () {
            console.log('readToken start');

            var it = this.iterator,
                ch = it.char(),
                sb = [],
                token = { start: it.pos };

            sb.push(it.char());
            it.move();

            while(it.canMove()){

                ch = it.char();

                if(it.isEscapeSymbol()){
                    sb.push(ch)
                    continue;
                }
                else if(ch == '[') {
                    this.readIndexer(sb);
                    continue;
                }
                else if(ch == "(") {
                    sb.push(this.readExpression());
                    continue;
                }
                if('"! '.indexOf(ch) >= 0) {
                    break;
                }

                sb.push(ch);

//                if(ch == "'" || ch == '"') {
//
//                }

                it.move();

            }

            console.log('readToken end');

            token.text = sb.join("");
            token.value = sb.splice(1).join("");
            token.end = it.pos-1;

            console.log(token);

            return token;
        },

        readIndexer:function(sb) {
            sb.push(this.iterator.readUntil(']'));
        },

        readExpression: function() {

            var it = this.iterator,
                startChar = it.char(),
                ch;

            console.log('readExpression start: ' + it.state());

            var text = [];
            text.push(it.char());

            it.move(); // Pass opened
            while(it.canMove()){
                ch = it.char();
                if(ch == '"' || ch == "'") { //TODO: check for escaped
                    text.push(it.readUntil(ch));
                }
                else if(ch == ')'){
                    text.push(ch);
                    it.move();
                    break;
                }
                else if(ch == '(') {
                    text.push(this.readExpression());
                    continue;
                }

                text.push(ch);
                it.move();
            }
            console.log('readExpression end: ' + it.state() + "| " + text.join(''));
            return text.join("");
        }
    };


})(jet);
