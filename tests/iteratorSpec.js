xdescribe("Iterator Tests", function(){

    it("Iterator intialization", function(){
        var template = "asd",
            it = new jet.Iterator(template);

        expect(it.template).toEqual(template);
        expect(it.pos).toEqual(0);
    });

    it("Move", function() {
        var template = "template",
            it = new jet.Iterator(template);

        it.move(template.length-1);

        expect(it.pos).toEqual(template.length-1);
        expect(it.char()).toEqual("e");
    });

    it("Move two", function() {
        var template = "template",
            it = new jet.Iterator(template);

        it.move(2);

        expect(it.pos).toEqual(2);
        expect(it.char()).toEqual("m");
    });

    it("Read until", function() {
        var it = new jet.Iterator("this is test!");
        expect(it.readUntil(" ")).toEqual("this");
        expect(it.pos).toEqual(4);
    });

    it("Read until - many", function() {
        var it = new jet.Iterator("this is test!");
        expect(it.readUntil(" s")).toEqual("thi");
    });

    it("Read until - empty", function() {
        var it = new jet.Iterator('""');
        expect(it.readUntil('"')).toEqual("");
    });

    it("Read until - many and escape", function() {
        var it = new jet.Iterator("thi\\s is test!");
        expect(it.readUntil("s")).toEqual("this i");
    });
});
