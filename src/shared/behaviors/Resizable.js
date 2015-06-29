/**
 * @license
 * Copyright (c) 2015 MediaMath Inc. All rights reserved.
 * This code may only be used under the BSD style license found at http://mediamath.github.io/strand/LICENSE.txt

*/

(function (scope) {

	var _instances = [];
	var _il = 0;
	var _backoff = 0;
	var _backoff_inc = 200;
	var _backoff_max = 2000;

	function _addInstance(instance, target) {
		_instances.push({
			target:target,
			instance: instance,
			width:target.offsetWidth,
			height:target.offsetHeight,
		});
		_il++;
		requestAnimationFrame(_measure);
	}

	function _removeInstance(instance) {
		_instances.filter(function(meta) {
			return meta.instance === instance;
		}).forEach(function(target) {
			_instances.splice(_instances.indexOf(target), 1);
			_il--;
		});
	}

	function _measure() {
		_backoff += _backoff_inc;
		if (_backoff > _backoff_max) _backoff = _backoff_max;

		for(var i=0; i<_il; i++) {
			var meta = _instances[i];
			var w = meta.target.offsetWidth;
			var h = meta.target.offsetHeight;
			if (meta.width !== w) {
				meta.width = w;
				meta.instance.elementResize(w,null,meta.target);
				_backoff = 0;
			}
			if (meta.height !== h) {
				meta.height = h;
				meta.instance.elementResize(null, h, meta.target);
				_backoff = 0;
			}
		}
		if (_il) {
			setTimeout(function() {
				requestAnimationFrame(_measure);
			},_backoff);
		}
	}

	scope.Resizable = {

		properties: {
			resizeTarget:{
				type:Object,
				value: function() { return this; }
			},
		},

		attached:function() {
			_addInstance(this, this.resizeTarget);
		},

		detached:function() {
			_removeInstance(this);
		},

		elementResize: function(e) {
			//stub for behavior
		}

	};

})(window.StrandTraits = window.StrandTraits || {});
