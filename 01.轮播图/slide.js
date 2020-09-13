(function() {
    var config = {
        imgWidth: 750,  // 图片宽度
        imgHeight: 291, // 图片高度
        dotWidth: 12 + 4,   // 导航圆点宽度 + 外边距
        doms: {     // dom 元素
            oBanner: document.querySelector('.banner'),
            oImgs: document.querySelector('.imgs'),
            oArrow: document.querySelector('.arrow'),
            oNavDots: document.querySelector('.nav_dots')
        },
        curIndex: 0,    // 当前显示图片索引
        timer: {    // 图片单张移动定时器配置
            duration: 16,   // 每次运动持续时长，单位”毫秒“
            totol: 500,    // 运动到目标图片所用总时长，单位”毫秒“
            id: null    // 定时间唯一ID
        },
        autotimer: null     // 图片自动轮播定时器
    }

    config.imgNum = config.doms.oImgs.children.length;      // 有效图片数量
    config.effectiveImgWidth = config.imgWidth * config.imgNum;     // 有效图片总宽度

    /**
     * 初始化元素大小
     */
    function initSize() {
        // 图片视口宽度和高度
        config.doms.oBanner.style.width = config.imgWidth + 'px';
        config.doms.oBanner.style.height = config.imgHeight + 'px';
        // 图片总宽度
        config.doms.oImgs.style.width = config.imgWidth * (config.imgNum + 1) + 'px';
        // 导航园点总宽度
        config.doms.oNavDots.style.width = config.dotWidth * config.imgNum + 'px';
    }

    /**
     * 初始化元素
     */
    function initElement() {
        // 初始化导航圆点
        for(var i = 0; i < config.imgNum; i++) {
            var span = document.createElement('span');
            config.doms.oNavDots.appendChild(span);
        }
        // 复制第一张图片并添加到图片列表末尾
        var imgList = config.doms.oImgs.children,
            newImg = imgList[0].cloneNode(true);    // 深度克隆第一张图片
        config.doms.oImgs.appendChild(newImg);
    }

    /**
     * 初始化图片显示位置
     */
    function initImgPosition() {
        config.doms.oImgs.style.left = -(config.curIndex * config.imgWidth) + 'px';
    }

    /**
     * 初始化导航圆点的显示状态
     */
    function setDotStatus() {
        for(var i = 0; i < config.imgNum; i ++) {
            var dot = config.doms.oNavDots.children[i];
            if(i === config.curIndex) {
                dot.className = 'active';
            }else {
                dot.className = '';
            }
        }
    }

    /**
     * 初始化
     */
    function init() {
        initSize();
        initElement();
        initImgPosition();
        setDotStatus();
    }

    init();

    /**
     * 根据图片索引切换到相对应的图片
     * @param {*} index 图片索引
     * @param {*} direction 切换方向 left / right
     */
    function switchTo(index, direction) {
        if(index === config.curIndex) {
            return;
        }
        // 图片默认切换方向为向左移动
        if(!direction) {
            direction = 'left';
        }
        var targetLeft = -(index * config.imgWidth);    // 计算切换到目标图片的left值
        switchAnimate();
        config.curIndex = index;    // 重置当前显示图片的索引
        setDotStatus();

        /**
         * 图片切换动画
         */
        function switchAnimate() {
            stopAnimate();  // 停止之前的动画
            var num = Math.ceil(config.timer.totol / config.timer.duration),    // 计算运动到目标图片，所需要的运动次数，小数向上取整。
                curNum = 0,     // 记录当前运动次数
                totolDis,   // 移动到目标图片的总距离
                curLeft = parseFloat(getComputedStyle(config.doms.oImgs).left);
            if(direction === 'left') {
                if(targetLeft < curLeft) {
                    totolDis = targetLeft - curLeft;
                }else {
                    totolDis = -(config.effectiveImgWidth - Math.abs(targetLeft - curLeft));
                }
            }else {
                if(targetLeft > curLeft) {
                    totolDis = targetLeft - curLeft;
                }else {
                    totolDis = config.effectiveImgWidth - Math.abs(targetLeft - curLeft);
                }
            }

            var dis = totolDis / num;   // 每次运动的距离
            config.timer.id = setInterval(function() {
                curLeft += dis;
                if(direction === 'left' && Math.abs(curLeft) > config.effectiveImgWidth) {
                    curLeft += config.effectiveImgWidth;
                }else if(direction === 'right' && curLeft > 0) {
                    curLeft -= config.effectiveImgWidth;
                }
                config.doms.oImgs.style.left = curLeft + 'px';
                curNum ++;
                if(curNum === num) {
                    stopAnimate();
                }


            }, config.timer.duration)

            /**
             * 停止切换动画
             */
            function stopAnimate() {
                clearInterval(config.timer.id);
                config.timer.id = null;
            }
        }
    }

    /**
     * 绑定点击事件
     */
    function bindEvent() {
        // 移动方向箭头点击事件
        config.doms.oArrow.onclick = function(e) {
            if(e.target.classList.contains('btn_l')) {
                toRight();
            }else if(e.target.classList.contains('btn_r')) {
                toLeft();
            }
        }

        // 图片导航圆点点击事件
        config.doms.oNavDots.onclick = function(e) {
            if(e.target.tagName === 'SPAN') {
                var index = Array.from(this.children).indexOf(e.target),
                    dir = index > config.curIndex ? 'left' : 'right';
                switchTo(index, dir);
            }
        }

        // 图片自动轮播
        config.autotimer = setInterval(toLeft, 2000);

        config.doms.oBanner.onmouseenter = function() {
            clearInterval(config.autotimer);
            config.autotimer = null;
        }

        config.doms.oBanner.onmouseleave = function() {
            if(config.autotimer) {
                return;
            }
            config.autotimer = setInterval(toLeft, 2000);
        }


        /**
         * 图片向右移动
         */
        function toRight() {
            var index = config.curIndex - 1;
            if(index < 0) {
                index = config.imgNum - 1;
            }
            switchTo(index, 'right');
        }

        /**
         * 图片向左移动
         */
        function toLeft() {
            var index = (config.curIndex + 1) % config.imgNum;
            switchTo(index, 'left');
        }

    }

    bindEvent();
})()
