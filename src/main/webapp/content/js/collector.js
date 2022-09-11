!(function (window, document, monitorName, config) {
  var _data = [],
    _dataIntegrity = {},
    _dataIntegrityArray = [],
    _anonMap = [],
    _startTimestamp = new Date().getTime(),
    _lastViewport = [-1, -1],
    _viewPorts = [],
    _lastDevicePixelRatio = window.devicePixelRatio,
    _lastTarget = null,
    _lastKey = -1,
    _textLengths = {},
    _hasFallbackListeners = !1,
    _env = {
      ptype: null,
      ptypes: {},
      k229: 0,
      kn: 0,
      tz: new Date().getTimezoneOffset(),
      pr: window.devicePixelRatio,
      u: {},
      f: null,
    },
    _global = {
      meta: {},
      events: [],
    },
    _browsers = {
      isAndroid: /android (\d+)/i.test(window.navigator.userAgent),
      isFirefox: /firefox/i.test(window.navigator.userAgent),
    },
    VERSION = 277,
    RUNNING_STATE = {
      STARTED: 1,
      STOPPED: 0,
    },
    _state = RUNNING_STATE.STOPPED,
    DEFAULT_CONFIG = {
      autoload: !0,
      container: null,
      restriction: null,
      targetName: null,
      collectMouse: !0,
      collectMouseMovement: !0,
      ignoreFields: {
        by_id: [],
        by_name: [],
        by_selector: [],
      },
      anonymous: {
        by_name: [],
        by_id: [],
        by_type: [],
        by_selector: [],
      },
      masked: {
        by_name: [],
        by_id: [],
        by_type: ['password'],
        by_selector: [],
      },
      normal: {
        by_name: [],
        by_id: [],
        by_type: [],
        by_selector: [],
      },
      metaPageId: 'bwpageid',
      pageIdCallback: null,
      mouseLimit: null,
      defaultTargetType: 'f',
    },
    _config = {},
    _cachedIgnoreFields = {
      ids: {},
      names: {},
      selectors: [],
    },
    _cachedAnonymousFields = {
      ids: {},
      names: {},
      types: {},
      selectors: [],
    },
    _cachedMaskedFields = {
      ids: {},
      names: {},
      types: {},
      selectors: [],
    },
    _cachedNormalFields = {
      ids: {},
      names: {},
      types: {},
      selectors: [],
    },
    _container = null;

  function setCookie() {
    const uuid = 'behaviosec-session=' + uuidv4();
    console.log(uuid);
    document.cookie = uuid;
  }

  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  }
  function _default_target_name(node) {
    return node.type + '#' + (node.name || node.id);
  }

  function configure(cfg) {
    if (!isStarted()) {
      var idx, cacheField;
      for (idx in ((_config = {
        collectMouse: void 0 !== (cfg = cfg || {}).collectMouse ? cfg.collectMouse : DEFAULT_CONFIG.collectMouse,
        collectMouseMovement: void 0 !== cfg.collectMouseMovement ? cfg.collectMouseMovement : DEFAULT_CONFIG.collectMouseMovement,
        ignoreFields: {
          by_id: cfg.ignoreFields && void 0 !== cfg.ignoreFields.by_id ? cfg.ignoreFields.by_id : DEFAULT_CONFIG.ignoreFields.by_id,
          by_name: cfg.ignoreFields && void 0 !== cfg.ignoreFields.by_name ? cfg.ignoreFields.by_name : DEFAULT_CONFIG.ignoreFields.by_name,
          by_selector:
            cfg.ignoreFields && void 0 !== cfg.ignoreFields.by_selector
              ? cfg.ignoreFields.by_selector
              : DEFAULT_CONFIG.ignoreFields.by_selector,
        },
        anonymous: {
          by_id: cfg.anonymous && void 0 !== cfg.anonymous.by_id ? cfg.anonymous.by_id : DEFAULT_CONFIG.anonymous.by_id,
          by_name: cfg.anonymous && void 0 !== cfg.anonymous.by_name ? cfg.anonymous.by_name : DEFAULT_CONFIG.anonymous.by_name,
          by_type: cfg.anonymous && void 0 !== cfg.anonymous.by_type ? cfg.anonymous.by_type : DEFAULT_CONFIG.anonymous.by_type,
          by_selector:
            cfg.anonymous && void 0 !== cfg.anonymous.by_selector ? cfg.anonymous.by_selector : DEFAULT_CONFIG.anonymous.by_selector,
        },
        masked: {
          by_id: cfg.masked && void 0 !== cfg.masked.by_id ? cfg.masked.by_id : DEFAULT_CONFIG.masked.by_id,
          by_name: cfg.masked && void 0 !== cfg.masked.by_name ? cfg.masked.by_name : DEFAULT_CONFIG.masked.by_name,
          by_type: cfg.masked && void 0 !== cfg.masked.by_type ? cfg.masked.by_type : DEFAULT_CONFIG.masked.by_type,
          by_selector: cfg.masked && void 0 !== cfg.masked.by_selector ? cfg.masked.by_selector : DEFAULT_CONFIG.masked.by_selector,
        },
        normal: {
          by_id: cfg.normal && void 0 !== cfg.normal.by_id ? cfg.normal.by_id : DEFAULT_CONFIG.normal.by_id,
          by_name: cfg.normal && void 0 !== cfg.normal.by_name ? cfg.normal.by_name : DEFAULT_CONFIG.normal.by_name,
          by_type: cfg.normal && void 0 !== cfg.normal.by_type ? cfg.normal.by_type : DEFAULT_CONFIG.normal.by_type,
          by_selector: cfg.normal && void 0 !== cfg.normal.by_selector ? cfg.normal.by_selector : DEFAULT_CONFIG.normal.by_selector,
        },
        metaPageId: cfg.metaPageId ? cfg.metaPageId : DEFAULT_CONFIG.metaPageId,
        pageIdCallback: 'function' == typeof cfg.pageIdCallback ? cfg.pageIdCallback : DEFAULT_CONFIG.pageIdCallback,
        autoload: void 0 !== cfg.autoload ? cfg.autoload : DEFAULT_CONFIG.autoload,
        container: cfg.container,
        restriction: 'function' == typeof cfg.restriction ? cfg.restriction : null,
        targetName: cfg.targetName,
        mouseLimit: cfg.mouseLimit,
        defaultMonitorType: (function parseDefaultMonitortType(targetType, defaultMonitorType) {
          {
            if ('f' === targetType) return 'n';
            if ('fa' === targetType) return 'a';
            if ('fm' === targetType) return 'm';
          }
          return parseDefaultMonitortType(defaultMonitorType, 'f');
        })(cfg.defaultTargetType, DEFAULT_CONFIG.defaultTargetType),
      }),
      (_cachedIgnoreFields = {
        ids: {},
        names: {},
        selectors: [],
      }),
      (_cachedAnonymousFields = {
        ids: {},
        names: {},
        types: {},
        selectors: [],
      }),
      (_cachedMaskedFields = {
        ids: {},
        names: {},
        types: {},
        selectors: [],
      }),
      (_cachedNormalFields = {
        ids: {},
        names: {},
        types: {},
        selectors: [],
      }),
      _config.ignoreFields.by_id))
        (cacheField = _config.ignoreFields.by_id[idx]), (_cachedIgnoreFields.ids[cacheField] = !0);
      for (idx in _config.ignoreFields.by_name)
        (cacheField = _config.ignoreFields.by_name[idx]), (_cachedIgnoreFields.names[cacheField] = !0);
      var dummySelectorTarget = document.createElement('div');
      for (idx in _config.ignoreFields.by_selector) {
        cacheField = _config.ignoreFields.by_selector[idx];
        try {
          dummySelectorTarget.matches(cacheField), _cachedIgnoreFields.selectors.push(cacheField);
        } catch (err) {
          0;
        }
      }
      for (idx in _config.anonymous.by_id) (cacheField = _config.anonymous.by_id[idx]), (_cachedAnonymousFields.ids[cacheField] = !0);
      for (idx in _config.anonymous.by_name) (cacheField = _config.anonymous.by_name[idx]), (_cachedAnonymousFields.names[cacheField] = !0);
      for (idx in _config.anonymous.by_type) (cacheField = _config.anonymous.by_type[idx]), (_cachedAnonymousFields.types[cacheField] = !0);
      for (idx in _config.anonymous.by_selector) {
        cacheField = _config.anonymous.by_selector[idx];
        try {
          dummySelectorTarget.matches(cacheField), _cachedAnonymousFields.selectors.push(cacheField);
        } catch (err) {
          0;
        }
      }
      for (idx in _config.masked.by_id) (cacheField = _config.masked.by_id[idx]), (_cachedMaskedFields.ids[cacheField] = !0);
      for (idx in _config.masked.by_name) (cacheField = _config.masked.by_name[idx]), (_cachedMaskedFields.names[cacheField] = !0);
      for (idx in _config.masked.by_type) (cacheField = _config.masked.by_type[idx]), (_cachedMaskedFields.types[cacheField] = !0);
      for (idx in _config.masked.by_selector) {
        cacheField = _config.masked.by_selector[idx];
        try {
          dummySelectorTarget.matches(cacheField), _cachedMaskedFields.selectors.push(cacheField);
        } catch (err) {
          0;
        }
      }
      for (idx in _config.normal.by_id) (cacheField = _config.normal.by_id[idx]), (_cachedNormalFields.ids[cacheField] = !0);
      for (idx in _config.normal.by_name) (cacheField = _config.normal.by_name[idx]), (_cachedNormalFields.names[cacheField] = !0);
      for (idx in _config.normal.by_type) (cacheField = _config.normal.by_type[idx]), (_cachedNormalFields.types[cacheField] = !0);
      for (idx in _config.normal.by_selector) {
        cacheField = _config.normal.by_selector[idx];
        try {
          dummySelectorTarget.matches(cacheField), _cachedNormalFields.selectors.push(cacheField);
        } catch (err) {
          0;
        }
      }
    }
  }

  function addMovementEvent(data) {
    for (var l, i = _data.length - 1; -1 <= i; i--) {
      if (-1 === i) {
        (l = null == _data[0] ? 0 : _data.length),
          (_data[l] = []),
          (_data[l][0] = 'c'),
          (_data[l][1] = []),
          (_data[l][1][0] = data),
          (_data[l][2] = window.location.pathname.split('?')[0]);
        break;
      }
      if ('c' === _data[i][0]) {
        _data[i][1][_data[i][1].length] = data;
        break;
      }
    }
  }

  function checkTarget(event, timestamp) {
    var element = document.elementFromPoint(event.clientX, event.clientY),
      data = [];
    null !== element &&
      element !== _lastTarget &&
      void 0 !== element &&
      void 0 !== element.parentNode &&
      ((data[0] = 't'),
      (data[1] = element.nodeName + '#' + element.id + '#' + element.parentNode.nodeName + '#' + element.parentNode.id),
      (data[2] = timestamp || getTimestamp()),
      (_lastTarget = element),
      addMovementEvent(data));
  }

  function checkViewport(timestamp) {
    var data;
    (_lastViewport[0] === document.documentElement.clientWidth && _lastViewport[1] === document.documentElement.clientHeight) ||
      (((data = [])[0] = 'v'),
      (data[1] = document.documentElement.clientWidth),
      (data[2] = document.documentElement.clientHeight),
      (data[3] = timestamp || getTimestamp()),
      (_lastViewport[0] = document.documentElement.clientWidth),
      (_lastViewport[1] = document.documentElement.clientHeight),
      _viewPorts.push(data),
      addMovementEvent(data));
  }

  function checkDevicePixelRatio() {
    _lastDevicePixelRatio !== window.devicePixelRatio && addGlobalEvent('G', (_lastDevicePixelRatio = window.devicePixelRatio));
  }

  function getTimestamp() {
    return new Date().getTime() - _startTimestamp;
  }

  function isStarted() {
    return _state === RUNNING_STATE.STARTED;
  }

  function reset() {
    var i,
      _navigator = {};
    for (i in window.navigator) _navigator[i] = window.navigator[i];
    delete _navigator.plugins, delete _navigator.mimeTypes;
    var loaded,
      events,
      ticks,
      last,
      tx,
      _screen = {};
    for (i in window.screen) _screen[i] = window.screen[i];
    (_startTimestamp = new Date().getTime()),
      (_env = {
        ptype: null,
        ptypes: {},
        k229: 0,
        kn: 0,
        tz: new Date().getTimezoneOffset(),
        pr: window.devicePixelRatio,
        u: {},
        f: null,
      }),
      (_lastViewport = [-1, -1]),
      (_viewPorts = []),
      (_global = {
        meta: {},
        events: [],
      }),
      (_dataIntegrity = {}),
      (_dataIntegrityArray = ['w', [], getPageIdentifier()]),
      ((_data = [])[0] = ['m', 'n', _navigator]),
      (_data[1] = ['m', 's', _screen]),
      (_data[2] = ['m', 'v', VERSION]),
      (_data[3] = ['m', 'e', _env]),
      (_data[4] = ['m', 'k', _global.meta, _global.events]),
      (_data[5] = _dataIntegrityArray),
      addGlobalEvent('Z', new Date().getTime()),
      addIntegrityInputs('input'),
      addIntegrityInputs('textarea'),
      document.body
        ? (_env.f = clientInfo())
        : ((loaded = function () {
            (_env.f = clientInfo()), document.removeEventListener('DOMContentLoaded', loaded);
          }),
          document.addEventListener('DOMContentLoaded', loaded)),
      (events = {}),
      (ticks = 0),
      (last = Math.round(window.performance && window.performance.now ? window.performance.now() : new Date().getTime())),
      (tx = setInterval(function () {
        var n = Math.round(window.performance && window.performance.now ? window.performance.now() : new Date().getTime());
        (events[n - last] = (events[n - last] || 0) + 1), (last = n), 100 < ++ticks && clearInterval(tx);
      }, 10)),
      setTimeout(function () {
        clearInterval(tx), (_env.u = events);
      }, 1e3);
  }

  function startMonitor(cfg) {
    var container;
    isStarted() ||
      (cfg && configure(cfg),
      _state !== RUNNING_STATE.STARTED && (_state = RUNNING_STATE.STARTED),
      (container = getContainer(_config.container)),
      (_container = container),
      reset(),
      document.addEventListener
        ? (container.addEventListener('keydown', keyHandler, !0),
          container.addEventListener('keyup', keyHandler, !0),
          container.addEventListener('input', onChangeHandler, !0),
          _browsers.isAndroid && !_browsers.isFirefox && fallbackListeners())
        : document.attachEvent && (container.attachEvent('onkeydown', keyHandler), container.attachEvent('onkeyup', keyHandler)),
      _config.collectMouse &&
        (document.addEventListener
          ? (window.PointerEvent
              ? (document.addEventListener('pointerdown', pointerDownHandler, !1),
                document.addEventListener('pointerup', pointerUpHandler, !1),
                _config.collectMouseMovement && document.addEventListener('pointermove', pointerMoveHandler, !1))
              : ((_env.ptype = 'mm'),
                document.addEventListener('mousedown', mouseDownHandler, !1),
                document.addEventListener('mouseup', mouseUpHandler, !1),
                _config.collectMouseMovement && document.addEventListener('mousemove', mouseMoveHandler, !1)),
            'onwheel' in document
              ? window.addEventListener('wheel', wheelHandler, !1)
              : void 0 !== document.onmousewheel
              ? window.addEventListener('mousewheel', wheelHandler, !1)
              : document.addEventListener && window.addEventListener('DOMMouseScroll', wheelHandler),
            window.addEventListener('scroll', scrollHandler))
          : document.attachEvent &&
            ((_env.ptype = 'mm'),
            document.attachEvent('onmousedown', mouseDownHandler),
            document.attachEvent('onmouseup', mouseUpHandler),
            _config.collectMouseMovement && document.attachEvent('onmousemove', mouseMoveHandler, !1),
            document.attachEvent('onmousewheel', wheelHandler),
            document.attachEvent('onscroll', scrollHandler))),
      void 0 !== document.visibilityState
        ? document.addEventListener('visibilitychange', visibilityHandler, !1)
        : void 0 !== document.mozHidden
        ? document.addEventListener('mozvisibilitychange', visibilityHandler, !1)
        : void 0 !== document.webkitHidden
        ? document.addEventListener('webkitvisibilitychange', visibilityHandler, !1)
        : void 0 !== document.msHidden && document.addEventListener('msvisibilitychange', visibilityHandler, !1),
      document.addEventListener
        ? (document.addEventListener('copy', targetHandler, !0),
          document.addEventListener('paste', targetHandler, !0),
          document.addEventListener('cut', targetHandler, !0))
        : document.attachEvent && document.body && document.body.attachEvent('onpaste', targetHandler),
      document.addEventListener
        ? document.addEventListener('contextmenu', targetHandler, !0)
        : document.attachEvent && document.attachEvent('oncontextmenu', targetHandler),
      document.addEventListener
        ? (document.addEventListener('focus', targetHandler, !0),
          document.addEventListener('blur', targetHandler, !0),
          window.addEventListener('focus', windowHandler, !1),
          window.addEventListener('blur', windowHandler, !1))
        : document.attachEvent &&
          (document.attachEvent('onfocus', targetHandler),
          document.attachEvent('onblur', targetHandler),
          window.attachEvent('onfocus', windowHandler),
          window.attachEvent('onblur', windowHandler)),
      document.addEventListener
        ? document.addEventListener('submit', targetHandler, !0)
        : document.attachEvent && document.attachEvent('onsubmit', targetHandler),
      document.addEventListener
        ? (document.addEventListener('mouseup', targetHandler), document.addEventListener('mousedown', targetHandler))
        : document.attachEvent && (document.attachEvent('onmouseup', targetHandler), document.attachEvent('onmousedown', targetHandler)),
      document.addEventListener
        ? (document.addEventListener('keydown', globalKeyHandler), document.addEventListener('keyup', globalKeyHandler))
        : document.attachEvent && (document.attachEvent('onkeydown', globalKeyHandler), document.attachEvent('onkeyup', globalKeyHandler)),
      document.addEventListener && document.addEventListener('DOMContentLoaded', globalDOMLoadedHandler),
      'string' == typeof _config.stateChangeEventListener &&
        window.addEventListener(_config.stateChangeEventListener, globalStateChangeHandler));
  }

  function stopGlobalListeners() {
    void 0 !== document.visibilityState
      ? document.removeEventListener('visibilitychange', visibilityHandler, !1)
      : void 0 !== document.mozHidden
      ? document.removeEventListener('mozvisibilitychange', visibilityHandler, !1)
      : void 0 !== document.webkitHidden
      ? document.removeEventListener('webkitvisibilitychange', visibilityHandler, !1)
      : void 0 !== document.msHidden && document.removeEventListener('msvisibilitychange', visibilityHandler, !1),
      document.addEventListener
        ? (document.removeEventListener('copy', targetHandler, !0),
          document.removeEventListener('paste', targetHandler, !0),
          document.removeEventListener('cut', targetHandler, !0))
        : document.attachEvent && document.body && document.body.detachEvent('onpaste', targetHandler),
      document.addEventListener
        ? document.removeEventListener('contextmenu', targetHandler, !0)
        : document.attachEvent && document.detachEvent('oncontextmenu', targetHandler),
      document.addEventListener
        ? (document.removeEventListener('focus', targetHandler, !0),
          document.removeEventListener('blur', targetHandler, !0),
          window.removeEventListener('focus', windowHandler, !1),
          window.removeEventListener('blur', windowHandler, !1))
        : document.attachEvent &&
          (document.detachEvent('onfocus', targetHandler),
          document.detachEvent('onblur', targetHandler),
          window.detachEvent('onfocus', windowHandler),
          window.detachEvent('onblur', windowHandler)),
      document.addEventListener
        ? document.removeEventListener('submit', targetHandler, !0)
        : document.attachEvent && document.detachEvent('onsubmit', targetHandler),
      document.addEventListener
        ? (document.removeEventListener('mouseup', targetHandler), document.removeEventListener('mousedown', targetHandler))
        : document.attachEvent && (document.detachEvent('onmouseup', targetHandler), document.detachEvent('onmousedown', targetHandler)),
      document.addEventListener
        ? (document.removeEventListener('keydown', globalKeyHandler), document.removeEventListener('keyup', globalKeyHandler))
        : document.attachEvent && (document.detachEvent('onkeydown', globalKeyHandler), document.detachEvent('onkeyup', globalKeyHandler)),
      document.addEventListener && document.removeEventListener('DOMContentLoaded', globalDOMLoadedHandler),
      'string' == typeof _config.stateChangeEventListener &&
        window.removeEventListener(_config.stateChangeEventListener, globalStateChangeHandler);
  }

  function stopMonitor() {
    _state !== RUNNING_STATE.STOPPED && (_state = RUNNING_STATE.STOPPED);
    var container = getContainer(_container || _config.container);
    document.removeEventListener
      ? (container.removeEventListener('keydown', keyHandler, !0),
        container.removeEventListener('keyup', keyHandler, !0),
        container.removeEventListener('input', onChangeHandler, !0),
        document.removeEventListener('keydown', keyHandler, !0),
        document.removeEventListener('keyup', keyHandler, !0),
        document.removeEventListener('input', onChangeHandler, !0),
        document.removeEventListener('textInput', keyTransformer, !1),
        document.removeEventListener('compositionupdate', keyComposition, !1),
        (_hasFallbackListeners = !1))
      : document.detachEvent &&
        (container.detachEvent('onkeydown', keyHandler),
        container.detachEvent('onkeyup', keyHandler),
        document.detachEvent('onkeydown', keyHandler),
        document.detachEvent('onkeyup', keyHandler)),
      document.addEventListener
        ? window.PointerEvent
          ? (document.removeEventListener('pointerdown', pointerDownHandler, !1),
            document.removeEventListener('pointerup', pointerUpHandler, !1),
            _config.collectMouseMovement && document.removeEventListener('pointermove', pointerMoveHandler, !1))
          : (document.removeEventListener('mousedown', mouseDownHandler, !1),
            document.removeEventListener('mouseup', mouseUpHandler, !1),
            _config.collectMouseMovement && document.removeEventListener('mousemove', mouseMoveHandler, !1))
        : document.attachEvent &&
          ((_env.ptype = 'mm'),
          document.detachEvent('onmousedown', mouseDownHandler),
          document.detachEvent('onmouseup', mouseUpHandler),
          _config.collectMouseMovement && document.detachEvent('onmousemove', mouseMoveHandler, !1)),
      stopGlobalListeners();
  }

  function getBehavioData() {
    if (
      ((_dataIntegrityArray[1] = (function () {
        var fields = [];
        for (var f in (addIntegrityInputs('input'), addIntegrityInputs('textarea'), _dataIntegrity)) {
          var fieldIntegrity = {};
          (fieldIntegrity[f] = _dataIntegrity[f]), fields.push(fieldIntegrity);
        }
        for (var i = 0; i < _data.length; ++i)
          if ('c' === _data[i][0]) {
            fields.push({
              movement: 0,
            });
            break;
          }
        return fields;
      })()),
      (_dataIntegrityArray[2] = getPageIdentifier()),
      _config.mouseLimit)
    ) {
      for (var mouseData = null, index = null, i = 0; i < _data.length; i++) {
        var item = _data[i];
        item && 'c' === item[0] && ((mouseData = item[1]), (index = i));
      }
      if (mouseData && mouseData.length > _config.mouseLimit) {
        if (3 !== (mouseData = mouseData.slice(-_config.mouseLimit))[0][0])
          for (i = _viewPorts.length - 1; 0 <= i; i--)
            if (_viewPorts[i][3] <= mouseData[0][3]) {
              mouseData[0] = _viewPorts[i];
              break;
            }
        _data[index][1] = mouseData;
      }
    }
    return _data;
  }

  function getData(resetData, stopCollector) {
    _state === RUNNING_STATE.STOPPED && (configure(), reset());
    var data = JSON.stringify(getBehavioData());
    return resetData && reset(), stopCollector && stopMonitor(), data;
  }

  function keyHandler(event) {
    var field,
      monitorType,
      sel,
      selLength,
      s,
      ul,
      dl,
      targetData,
      prevKey,
      target,
      len,
      data = [],
      keyCode = 0 === event.keyCode ? 229 : event.keyCode,
      keyId = keyCode,
      source = event.target || event.srcElement,
      caretPos = 0;
    if (
      !(
        ('text' !== source.type &&
          'password' !== source.type &&
          'date' !== source.type &&
          'datetime-local' !== source.type &&
          'email' !== source.type &&
          'month' !== source.type &&
          'number' !== source.type &&
          'search' !== source.type &&
          'tel' !== source.type &&
          'time' !== source.type &&
          'url' !== source.type &&
          'week' !== source.type &&
          'textarea' !== source.type) ||
        _cachedIgnoreFields.names[source.name] ||
        _cachedIgnoreFields.ids[source.id] ||
        matchesQuerySelector(source, _cachedIgnoreFields.selectors) ||
        (null !== _config.restriction && !_config.restriction(source))
      )
    ) {
      if (
        (229 !== keyCode ||
          'keydown' !== event.type ||
          _browsers.isFirefox ||
          _hasFallbackListeners ||
          (fallbackListeners(), (_hasFallbackListeners = !0)),
        (field = _config.targetName ? _config.targetName(source) : _default_target_name(source)),
        null == keyCode && (keyId = keyCode = -500),
        'a' ===
          (monitorType = (function (field) {
            {
              if (
                _cachedMaskedFields.ids[field.id] ||
                _cachedMaskedFields.names[field.name] ||
                matchesQuerySelector(field, _cachedMaskedFields.selectors)
              )
                return 'm';
              if (
                _cachedAnonymousFields.ids[field.id] ||
                _cachedAnonymousFields.names[field.name] ||
                matchesQuerySelector(field, _cachedAnonymousFields.selectors)
              )
                return 'a';
              if (
                _cachedNormalFields.ids[field.id] ||
                _cachedNormalFields.names[field.name] ||
                matchesQuerySelector(field, _cachedNormalFields.selectors)
              )
                return 'n';
              if (_cachedMaskedFields.types[field.type]) return 'm';
              if (_cachedAnonymousFields.types[field.type]) return 'a';
              if (_cachedNormalFields.types[field.type]) return 'n';
            }
            return _config.defaultMonitorType;
          })(source)))
      ) {
        if (9 === keyCode || 13 === keyCode) return;
        document.selection
          ? (source.focus(),
            (sel = document.selection.createRange()),
            (selLength = document.selection.createRange().text.length),
            sel.moveStart('character', -source.value.length),
            (caretPos = sel.text.length - selLength))
          : (!source.selectionStart && 0 !== source.selectionStart) || (caretPos = source.selectionStart),
          8 === keyCode
            ? 'keydown' === event.type
              ? (null == _anonMap[keyCode] && (_anonMap[keyCode] = caretPos), (data[0] = -1), (data[1] = caretPos))
              : 'keyup' === event.type && ((data[0] = -2), (data[1] = _anonMap[keyCode]), (_anonMap[keyCode] = null))
            : 46 === keyCode
            ? 'keydown' === event.type
              ? (null == _anonMap[keyCode] && (_anonMap[keyCode] = caretPos), (data[0] = -3), (data[1] = caretPos))
              : 'keyup' === event.type && ((data[0] = -4), (data[1] = _anonMap[keyCode]), (_anonMap[keyCode] = null))
            : 'keydown' === event.type
            ? (null == _anonMap[keyCode] && (_anonMap[keyCode] = caretPos), (data[0] = 0), (data[1] = caretPos))
            : 'keyup' === event.type && ((data[0] = 1), (data[1] = _anonMap[keyCode]), (_anonMap[keyCode] = null));
      } else {
        'm' === monitorType
          ? (document.selection
              ? (source.focus(),
                (sel = document.selection.createRange()),
                (selLength = document.selection.createRange().text.length),
                sel.moveStart('character', -source.value.length),
                (caretPos = sel.text.length - selLength))
              : (!source.selectionStart && 0 !== source.selectionStart) || (caretPos = source.selectionStart),
            (caretPos = -1 * (caretPos + 1)),
            (keyCode < 47 && 32 != keyCode) || (90 < keyCode && keyCode < 96) || (112 <= keyCode && keyCode <= 123) || 144 == keyCode
              ? 'keydown' === event.type
                ? ((_lastKey = -1), (data[0] = 0), (data[1] = keyId))
                : 'keyup' === event.type && ((data[0] = 1), (data[1] = keyId), (_anonMap[keyCode] = null))
              : 'keydown' === event.type
              ? (null == _anonMap[keyCode] && (_anonMap[keyCode] = caretPos), (data[0] = 0), (data[1] = caretPos))
              : 'keyup' === event.type && ((data[0] = 1), (data[1] = _anonMap[keyCode]), (_anonMap[keyCode] = null)))
          : (229 === keyCode && 'keydown' === event.type
              ? ((target = field), (len = source.value.length), (_textLengths[target] = _textLengths[target] || []).push(len))
              : 229 === keyCode &&
                'keyup' === event.type &&
                ((s = _textLengths[field] || []),
                (ul = source.value.length),
                (dl = s.pop() || 0),
                (-1 !== _lastKey || ul < dl) &&
                  (ul - dl <= 1 && (keyId = ul < dl ? 8 : _lastKey),
                  229 ===
                    (prevKey = (targetData = (function (target) {
                      for (var i = _data.length - 1; 0 <= i; i--) if (_data[i][1] === target) return _data[i][2];
                    })(field))[targetData.length - 1])[1] && (prevKey[1] = keyId),
                  (_lastKey = -1))),
            'keyup' === event.type
              ? ((_lastKey = -1), (data[0] = 1), (data[1] = keyId))
              : 'keydown' === event.type && ((data[0] = 0), (data[1] = keyId)));
      }
      (data[2] = getTimestamp()),
        229 === keyCode ? _env.k229++ : _env.kn++,
        null != data[1] &&
          ((function (target, monitorType, data) {
            for (var l, i = _data.length - 1; -1 <= i; i--) {
              if (-1 === i) {
                null == _data[0]
                  ? ((_data[0] = []),
                    'a' === monitorType
                      ? (_data[0][0] = 'fa')
                      : 'n' === monitorType
                      ? (_data[0][0] = 'f')
                      : 'm' === monitorType && (_data[0][0] = 'fm'),
                    (_data[0][1] = target),
                    (_data[0][2] = []),
                    (_data[0][2][0] = data))
                  : ((l = _data.length),
                    (_data[l] = []),
                    'a' === monitorType
                      ? (_data[l][0] = 'fa')
                      : 'n' === monitorType
                      ? (_data[l][0] = 'f')
                      : 'm' === monitorType && (_data[l][0] = 'fm'),
                    (_data[l][1] = target),
                    (_data[l][2] = []),
                    (_data[l][2][0] = data));
                break;
              }
              if ('a' === monitorType) {
                if ('fa' !== _data[i][0]) continue;
              } else if ('n' === monitorType) {
                if ('f' !== _data[i][0]) continue;
              } else if ('m' === monitorType && 'fm' !== _data[i][0]) continue;
              if (_data[i][1] === target) {
                _data[i][2][_data[i][2].length] = data;
                break;
              }
            }
          })(field, monitorType, data),
          (_dataIntegrity[field] = source.value.length));
    }
  }

  function matchesQuerySelector(field, selectors) {
    for (var i = 0; i < selectors.length; i++) {
      var selector = selectors[i];
      if (field.matches(selector)) return 1;
    }
  }

  function pointerMoveHandler(event) {
    if (event.getCoalescedEvents) {
      var events = event.getCoalescedEvents() || [];
      0 === events.length && events.push(event);
      for (var base = getTimestamp(), lastTimestamp = event.timeStamp, i = 0; i < events.length; i++) {
        var e = events[i],
          tse = base - Math.round(lastTimestamp - (e.timeStamp || lastTimestamp));
        ((data = [])[0] = 'mm'),
          (data[1] = e.clientX),
          (data[2] = e.clientY),
          checkTarget(event, (data[3] = tse)),
          checkViewport(tse),
          addMovementEvent(data);
        var pt = e.pointerType || 'unknown';
        _env.ptypes[pt] = (_env.ptypes[pt] || 0) + 1;
      }
      _env.ptype = 'pc';
    } else {
      var data,
        ts = getTimestamp();
      ((data = [])[0] = 'mm'),
        (data[1] = event.clientX),
        (data[2] = event.clientY),
        checkTarget(event, (data[3] = ts)),
        checkViewport(ts),
        addMovementEvent(data);
      pt = event.pointerType || 'unknown';
      (_env.ptypes[pt] = (_env.ptypes[pt] || 0) + 1), (_env.ptype = 'pm');
    }
  }

  function pointerDownHandler(event) {
    var ts = getTimestamp(),
      data = [];
    (data[0] = 'md'),
      (data[1] = event.clientX),
      (data[2] = event.clientY),
      (data[3] = ts),
      (data[4] = event.button),
      checkTarget(event, ts),
      checkViewport(ts),
      checkDevicePixelRatio(),
      addMovementEvent(data);
    var pt = event.pointerType || 'unknown';
    _env.ptypes[pt] = (_env.ptypes[pt] || 0) + 1;
  }

  function pointerUpHandler(event) {
    var ts = getTimestamp(),
      data = [];
    (data[0] = 'mu'),
      (data[1] = event.clientX),
      (data[2] = event.clientY),
      (data[3] = ts),
      (data[4] = event.button),
      checkTarget(event, ts),
      checkViewport(ts),
      checkDevicePixelRatio(),
      addMovementEvent(data);
    var pt = event.pointerType || 'unknown';
    _env.ptypes[pt] = (_env.ptypes[pt] || 0) + 1;
  }

  function mouseMoveHandler(event) {
    var data = [];
    (data[0] = 'mm'),
      (data[1] = event.clientX),
      (data[2] = event.clientY),
      (data[3] = getTimestamp()),
      checkTarget(event),
      checkViewport(),
      addMovementEvent(data);
  }

  function mouseDownHandler(event) {
    var data = [];
    (data[0] = 'md'),
      (data[1] = event.clientX),
      (data[2] = event.clientY),
      (data[3] = getTimestamp()),
      (data[4] = event.button),
      checkTarget(event),
      checkViewport(),
      checkDevicePixelRatio(),
      addMovementEvent(data);
  }

  function mouseUpHandler(event) {
    var data = [];
    (data[0] = 'mu'),
      (data[1] = event.clientX),
      (data[2] = event.clientY),
      (data[3] = getTimestamp()),
      (data[4] = event.button),
      checkTarget(event),
      checkViewport(),
      checkDevicePixelRatio(),
      addMovementEvent(data);
  }

  function wheelHandler() {
    addGlobalStats('M'), checkDevicePixelRatio();
  }

  function scrollHandler() {
    addGlobalStats('k'), checkDevicePixelRatio();
  }

  function setLastKey(k) {
    _lastKey = k;
  }

  function keyTransformer(e) {
    e.data && 1 === e.data.length && setLastKey(e.data.toUpperCase().charCodeAt(0));
  }

  function keyComposition(e) {
    e.data && setLastKey(e.data.toUpperCase().charCodeAt(e.data.length - 1));
  }

  function fallbackListeners(field) {
    field && field.addEventListener
      ? (field.addEventListener('textInput', keyTransformer, !1), field.addEventListener('compositionupdate', keyComposition, !1))
      : document.addEventListener &&
        (document.addEventListener('textInput', keyTransformer, !1), document.addEventListener('compositionupdate', keyComposition, !1));
  }

  function addIntegrityInputs(type) {
    for (var inputs = getContainer(_container || _config.container).getElementsByTagName(type), i = 0; i < inputs.length; i++) {
      var name,
        field = inputs[i];
      ('text' !== field.type &&
        'password' !== field.type &&
        'date' !== field.type &&
        'datetime-local' !== field.type &&
        'email' !== field.type &&
        'month' !== field.type &&
        'number' !== field.type &&
        'search' !== field.type &&
        'tel' !== field.type &&
        'time' !== field.type &&
        'url' !== field.type &&
        'week' !== field.type &&
        'textarea' !== field.type) ||
        _cachedIgnoreFields.names[field.name] ||
        _cachedIgnoreFields.ids[field.id] ||
        matchesQuerySelector(field, _cachedIgnoreFields.selectors) ||
        (null !== _config.restriction && !_config.restriction(field)) ||
        ((name = _config.targetName ? _config.targetName(field) : _default_target_name(field)),
        (_dataIntegrity[name] = field.value.length));
    }
  }

  function onChangeHandler(event) {
    var target,
      field = event.target || event.srcElement;
    ('text' !== field.type &&
      'password' !== field.type &&
      'date' !== field.type &&
      'datetime-local' !== field.type &&
      'email' !== field.type &&
      'month' !== field.type &&
      'number' !== field.type &&
      'search' !== field.type &&
      'tel' !== field.type &&
      'time' !== field.type &&
      'url' !== field.type &&
      'week' !== field.type &&
      'textarea' !== field.type) ||
      _cachedIgnoreFields.names[field.name] ||
      _cachedIgnoreFields.ids[field.id] ||
      (null !== _config.restriction && !_config.restriction(field)) ||
      ((target = _config.targetName ? _config.targetName(field) : _default_target_name(field)),
      (_dataIntegrity[target] = field.value.length));
  }

  function getContainer(container) {
    if ((0, 'string' == typeof container)) {
      var element = document.querySelector(container);
      if (element) return element;
      0;
    } else if (container && (container.addEventListener || container.attachEvent)) return container;
    return document;
  }

  function getPageIdentifier() {
    if (_config.pageIdCallback) return _config.pageIdCallback();
    var path = (function (metaName) {
      for (var retVal = '', b = document.getElementsByTagName('meta'), a = 0; a < b.length; a++)
        (metaName !== b[a].name && metaName !== b[a].getAttribute('property')) || (retVal = b[a].content);
      return retVal;
    })(_config.metaPageId);
    return path || window.location.pathname.split('?')[0] || '/';
  }

  function getElementIdentifier(e) {
    var element = e.target || e.srcElement || {};
    return element.type && (element.id || element.name)
      ? _config.targetName
        ? _config.targetName(element)
        : _default_target_name(element)
      : element && element.parentNode
      ? element.nodeName +
        '#' +
        (element.id || element.name || '') +
        '#' +
        element.parentNode.nodeName +
        '#' +
        (element.parentNode.id || element.parentNode.name || '')
      : e.nodeName
      ? e.nodeName
      : void 0;
  }

  function addGlobalEvent(kind, payload) {
    _global.events.push([kind, getTimestamp(), payload]);
  }

  function addGlobalStats(kind) {
    _global.meta[kind] = kind in _global.meta ? ++_global.meta[kind] : 1;
  }

  function visibilityHandler() {
    var s = document.visibilityState;
    s ? addGlobalEvent('o', s) : addGlobalEvent('p', document.hidden);
  }

  function targetHandler(e) {
    addGlobalEvent(
      (function (type) {
        switch (type) {
          case 'mousedown':
            return 'D';
          case 'mouseup':
            return 'E';
          case 'submit':
            return 'i';
          case 'focus':
            return 'n';
          case 'blur':
            return 'U';
          case 'paste':
            return 'z';
          case 'copy':
            return 'u';
          case 'cut':
            return 'c';
          case 'contextmenu':
            return 'X';
          default:
            return 'T';
        }
      })(e.type),
      getElementIdentifier(e)
    );
  }

  function windowHandler(e) {
    addGlobalEvent(
      (function (type) {
        switch (type) {
          case 'blur':
            return 'r';
          case 'focus':
            return 'v';
          default:
            return 'I';
        }
      })(e.type),
      ''
    );
  }

  function globalKeyHandler(e) {
    var kind = 'keydown' === e.type ? 'a' : 's',
      target = e.target || e.srcElement,
      key = e.which || e.keyCode;
    9 === key || 'Tab' === e.key
      ? addGlobalEvent(kind + 'f', getElementIdentifier(e))
      : 13 === key || 'Enter' === e.key
      ? addGlobalEvent(kind + 'v', getElementIdentifier(e))
      : 16 === key || 'Shift' === e.key
      ? addGlobalEvent(kind + 'n', getElementIdentifier(e))
      : 17 === key || 'Control' === e.key
      ? addGlobalEvent(kind + 'z', getElementIdentifier(e))
      : 18 === key || 'Alt' === e.key
      ? addGlobalEvent(kind + 'a', getElementIdentifier(e))
      : 20 === key || 'CapsLock' === e.key
      ? addGlobalEvent(kind + 'w', getElementIdentifier(e))
      : 37 === key || 'ArrowLeft' === e.key
      ? addGlobalEvent(kind + 'r', getElementIdentifier(e))
      : 38 === key || 'ArrowUp' === e.key
      ? addGlobalEvent(kind + 't', getElementIdentifier(e))
      : 39 === key || 'ArrowRight' === e.key
      ? addGlobalEvent(kind + 'd', getElementIdentifier(e))
      : 40 === key || 'ArrowDown' === e.key
      ? addGlobalEvent(kind + 'k', getElementIdentifier(e))
      : target &&
        void 0 === target.type &&
        addGlobalStats(
          (function (type) {
            switch (type) {
              case 'keydown':
                return 'e';
              case 'keyup':
                return 'w';
              default:
                return 'T';
            }
          })(e.type)
        );
  }

  function globalDOMLoadedHandler() {
    addGlobalEvent('F', getElementIdentifier(document.activeElement));
  }

  function globalStateChangeHandler(e) {
    var state = 'function' == typeof _config.stateChangeEventCallback ? _config.stateChangeEventCallback(e) : '';
    addGlobalEvent('d', state);
  }

  function clientInfo() {
    function v(arg) {
      try {
        return '' + arg;
      } catch (e) {
        return 'e';
      }
    }

    function c(callback) {
      try {
        return '' + callback();
      } catch (e) {
        return !1;
      }
    }
    var ua, rv, scrHeight, scrWidth, serialize, IE_ver;
    return [
      1,
      v(navigator.serviceWorker),
      v(navigator.geolocation),
      v(navigator.cookieEnabled),
      v(navigator.buildID),
      v(navigator.productSub),
      v(navigator.oscpu),
      v('ontouchstart' in window || 0 < navigator.maxTouchPoints || 0 < navigator.msMaxTouchPoints),
      c(function () {
        var r = document.createElement('canvas');
        return '' + (!!window.WebGLRenderingContext && (r.getContext('webgl') || r.getContext('experimental-webgl')));
      }),
      v(window.HTMLCanvasElement || document.createElement('canvas').getContext),
      v(!(!(screen.width < screen.availWidth) && screen.height < screen.availHeight)),
      c(function () {
        return void 0 !== navigator.languages && navigator.languages[0].substr(0, 2) !== navigator.language.substr(0, 2);
      }),
      v(navigator.doNotTrack),
      v(navigator.platform),
      v(navigator.cpuClass),
      v(!!window.openDatabase),
      v(!!document.body.addBehavior),
      v(!!window.indexedDB),
      v(!!window.sessionStorage),
      ((serialize = function (object) {
        var type = typeof object;
        if (null === object) return '"emptyValue"';
        if ('string' == type || 'number' == type || 'boolean' == type) return '"' + (object + '').replace(/["]/g, '\\"') + '"';
        if ('function' == type) return '"functionValue"';
        if ('object' != type) return 'undefined' == type ? '"undefinedError"' : '"unknownTypeError"';
        var output = '{';
        try {
          for (var item in object) 'enabledPlugin' !== item && (output += '"' + item + '":' + serialize(object[item]) + ',');
        } catch (e) {}
        return output.replace(/\,$/, '') + '}';
      }),
      (rv = -1),
      'Microsoft Internet Explorer' == navigator.appName
        ? ((ua = navigator.userAgent), null != new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})').exec(ua) && (rv = parseFloat(RegExp.$1)))
        : new RegExp('Trident').test(navigator.userAgent) &&
          ((ua = navigator.userAgent),
          null != new RegExp('11.0').exec(ua) && (rv = parseFloat(RegExp.$1)),
          navigator.userAgent.match(/Trident.*rv[ :]*/) &&
            null != new RegExp('rv:([0-9]{1,}[.0-9]{0,})').exec(ua) &&
            (rv = parseFloat(RegExp.$1))),
      (IE_ver = rv),
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? screen.height &&
          (scrWidth =
            screen.height < screen.width ? ((scrHeight = screen.height), screen.width) : ((scrHeight = screen.width), screen.height))
        : screen.height && ((scrHeight = screen.height), (scrWidth = screen.width)),
      serialize([
        navigator.userAgent,
        navigator.language ? navigator.language : navigator.userLanguage,
        navigator.cookieEnabled,
        screen.height ? scrWidth + 'x' + scrHeight + 'x' + screen.colorDepth : '',
        screen.pixelDepth ? screen.pixelDepth : '',
        screen.deviceXDPI ? screen.deviceXDPI + 'x' + screen.deviceYDPI : '',
        screen.systemXDPI ? screen.systemXDPI + 'x' + screen.systemYDPI : '',
        screen.updateInterval ? screen.updateInterval : '',
        new Date().getTimezoneOffset(),
        !!window.sessionStorage,
        !!window.localStorage,
        window.devicePixelRatio ? window.devicePixelRatio : 0,
        0 < IE_ver && '11' != IE_ver
          ? (function () {
              if (!(0 < IE_ver)) return 'na';
              var rtrn_val, i;
              if (IE_ver < 11)
                try {
                  rtrn_val = new Array();
                  var all_clssPIs = new Array(
                    'Address Book',
                    'AOL ART Image Format Support',
                    'Arabic Text Display Support',
                    'Chinese (Simplified) Text Display Support',
                    'Chinese (traditional) Text Display Support',
                    'DirectAnimation',
                    'Dynamic HTML Data Binding for Java',
                    'Dynamic HTML Data Binding',
                    'DirectShow',
                    'Hebrew Text Display Support',
                    'Internet Explorer Browsing Enhancements',
                    'Internet Connection Wizard',
                    'Internet Explorer 5 Browser',
                    'Internet Explorer Classes for Java',
                    'Internet Explorer Help Engine',
                    'Internet Explorer Help',
                    'Japanese Text Display Support',
                    'Java Plug-in',
                    'Korean Text Display Support',
                    'Language Auto-Selection',
                    'MSN Messenger Service',
                    'Microsoft virtual machine',
                    'NetMeeting NT',
                    'Offline Browsing Pack',
                    'Outlook Express',
                    'Pan-European Text Display Support',
                    'Macromedia Shockwave Director',
                    'Macromedia Flash',
                    'Thai Text Display Support',
                    'Task Scheduler',
                    'Uniscribe',
                    'Visual Basic Scripting Support',
                    'Vietnamese Text Display Support',
                    'Vector Graphics Rendering (VML)',
                    'Web Folders',
                    'Windows Media Player',
                    'Windows Desktop Update NT'
                  );
                  document.body.addBehavior('#default#clientCaps');
                  var cntpi = 0;
                  for (i in {
                    '7790769C-0471-11D2-AF11-00C04FA35D02': 'abk',
                    '47F67D00-9E55-11D1-BAEF-00C04FC2D130': 'aol',
                    '76C19B38-F0C8-11CF-87CC-0020AFEECF20': 'arb',
                    '76C19B34-F0C8-11CF-87CC-0020AFEECF20': 'chs',
                    '76C19B33-F0C8-11CF-87CC-0020AFEECF20': 'cht',
                    '283807B5-2C60-11D0-A31D-00AA00B92C03': 'dan',
                    '4F216970-C90C-11D1-B5C7-0000F8051515': 'dhj',
                    '9381D8F2-0288-11D0-9501-00AA00B911A5': 'dht',
                    '44BBA848-CC51-11CF-AAFA-00AA00B6015C': 'dsh',
                    '76C19B36-F0C8-11CF-87CC-0020AFEECF20': 'heb',
                    '630B1DA0-B465-11D1-9948-00C04F98BBC9': 'ibe',
                    '5A8D6EE0-3E18-11D0-821E-444553540000': 'icw',
                    '89820200-ECBD-11CF-8B85-00AA005B4383': 'ie5',
                    '08B0E5C0-4FCB-11CF-AAA5-00401C608555': 'iec',
                    'DE5AED00-A4BF-11D1-9948-00C04F98BBC9': 'iee',
                    '45EA75A0-A269-11D1-B5BF-0000F8051515': 'ieh',
                    '76C19B30-F0C8-11CF-87CC-0020AFEECF20': 'jap',
                    '8AD9C840-044E-11D1-B3E9-00805F499D93': 'jav',
                    '76C19B31-F0C8-11CF-87CC-0020AFEECF20': 'krn',
                    '76C19B50-F0C8-11CF-87CC-0020AFEECF20': 'lan',
                    '5945C046-LE7D-LLDL-BC44-00C04FD912BE': 'msn',
                    '08B0E5C0-4FCB-11CF-AAA5-00401C608500': 'mvm',
                    '44BBA842-CC51-11CF-AAFA-00AA00B6015B': 'net',
                    '3AF36230-A269-11D1-B5BF-0000F8051515': 'obp',
                    '44BBA840-CC51-11CF-AAFA-00AA00B6015C': 'oex',
                    '76C19B32-F0C8-11CF-87CC-0020AFEECF20': 'pan',
                    '2A202491-F00D-11CF-87CC-0020AFEECF20': 'shw',
                    'D27CDB6E-AE6D-11CF-96B8-444553540000': 'swf',
                    '76C19B35-F0C8-11CF-87CC-0020AFEECF20': 'thi',
                    'CC2A9BA0-3BDD-11D0-821E-444553540000': 'tks',
                    '3BF42070-B3B1-11D1-B5C5-0000F8051515': 'uni',
                    '4F645220-306D-11D2-995D-00C04F98BBC9': 'vbs',
                    '76C19B37-F0C8-11CF-87CC-0020AFEECF20': 'vnm',
                    '10072CEC-8CC1-11D1-986E-00A0C955B42F': 'vtc',
                    '73FA19D0-2D75-11D2-995D-00C04F98BBC9': 'wfd',
                    '22D6F312-B0F6-11D0-94AB-0080C74C7E95': 'wmp',
                    '89820200-ECBD-11CF-8B85-00AA005B4340': 'wnt',
                  })
                    try {
                      var comptVer = document.body.getComponentVersion('{' + i + '}', 'ComponentID');
                      comptVer &&
                        rtrn_val.push(encodeURIComponent(all_clssPIs[cntpi] + ' - ' + comptVer.replace(/,/g, '.') + ' -  - ') + ';'),
                        cntpi++;
                    } catch (e) {}
                  return 0 === rtrn_val.length ? 'none' : rtrn_val;
                } catch (e) {
                  return 'Err';
                }
            })()
          : map(navigator.plugins, function (e) {
              return [
                e.name,
                e.description,
                map(e, function (e) {
                  return [e.type, e.suffixes].join(':');
                }).join('|'),
              ].join('|');
            }),
      ])),
    ];

    function map(elems, callback, arg) {
      var value,
        key,
        ret = [],
        i = 0,
        length = elems.length;
      if (void 0 !== length && 'number' == typeof length && ((0 < length && elems[0] && elems[length - 1]) || 0 === length))
        for (; i < length; i++) null != (value = callback(elems[i], i, arg)) && (ret[ret.length] = value);
      else for (key in elems) null != (value = callback(elems[key], key, arg)) && (ret[ret.length] = value);
      return ret.concat.apply([], ret);
    }
  }
  setCookie();
  monitorName in window ||
    void 0 !== window[monitorName] ||
    (configure(config),
    (window[monitorName] = {
      startMonitor: startMonitor,
      stopMonitor: stopMonitor,
      getData: getData,
    }),
    _config.autoload && startMonitor()),
    'undefined' == typeof console &&
      (this.console = {
        log: function () {},
        info: function () {},
        error: function () {},
        warn: function () {},
      }),
    (Date.now =
      Date.now ||
      function () {
        return +new Date();
      }),
    Array.prototype.indexOf ||
      (Array.prototype.indexOf = function (obj, start) {
        for (var i = start || 0, j = this.length; i < j; i++) if (this[i] === obj) return i;
        return -1;
      }),
    Element.prototype.matches ||
      (Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
          for (
            var matches = (this.document || this.ownerDocument).querySelectorAll(s), i = matches.length;
            0 <= --i && matches.item(i) !== this;

          );
          return -1 < i;
        });
})(window, document, 'bw', {
  autoload: !0,
});
