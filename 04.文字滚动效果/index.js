var item = document.querySelector('.scrollText ul'),
    height = 40,
    totalHeight = item.scrollHeight,
    curTop = 0;
    


initItem();

setInterval(function() {
    var animate = new myPlugins.Animate({
        begin: {
            scrollTop: curTop,
        },
        end: {
            scrollTop: curTop + height
        },
        step: 16,
        duration: 500,
        running: function(data) {
            item.scrollTop = data.scrollTop;
        },
        over: function() {
            if(curTop >= totalHeight) {
                curTop = 0;
            }else {
                curTop += height;
            }
        }
    })
    animate.start();
}, 4000)



function initItem() {
    var first = item.children[0],
        cloneFirst = first.cloneNode(true);
    item.appendChild(cloneFirst);
}

