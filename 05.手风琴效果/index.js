var wrapper = document.querySelector('.wrapper'),
    active = null,     // 当前显示的子导航列表
    title = null,       // 当前显示列表的标题
    lineHeight = 32,    // 单个导航高度
    isEnd = true;    // 动画状态标记


    

wrapper.onclick = function(e) {     // 事件委托，给父元素添加点击事件
    if(!isEnd) {    // 判断当前动画是否结束
        return;
    }
    if(e.target.tagName === 'H2') {     // 当点击对象为H2时，执行事件
        var curTitle = e.target.parentElement;
        var curNav = e.target.nextElementSibling;   // 当前点击的目标的子导航列表
        // 判断当前的点击的导航列表和已展开的导航列表是否相同:
        // 相同，则隐藏当前导航列表
        // 不同，隐藏当前已展开的导航列表，展开所点击的导航列表
        if(curNav === active) {     
            hide(curNav, curTitle);
            active = null;
        }else {
            hide(active, title);
            show(curNav, curTitle);
            title = curTitle;
            active = curNav;
        }
    }
}


/**
 * 隐藏子导航列表
 * @param {*} navList 
 */
function hide(navList, curTitle) {
    isEnd = false;      // 切换动画状态
    if(!navList || !curTitle) {       // 判断导航列表是否为空，如果为空不做任何操作
        return;
    }
    var lineNum = navList.children.length,      // 子导航列表行数
        totalHeight = lineNum * lineHeight;    // 子导航列表总高度
    var animate = new myPlugins.Animate({
        begin: {
            height: totalHeight,
            marginBottom: 0
        },
        end: {
            height: 0,
            marginBottom: 6
        },
        duration: 300,
        running: function(data) {
            curTitle.style.marginBottom = data.marginBottom + 'px';
            navList.style.height = data.height + 'px';
        },
        over: function() {
            navList.classList.remove('active');
            isEnd = true;
        }
    })
    animate.start();
}


/**
 * 显示子导航列表
 * @param {} navList 
 */
function show(navList, curTitle) {
    isEnd = false;
    var classList = Array.from(navList.classList),
        lineNum = navList.children.length,
        totalHeight = lineNum * lineHeight;

    if(!navList) {
        return;
    }
    navList.classList.add('active');
    var animate = new myPlugins.Animate({
        begin: {
            height: 0,
            marginBottom: 6
        },
        end: {
            height: totalHeight,
            marginBottom: 0
        },
        duration: 300,
        running: function(data) {
            curTitle.style.marginBottom = data.marginBottom + 'px';
            navList.style.height = data.height + 'px';
        },
        over: function() {
            isEnd = true;
        }
    })
    animate.start();
}