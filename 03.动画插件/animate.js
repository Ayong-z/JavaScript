if(!this.myPlugins) {
    this.myPlugins = {}
}

this.myPlugins.Animate = function(config) {
    this.config = Object.assign({}, {       // 默认设置参数
        dom: null,      // 设置动画的目标元素
        style: {},       // 动画属性和结束值
        step: 16,       // 每次动画时间，单位“毫秒”
        duration: 1000,     // 动画总持续时间，单位“毫秒”
        moving: function() {},
        end: function() {}
    }, config)
    
    this.curStep = 0;   // 当前运动次数
    this.timer = null;
    this.stepNum = Math.ceil(this.config.duration / this.config.step);     // 运动持续时间内运动次数
    this.endColor = this.getColorValue(this.config.style.backgroundColor);     // 颜色变化结束值
    this.begin = this.getBeginStyle();     // 动画属性开始值
    this.distance = this.getDistance();     // 动画属性每次运动的距离

}

this.myPlugins.Animate.prototype = {


    /**
     * 暂停动画
     */
    stop: function(callback) {
        clearInterval(this.timer)
        this.timer = null;
        if(typeof(callback) === 'function') {
            callback();
        }
    },


    /**
     * 动画开始
     */
    start: function(callback) {
        if(typeof(callback) === 'function') {
            callback();
        }
        var self = this;
        if(this.timer) {    // 如果定时器存在不做任何处理
            return;
        }else {
            this.timer = setInterval(function() {
                self.onceSport();
            }, self.config.step)
        }
    },


    /**
     * 单次动画
     */
    onceSport: function() {
        this.curStep++;
        if(this.curStep >= this.stepNum) {
            for(var prop in this.config.style) {
                if(prop === 'backgroundColor') {
                    this.setColor();
                }else {
                    this.setStyle(prop);
                    this.begin[prop] = this.config.style[prop];
                }
            }
            clearInterval(this.timer);
            this.timer = null;
            this.config.end();
        }else {
            for(var prop in this.config.style) {
                if(prop === 'backgroundColor') {
                    this.setColor();
                }else {
                    this.begin[prop] += this.distance[prop];
                    this.setStyle(prop)
                }
            }
        }
        this.config.moving(this.begin); 
    },


    /**
     * 样式赋值更新
     */
    setStyle: function(prop) {
        if(prop === 'opacity') {
            this.config.dom.style[prop] = this.curStep >= this.stepNum ? this.config.style[prop] : this.begin[prop]
        }else {
            this.config.dom.style[prop] = (this.curStep >= this.stepNum ? this.config.style[prop] : this.begin[prop]) + 'px';
        }
    },


    /**
     * 颜色赋值更新
     */
    setColor: function() {
        var color = null;
        if(this.curStep >= this.stepNum) {     // 最后一次颜色动画赋值
            color = {
                r: this.endColor.r,
                g: this.endColor.g,
                b: this.endColor.b
            }
            for(var prop in this.endColor) {
                this.begin.color[prop] = this.endColor[prop];
            }
        }else {
            for(var prop in this.endColor) {    // 当前动画颜色赋值
                this.begin.color[prop] += this.distance.color[prop];
            }
            color = {
                r: this.begin.color.r,
                g: this.begin.color.g,
                b: this.begin.color.b
            }
        }
        this.config.dom.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    },


    /**
     * 获取单次动画每次运动的距离
     */
    getDistance: function() {
        var obj = {};
        for(var prop in this.config.style) {    // 获取动画开始到动画结束的参数总差值
            if(prop === 'backgroundColor') {
                obj.color = {}
                for(var value in this.endColor) {
                    obj.color[value] =(this.endColor[value] - this.begin.color[value]) / this.stepNum;
                }
            }else {
                obj[prop] = (this.config.style[prop] - this.begin[prop]) / this.stepNum;
            }
        }
        return obj;
    },

    
    /**
     * 获取动画开始属性值
     */
    getBeginStyle: function() {
        var obj = {};
            domStyle = getComputedStyle(this.config.dom);
        for(var prop in this.config.style) {    // 获取动画属性的开始值
            if(prop === 'backgroundColor') {
                obj.color = this.getColorValue(domStyle.backgroundColor);
            }else {
                obj[prop] = parseFloat(domStyle[prop]);
            }
        }
        return obj;
    },


    /**
     * 获取颜色单次动画的颜色值
     */
    getOnceColorValue: function() {
        var obj = {}
        for(var prop in this.begin.color) {
            obj[prop] = (this.endColor[prop] - this.begin.color[prop]) / this.stepNum;    // 颜色动画每次变化的数值
        }
        return obj;
    },


    /**
     * 获取颜色的rgb值
     */
    getColorValue: function(color) {
        var reg = /\d{1,3}/g,  // 匹配颜色rgb参数值
            value = color.match(reg);
        return {        // 返回颜色的rgb参数值
            r: parseInt(value[0]),
            g: parseInt(value[1]),
            b: parseInt(value[2])
        }
    }
}
