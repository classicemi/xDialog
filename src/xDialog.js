(function() {

	var defaultOptions = {

		// 标题
		title: '',

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

		// 是否显示关闭按钮
		close: true,

		// 是否显示取消按钮
		cancel: true,

		// 取消按钮文字
		cancelText: 'cancel',

		// 取消按钮回调函数
		cancelCallback: function() {},

		// 确定按钮文字
		okText: 'ok',

		// 是否显示确定按钮
		ok: true,

		// 确定按钮回调函数
		okCallback: function() {},

		// 按钮组对象
		button: [],

		// content宽度
		width: '',

		// content高度
		height: '',

		// 遮罩层默认不透明度
		maskOpacity: 0.5,

		// 点击空白关闭
		quickClose: false,

		// 事件缓存对象
		eventCache: {},

		// HTML结构
		innerHTML:
		// '<div class="xdialog">'
		// + '<div class="xdialog-arrow-outer"></div>'
		// + '<div class="xdialog-arrow-inner"></div>'
		// +	'<div class="xdialog-main">'
		// +		'<div class="xdialog-header">'
		// +			'<button class="xdialog-close">&#215;</button>'
		// +			'<div class="xdialog-title"></div>'
		// +		'</div>'
		// +		'<div class="xdialog-body">'
		// +			'<div class="xdialog-content"></div>'
		// +		'</div>'
		// +		'<div class="xdialog-footer">'
		// +			'<div class="xdialog-button">'
		// // +				'<button class="">取消</button>'
		// // +				'<button class="">确定</button>'
		// +			'</div>'
		// +		'</div>'
		// +	'</div>'
		// +'</div>'
		'<div class="xdialog">' + '<div class="xdialog-arrow-outer"></div>' + '<div class="xdialog-arrow-inner"></div>' + '<table class="xdialog-main">' + '<tr>' + '<td class="xdialog-header">' + '<button class="xdialog-close">&#215;</button>' + '<div class="xdialog-title"></div>' + '</td>' + '</tr>' + '<tr>' + '<td class="xdialog-body">' + '<div class="xdialog-content"></div>' + '</td>' + '</tr>' + '<tr>' + '<td class="xdialog-footer">' + '<div class="xdialog-button">' + '</div>' + '</td>' + '</tr>' + '</table>' + '</div>'

	};

	var $ = jQuery;
	var initTime = new Date() - 0;
	var count = 0;

	// 外部调用的函数
	var xDialog = function(options) {

		var opt = options || {};
		var xDialogId = opt.xDialogId = initTime + count;

		// 对opt进行一系列处理
		// 处理options为字符串或元素类型的情况
		if (typeof opt === 'string' || opt.nodeType === 1) {
			opt = {
				content: opt
			};
		}

		opt = $.extend(true, {}, defaultOptions, opt);

		// 查找是否有同名xDialog对象
		var existObj = xDialog.find(opt.xDialogId);
		if (existObj) {
			return existObj;
		}

		// 按钮组
		// cancel按钮
		if (opt.cancel === true) {
			opt.button.push({
				className: 'cancel',
				cancel: true,
				text: opt.cancelText,
				cb: opt.cancelCallback
			});
		}

		// ok按钮
		if (opt.ok === true) {
			opt.button.push({
				className: 'ok',
				ok: true,
				text: opt.okText,
				cb: opt.okCallback
			});
		}

		// 调用实际的构造函数，传入opt
		return xDialog.group[xDialogId] = new xDialog.create(opt);

	};

	// xDialog.create是实际的构造函数
	xDialog.create = function(options) {
		var that = this;

		// 设置对象作为返回对象的一个属性
		this.opt = options;

		// _popup属性是一个jquery对象，用作容器
		this._popup = $('<div />')
			.html(options.innerHTML)
			.css({
				'display': 'none',
				'position': 'absolute'
			})
			.appendTo('body');


		// 遮罩层，用于模态对话框
		this._mask = $('<div />')
			.css({
				'display': 'none',
				'position': 'fixed',
				"top": 0,
				'left': 0,
				'width': '100%',
				'height': '100%',
				'overflow': 'hidden'
			});

		// 关闭按钮
		this._popup.find('.xdialog-close')
			.css({
				'display': this.opt.close === false ? 'none' : ''
			})
			.on('click', function(event) {
				that.close().remove();
			});

		// 按钮组点击
		this._popup.on('click', '[data-type]', function(event) {

			var $this = $(this);
			that.opt[$this.data('type') + 'Callback']();

		});

		// 点击空白处关闭
		if (this.opt.quickClose) {
			this._mask.on('click', function() {
				console.log('close')
				that.close().remove();
			});
		}

		// 如原型对象中有对应同名的setter，则调用setter
		// 如没有，则添加这个属性
		$.each(options, function(k, v) {
			if (typeof that[k] === 'function') {
				that[k](v);
			} else {
				that[k] = v;
			}
		});

		this.addEventListener('remove', function() {
			delete xDialog.group[this.opt.xDialogId];
		});

		count++;
		return this;

	};

	// 构造函数原型，其中方法会被继承
	xDialog.create.prototype = {
		// 显示弹窗
		show: function(node) {
			var that = this,
				popup = this._popup,
				mask = this._mask;

			this.node = node || this.node;

			// 根据类型配置显示方法
			// 要实现quick close就需要遮罩层来接受click事件
			if (this.opt.quickClose) {
				this.setMask();
			}

			this['show' + this.opt.type].call(this);

		},

		// 设置遮罩层
		setMask: function() {

			this._mask.css({
				zIndex: ++xDialog.zIndex
			}).appendTo('body').show();

		},

		// 显示气泡
		showbubble: function() {

			return this;
		},

		// 显示普通对话框
		showmessage: function() {

			var popup = this._popup;

			this.center();

			popup.css({
				zIndex: ++xDialog.zIndex
			}).show();

			return this;
		},

		// 显示模态对话框
		showmodal: function() {

			var popup = this._popup,
				mask = this._mask;

			this.center();

			mask.css({
				background: 'rgba(0, 0, 0, ' + this.opt.maskOpacity + ')'
			});
			popup.css({
				zIndex: ++xDialog.zIndex
			}).show();

			return this;
		},

		// 居中定位
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
		// 是否使用table
		width: function(v) {
			this._popup.find('.xdialog-content').css('width', v);
			return this;
		},

		height: function(v) {
			this._popup.find('.xdialog-content').css('height', v);
			return this;
		},

		// 设置按钮组
		button: function(v) {
			var that = this,
				html = '';

			$.each(v, function(i, obj) {

				html =
					'<button class="xdialog-button-' + obj.className + '" data-type="' + obj.className + '"">' + obj.text + '</button>';

				that._popup.find('.xdialog-button')[0].innerHTML += html;

			});
		},

		// 隐藏弹窗
		close: function() {

			this._popup.hide();
			this._mask.hide();

			return this;

		},

		// 删除弹窗
		remove: function() {

			this._popup.remove();
			this._mask.remove();

			this.triggerCachedEvent('remove');

			return this;

		},

		// 事件缓存相关方法
		// 添加事件监听
		addEventListener: function(eventType, cb) {

			var eventCache = this.opt.eventCache;

			if (!eventCache[eventType]) {
				eventCache[eventType] = [];
				eventCache[eventType].push(cb);
			} else {
				eventCache[eventType].push(cb);
			}
			return this;

		},

		// 移除事件监听
		removeEventListener: function() {

		},

		triggerCachedEvent: function(eventType) {

			var cache = this.opt.eventCache[eventType];

			for (var i = 0; i < cache.length; i++) {
				cache[i].call(this);
			}

		}

	};

	// 查找实例方法
	xDialog.find = function(id) {
		return xDialog.group[id];
	};

	// 弹层集合
	xDialog.group = {};

	// 全局层叠高度配置
	xDialog.zIndex = 8000;

	window.xDialog = xDialog;

})();