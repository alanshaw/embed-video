var test = require("tape"),
    embed = require("./index");

test("convert vimeo.com url", function(t) {
    t.plan(1)
    var code = embed("http://vimeo.com/19339941").vimeo();
    t.equal(code, '<iframe src="https://player.vimeo.com/video/19339941" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen class="" id="" width="100%" height="100%"></iframe>')

    t.plan(2)
    code = embed("http://vimeo.com/19339941", {
        height: '100'
    }).vimeo();

    t.equal(code, '<iframe src="https://player.vimeo.com/video/19339941" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen class="" id="" width="100%" height="100"></iframe>')
})

test("convert youtube.com url", function(t) {
    t.plan(1)
    var code = embed("https://www.youtube.com/watch?v=twE64AuqE9A").youtube();
    t.equal(code, '<iframe src="https://www.youtube.com/embed/twE64AuqE9A" frameborder="0" allowfullscreen class="" id="" width="100%" height="100%"></iframe>')

    t.plan(2)

    code = embed("https://www.youtube.com/watch?v=twE64AuqE9A", {
        height: '300',
        width: '300'
    }).youtube();
    t.equal(code, '<iframe src="https://www.youtube.com/embed/twE64AuqE9A" frameborder="0" allowfullscreen class="" id="" width="300" height="300"></iframe>')
})

test("convert youtu.be url", function(t) {
    t.plan(1)
    var code = embed("http://youtu.be/9XeNNqeHVDw#aid=P-Do3JLm4A0").youtube();
    t.equal(code, '<iframe src="https://www.youtube.com/embed/9XeNNqeHVDw" frameborder="0" allowfullscreen class="" id="" width="100%" height="100%"></iframe>')
})

test("convert vimeo id", function(t) {
    t.plan(1)
    var code = embed("19339941").vimeo()
    t.equal(code, '<iframe src="https://player.vimeo.com/video/19339941" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen class="" id="" width="100%" height="100%"></iframe>')
})

test("convert youtube id", function(t) {
    t.plan(1)
    var code = embed("9XeNNqeHVDw").youtube()
    t.equal(code, '<iframe src="https://www.youtube.com/embed/9XeNNqeHVDw" frameborder="0" allowfullscreen class="" id="" width="100%" height="100%"></iframe>')
})
