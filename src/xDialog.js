(function() {

	var defaultOptions = {

		// 窗口内容
		content: '',

		/**
		 * dialog类型
		 * @message: 非模态
		 * @modal: 模态
		 * @tip: 提示气泡
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
			+			'<div class="xdialog-title">标题文字</div>'
			+		'</div>'
			+		'<div class="xdialog-body">'
			+			'<div class="xdialog-content">这是一段测试文字，1234567，asdfghjkl，&*^(*^(</div>'
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
		// popup属性是一个jquery对象
		this.popup = $('<div />')
			.html(options.innerHTML)
			.css({
				'display': 'none',
				'position': 'absolute'
			})
			.appendTo('body');

		return this;

	};

	// 构造函数原型，其中方法会被继承
	xDialog.create.prototype = {
		show: function() {
			var that = this,
					popup = this.popup;

			popup.show();
		}
	};

	window.xDialog = xDialog;

})();