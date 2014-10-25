describe("Parser Tests", function(){

    it("Read macro", function(){

        expectTokens('Hello $item!',
            { start:6, end:10, text:'$item', value: 'item'  });
    });

    it("Read macro - two", function(){
       expectTokens('Hello $item! this is $some[0123] test!',
            { start:6, end:10, text:'$item', value: 'item'  },
            { start:21, end:31, text:'$some[0123]', value: 'some[0123]'  });
    });

    it("Read macro - method invocation", function(){
        expectTokens('Hello $item.toString()!',
            { start:6, end:21, text:'$item.toString()', value: 'item.toString()'  })
    });

    it("Read macro - method invocation - string argument", function(){

        expectTokens('Hello $item.toString("asd")!',
            { start:6,
                end:26,
                text:'$item.toString("asd")',
                value: 'item.toString("asd")'
            });
    });

    it("Read macro - method invocation - string argument", function(){

        expectTokens('Hello $item.toString("asd")!',
            { start:6, end:26, text:'$item.toString("asd")', value: 'item.toString("asd")'  }
        );
    });

    it("Read macro - method invocation - string argument and it argument", function(){

        expectTokens('Hello $item.toString("asd", 1)!',
            { start:6, end:29, text:'$item.toString("asd", 1)', value: 'item.toString("asd", 1)'  }
        );
    });

    it("Read macro - method invocation - string argument - empty", function(){

        expectTokens('Hello $item.toString("")!',
            { start:6, end:23, text:'$item.toString("")', value: 'item.toString("")'  });
    });

    it("Read macro - method invocation - nested parenthesis", function(){

        expectTokens('Hello $item.toString((""))!',
            { start:6, end:25, text:'$item.toString((""))', value: 'item.toString((""))'  }
        );
    });

    it("Read macro - indexer unclosed", function(){
        var template = 'Hello $item! this is $some[0123 test!',
            parser = jet.createParser();

        expect(function() {
            parser.parse(template);
        }).toThrow("Reached the end of string");
    });


    function expectTokens(template) {
        expect(jet.createParser().parse(template)).toEqual(Array.prototype.slice.call(arguments,1));
    }
});
