(function() {

	var defaultOptions = {

		// 窗口内容
		content: '',

		/**
		 * dialog类型
		 * @message: 非模态
		 * @modal: 模态
		 * @bubble: 提示气泡
		 */
		type: 'message',

		// 窗口背景颜色
		winBg: '#fff',

		// 标题栏背景颜色
		topbarBg: '#fff',

		// 是否圆角
		borderRadius: false,

		// 是否显示border
		border: false,

		// HTML结构
		innerHTML:
			'<div class="xdialog">'
			+	'<div class="xdialog-main">'
			+		'<div class="xdialog-header">'
			+			'<button class="xdialog-close">&#215;</button>'
			+			'<div class="xdialog-title"></div>'
			+		'</div>'
			+		'<div class="xdialog-body">'
			+			'<div class="xdialog-content"></div>'
			+		'</div>'
			+		'<div class="xdialog-footer">'
			+			'<div class="xdialog-button">'
			+				'<button class="">取消</button>'
			+				'<button class="">确定</button>'
			+			'</div>'
			+		'</div>'
			+	'</div>'
			+'</div>'

	};

	var $ = jQuery;

	// 外部调用的函数
	var xDialog = function(options) {
	
		var opt = options || {};

		// 对opt进行一系列处理
		// 处理options为字符串或元素类型的情况
		if (typeof opt === 'string' || opt.nodeType === 1) {
			opt = { content: opt };
		}

		opt = $.extend(true, {}, defaultOptions, opt);

		// 调用实际的构造函数，传入opt
		return new xDialog.create(opt);

	};

	// xDialog.create是实际的构造函数
	xDialog.create = function(options) {
		var that = this;

		this.opt = options;

		// _popup属性是一个jquery对象
		this._popup = $('<div />')
			.html(options.innerHTML)
			.css({
				'display': 'none',
				'position': 'absolute'
			})
			.appendTo('body');

		// 如原型对象中有对应同名的setter，则调用setter
		$.each(options, function(k, v) {
			if (typeof that[k] === 'function') {
				that[k](v);
			} else {
				that[k] = v;
			}
		});


		return this;

	};

	// 构造函数原型，其中方法会被继承
	xDialog.create.prototype = {
		// 显示弹窗
		show: function(node) {
			var that = this,
					popup = this._popup;

			this.node = node || this.node;

			if (this.opt.type === 'bubble') {
				this.setBubble();
			}

			if (this.opt.type === 'message') {
				this.center();
			}

			popup.show();

			return this;
		},

		// 气泡定位
		setBubble: function() {
			console.log(this);
		},

		// 弹层居中定位
		center: function() {
			
			var popup = this._popup,
					$window = $(window),
					$document = $(document),
					// position: fixed;时要加的偏移量
					fixed = this.fixed,
					dl = fixed ? 0 : $document.scrollLeft(),
					dt = fixed ? 0 : $document.scrollTop(),
					ww = $window.width(),
					wh = $window.height(),
					ow = popup.width(),
					oh = popup.height(),
					left = (ww - ow) / 2 + dl,
					top = (wh - oh) * 382 / 1000 + dt, // 黄金比例
					style = popup[0].style;

			// 处理弹层超宽情况？
			style.left = Math.max(parseInt(left), dl) + 'px';
			style.top = Math.max(parseInt(top), dt) + 'px';

		},

		// 设置标题
		title: function(v) {
			console.log(this._popup)
			this._popup.find('.xdialog-title').html(v);
			this._popup.find('.xdialog-header')[v ? 'show' : 'hide']();
			return this;
		},

		// 设置内容，目前只支持文本，以后会支持元素
		content: function(v) {
			this._popup.find('.xdialog-content').html(v);
			this._popup.find('.xdialog-header')[v ? 'show' : 'hide']();
			return this;
		},

		// todo: 宽度和高度过小时的显示
		width: function(v) {
			this._popup.find('.xdialog-content').css('width', v);
			return this;
		},

		height: function(v) {
			this._popup.find('.xdialog-content').css('height', v);
			return this;
		},

		// 隐藏弹窗
		hide: function() {

		},

		// 删除弹窗
		remove: function() {

		}

	};

	window.xDialog = xDialog;

})();