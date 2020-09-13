if(!window.myPlugins) {
    window.myPlugins = {};
}

window.myPlugins.waterfallFlow = function(config) {
    config = Object.assign({}, {    // 默认配置
        container: document.body,
        imgs: [],       // 图片
        imgWidth: 220,      // 每张图片宽度
        minGap: 2       // 最小图片间隙
    }, config);

    var arrange = {};   // 图片排列参数
        imgDom = [];    // 所有图元素存放数组


    initParent();
    getArrangeInfo();
    initImg();
    bindEvent();


    // 事件绑定
    function bindEvent() {
        var resize = debounce(function() {
            getArrangeInfo();
            imgDom.forEach(function(img) {
                setImgPosition(img);
            })
            setParent();
        }, 200);
        window.onresize = resize;
    }
    
    
    /**
     * 设置父元素高度
     */
    function setParent() {
        var maxTop = Math.max.apply(null, arrange.imgNum);
            index = arrange.imgNum.indexOf(maxTop);
            maxHeight = arrange.imgNum[index];
        config.container.style.height = maxHeight - arrange.actualGap + 'px';
        config.container.style.overflow = 'hidden';
    }

    /**
     * 设置图片定位
     */
    function setImgPosition(img) {
        var minTop = Math.min.apply(null, arrange.imgNum),  // 每行图片最小高度值
            index = arrange.imgNum.indexOf(minTop);       // 高度最小的图片在每行的索引值
            left = null;    // 图片left值
        img.style.top = minTop + 'px';
        img.style.left = index * (config.imgWidth + arrange.actualGap) + 'px';
        arrange.imgNum[index] += img.clientHeight + arrange.actualGap;   // 更新每行最小高度图片位置的图片高度
        setParent();
    }


    /**
     * 初始化图片
     */
    function initImg() {
        config.imgs.forEach(function(item) {
            var oImg = document.createElement('img');
            oImg.src = item;
            oImg.style.width = config.imgWidth + 'px';
            oImg.style.display = 'block';
            oImg.style.position = 'absolute';
            oImg.style.transition = '0.5s'
            oImg.onload = function() {
                setImgPosition(oImg);
                imgDom.push(oImg);
            }
            config.container.appendChild(oImg);
        })
    }

    /**
     * 获取图片排列定位信息
     */
    function getArrangeInfo() {
        arrange.containerWidth = config.container.clientWidth;  // 图片容器宽度
        arrange.rowNum = Math.floor( (arrange.containerWidth + config.minGap) / (config.imgWidth + config.minGap) )  // 每行存放图片数量
        arrange.actualGap = ( arrange.containerWidth - (config.imgWidth * arrange.rowNum) ) / (arrange.rowNum - 1)     // 实际图片间隙
        arrange.imgNum = new Array(arrange.rowNum);
        arrange.imgNum.fill(0);
    }


    /**
     * 图片父元素定位
     */
    function initParent() {
        var elem = getComputedStyle(config.container);
        if(elem.position === 'static') {
            config.container.style.position = 'relative';
        }
    }


    /**
     * 函数防抖
     */
    function debounce(callback, delay) {
        var timer = null;
        return function() {
            clearInterval(timer);
            timer = setTimeout(function() {
                callback.apply(null, arguments);
            }, delay)
        }
    }
}
