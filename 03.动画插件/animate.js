if(!this.myPlugins) {
    this.myPlugins = {}
}

this.myPlugins.Animate = function(config) {
    this.config = Object.assign({}, {       // 默认设置参数
        begin: {},       // 元素动画开始样式
        end: {},         // 元素动画结束样式
        step: 16,       // 每次动画时间，单位“毫秒”
        duration: 1000,     // 动画总持续时间，单位“毫秒”
        running: function(data) {console.log(data)},     // 
        over: function() {console.log('结束')}
    }, config)
    
    this.curStep = 0;   // 当前运动次数
    this.timer = null;
    this.stepNum = Math.ceil(this.config.duration / this.config.step);     // 运动持续时间内运动次数
    this.beginStyle = this.clone(this.config.begin, true);
    this.endStyle = this.clone(this.config.end, true);
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
                self.onceRun();
            }, self.config.step)
        }
    },


    /**
     * 颜色赋值更新
     */
    setColor: function(color) {
        if(this.curStep >= this.stepNum) {
            for(var prop in this.beginStyle[color]) {
                this.beginStyle[color][prop] = this.endStyle[color][prop];
            }
        }else {
            for(var prop in this.beginStyle[color]) {
                this.beginStyle[color][prop] += this.distance[color][prop];
            }
        }
    },


    /**
     * 单次动画
     */
    onceRun: function() {
        this.curStep++;
        if(this.curStep >= this.stepNum) {
            for(var prop in this.beginStyle) {
                if( typeof(this.beginStyle[prop] ) === 'object') {
                    this.setColor(prop);
                }else {
                    this.beginStyle[prop] = this.endStyle[prop];
                }
            }
            clearInterval(this.timer);
            this.timer = null;
            this.config.over();
        }else {
            for(var prop in this.beginStyle) {
                if( typeof(this.beginStyle[prop] ) === 'object') {
                    this.setColor(prop);
                }else {
                    this.beginStyle[prop] += this.distance[prop];
                }
            }
        }
        this.config.running(this.beginStyle); 
    },


    /**
     * 获取颜色单次动画的颜色差值
     */
    getOnceColorValue: function(beginColor, endColor) {
        var obj = {}
        for(var prop in beginColor) {
            obj[prop] = (endColor[prop] - beginColor[prop]) / this.stepNum;    // 颜色动画每次变化的数值
        }
        return obj;
    },


    
    /**
     * 获取单次动画每次运动的距离
     */
    getDistance: function() {
        var obj = {};
        for(var prop in this.beginStyle) {    // 获取动画开始到动画结束的参数总差值
            if(typeof(this.beginStyle[prop]) === 'object') {
                obj[prop] = this.getOnceColorValue(this.beginStyle[prop], this.endStyle[prop]);
            }else {
                obj[prop] = (this.config.end[prop] - this.config.begin[prop]) / this.stepNum;
            }
        }
        return obj;
    },


    /**
     * 对象克隆
     * @param {*} obj 被克隆的对象
     * @param {*} deep 是否深度克隆，true/false
     */
    clone: function(obj, deep) {
        if(Array.isArray(obj)) {    // 被克隆的对象为数组
            if(deep) {
                var newObj = [];
                for(var i = 0; i < obj.length; i ++) {
                    this.clone(obj[i], deep);
                }
            }else {
                return obj.slice();
            }
        }else if(typeof(obj) === 'object') {   // 被克隆对象为对象
            var newObj = {};
            for(var prop in obj) {
                if(deep) {      // 深度克隆，递归
                    this.clone(obj[prop], deep);
                }
                newObj[prop] = obj[prop];
            }
        }else {     // 被克隆的对象为原始值
            return obj;
        }
        return newObj;
    }
}
