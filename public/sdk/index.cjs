"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AirMouseButton: () => AirMouseButton,
  AirMouseFilter: () => AirMouseFilter,
  AudioSourcePlaybackState: () => AudioSourcePlaybackState,
  ControllerView: () => ControllerView,
  GamepadAxis: () => GamepadAxis,
  GamepadButton: () => GamepadButton,
  HapticPreset: () => HapticPreset,
  MouseButton: () => MouseButton,
  ScreenOrientation: () => ScreenOrientation,
  VERSION: () => VERSION,
  airDpad: () => airDpad,
  airMouse: () => airMouse,
  audio: () => audio,
  gameMessage: () => gameMessage,
  gameVariable: () => gameVariable,
  haptics: () => haptics,
  input: () => input,
  layout: () => layout,
  menu: () => menu,
  motion: () => motion,
  storage: () => storage,
  telemetry: () => telemetry,
  textInput: () => textInput
});
module.exports = __toCommonJS(src_exports);

// src/settings.ts
var settings = {
  version: "##VERSION##"
};

// src/internal/event-emitter.ts
var EventEmitter = class {
  constructor() {
    this.eventListeners = {};
  }
  get empty() {
    return Object.keys(this.eventListeners).length === 0;
  }
  on(type, listener) {
    var _a;
    if (!this.eventListeners[type]) {
      this.eventListeners[type] = /* @__PURE__ */ new Set();
    }
    (_a = this.eventListeners[type]) == null ? void 0 : _a.add(listener);
    return () => {
      this.off(type, listener);
    };
  }
  off(type, listener) {
    var _a;
    (_a = this.eventListeners[type]) == null ? void 0 : _a.delete(listener);
  }
  emit(type, ...args) {
    var _a;
    (_a = this.eventListeners[type]) == null ? void 0 : _a.forEach((listener) => listener(...args));
  }
};
var SingleEventEmitter = class {
  constructor() {
    this.eventEmitter = new EventEmitter();
  }
  on(listener) {
    return this.eventEmitter.on("event", listener);
  }
  off(listener) {
    this.eventEmitter.off("event", listener);
  }
  emit(...args) {
    this.eventEmitter.emit("event", ...args);
  }
  get empty() {
    return this.eventEmitter.empty;
  }
};

// src/internal/dom.ts
var hasWindow = typeof window !== "undefined";
function gatherAssetsStatistics() {
  if (!hasWindow || !performance || !performance.getEntriesByType) {
    return {
      transferSizeBytes: 0,
      encodedBodySizeBytes: 0,
      decodedBodySizeBytes: 0
    };
  }
  const resources = performance.getEntriesByType("resource");
  return resources.map((entry) => {
    var _a, _b, _c;
    return {
      transferSize: (_a = entry.transferSize) != null ? _a : 0,
      encodedBodySize: (_b = entry.encodedBodySize) != null ? _b : 0,
      decodedBodySize: (_c = entry.decodedBodySize) != null ? _c : 0
    };
  }).reduce(
    (acc, curr) => {
      acc.transferSizeBytes += curr.transferSize;
      acc.encodedBodySizeBytes += curr.encodedBodySize;
      acc.decodedBodySizeBytes += curr.decodedBodySize;
      return acc;
    },
    {
      transferSizeBytes: 0,
      encodedBodySizeBytes: 0,
      decodedBodySizeBytes: 0
    }
  );
}
function absoluteUrl(url) {
  return new URL(url, window.location.href).toString();
}

// src/internal/controller-bridge.ts
var ControllerBridge = class extends EventEmitter {
  constructor() {
    super();
    this.registerMessageEventListener();
  }
  send(message, transfer) {
    if (hasWindow) {
      window.parent.postMessage(message, "*", transfer);
    }
  }
  registerMessageEventListener() {
    if (hasWindow) {
      window.addEventListener(
        "message",
        ({ data }) => {
          this.emit(
            data.type,
            "data" in data ? data.data : void 0
          );
        }
      );
    }
  }
};
var controllerBridge = new ControllerBridge();

// src/internal/console.ts
function injectConsoleListener() {
  if (!hasWindow) {
    return;
  }
  ["log", "info", "debug", "warn", "error"].forEach((method) => {
    const original = window.console[method];
    window.console[method] = (...args) => {
      original.apply(window.console, args);
      const err = new Error();
      const location = parseStackTrace(err.stack);
      controllerBridge.send({
        type: "console",
        data: {
          level: method === "log" ? "info" : method,
          location,
          args: serializeArgs(args)
        }
      });
    };
  });
  window.addEventListener("error", (event) => {
    controllerBridge.send({
      type: "console",
      data: {
        level: "error",
        location: {
          filename: getDocumentRelativePath(event.filename),
          line: event.lineno,
          col: event.colno
        },
        args: [event.message]
      }
    });
  });
}
function serializeArgs(args) {
  return args.map((arg) => {
    try {
      return structuredClone(arg);
    } catch (e) {
      try {
        return JSON.parse(JSON.stringify(arg));
      } catch (e2) {
        return String(arg);
      }
    }
  });
}
function getDocumentRelativePath(filename) {
  if (filename.startsWith(document.location.origin)) {
    filename = filename.replace(document.location.origin, "");
    const pathName = document.location.pathname;
    const basePath = pathName.endsWith("/") ? pathName : pathName.substring(0, pathName.lastIndexOf("/") + 1);
    if (filename.startsWith(basePath)) {
      filename = filename.substring(basePath.length);
    }
    if (filename.endsWith(document.location.hash)) {
      filename = filename.replace(document.location.hash, "");
    }
  }
  return filename;
}
function parseStackTrace(stack = "") {
  var _a;
  const stackLines = stack.split("\n");
  let filename = "unknown";
  let line = 0;
  let col = 0;
  const chromiumRegex = /at (?:(.*?) ?\()?(.+?):(\d+):(\d+)\)?/;
  const webkitRegex = /@(.*?):(\d+):(\d+)/;
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || /Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1;
  const isWKWebView = isIOS && /AppleWebKit/.test(userAgent) && //@ts-expect-error - webkit property exist in Safari
  !!((_a = window.webkit) == null ? void 0 : _a.messageHandlers);
  const callSite = (isWKWebView ? stackLines[1] : stackLines[2]) || "".trim();
  const chromiumMatch = callSite.match(chromiumRegex);
  const webkitMatch = callSite.match(webkitRegex);
  if (chromiumMatch) {
    filename = chromiumMatch[2];
    line = parseInt(chromiumMatch[3], 10);
    col = parseInt(chromiumMatch[4], 10);
  } else if (webkitMatch) {
    filename = webkitMatch[1];
    line = webkitMatch[2] ? parseInt(webkitMatch[2], 10) : 0;
    col = 0;
  }
  return {
    filename: getDocumentRelativePath(filename),
    line,
    col
  };
}

// src/activity.ts
var USER_ACTIVITY_THRESHOLD_MS = 1e3;
var started = false;
var lastActivityTime = 0;
var waitingToSendActivityMessage = false;
function sendTouchEventMessage(timestamp) {
  controllerBridge.send({
    type: "touchInput",
    data: { eventTimestamp: timestamp }
  });
}
function sendActivityMessage(time = Date.now()) {
  lastActivityTime = time;
  waitingToSendActivityMessage = false;
  controllerBridge.send({ type: "activityUserActive" });
}
function handlePointerUp(event) {
  const currentTime = Date.now();
  const deltaTime = currentTime - lastActivityTime;
  sendTouchEventMessage(event.timeStamp);
  if (waitingToSendActivityMessage) {
    return;
  }
  if (deltaTime >= USER_ACTIVITY_THRESHOLD_MS) {
    sendActivityMessage(currentTime);
  } else {
    waitingToSendActivityMessage = true;
    setTimeout(sendActivityMessage, USER_ACTIVITY_THRESHOLD_MS - deltaTime);
  }
}
var activity = {
  startActivityMonitor() {
    if (!hasWindow || started) {
      return;
    }
    started = true;
    window.document.addEventListener("pointerup", handlePointerUp, {
      capture: true,
      passive: true
    });
  },
  stopActivityMonitor() {
    if (!hasWindow || !started) {
      return;
    }
    started = false;
    window.document.removeEventListener("pointerup", handlePointerUp);
  }
};

// src/internal/safe-areas.ts
function injectSafeArea({
  top = 0,
  right = 0,
  bottom = 0,
  left = 0
} = {}) {
  if (typeof window === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.style.setProperty("--safe-area-inset-top", `${top}px`);
  root.style.setProperty("--safe-area-inset-right", `${right}px`);
  root.style.setProperty("--safe-area-inset-bottom", `${bottom}px`);
  root.style.setProperty("--safe-area-inset-left", `${left}px`);
}

// src/layout.ts
var ScreenOrientation = /* @__PURE__ */ ((ScreenOrientation2) => {
  ScreenOrientation2["PORTRAIT"] = "portrait";
  ScreenOrientation2["LANDSCAPE"] = "landscape";
  ScreenOrientation2["ANY"] = "any";
  return ScreenOrientation2;
})(ScreenOrientation || {});
var initConfiguration;
var isReady = false;
var ControllerView = /* @__PURE__ */ ((ControllerView2) => {
  ControllerView2["PLAYER_SUPPORT"] = "PLAYER_SUPPORT";
  return ControllerView2;
})(ControllerView || {});
var visibilityEventEmitter = new SingleEventEmitter();
var currentVisibilityState = false;
controllerBridge.on("layoutVisible", () => {
  currentVisibilityState = true;
  visibilityEventEmitter.emit(currentVisibilityState);
});
controllerBridge.on("layoutHidden", () => {
  currentVisibilityState = false;
  visibilityEventEmitter.emit(currentVisibilityState);
});
var orientationEventEmitter = new SingleEventEmitter();
controllerBridge.on("deviceOrientationChange", (event) => {
  injectSafeArea({
    top: event.safeAreaInsetTop,
    bottom: event.safeAreaInsetBottom,
    left: event.safeAreaInsetLeft,
    right: event.safeAreaInsetRight
  });
  orientationEventEmitter.emit(event);
});
var layout = {
  beginInit(callback) {
    if (initConfiguration) {
      callback(void 0, initConfiguration);
    } else {
      const unsubscribe = controllerBridge.on("init", (configuration) => {
        initConfiguration = configuration;
        injectConsoleListener();
        injectSafeArea({
          top: configuration.safeAreaInsetTop,
          bottom: configuration.safeAreaInsetBottom,
          left: configuration.safeAreaInsetLeft,
          right: configuration.safeAreaInsetRight
        });
        callback(void 0, initConfiguration);
        unsubscribe();
      });
      controllerBridge.send({
        type: "loading",
        data: { sdkVersion: settings.version }
      });
    }
  },
  finishInit(callback) {
    if (!isReady) {
      isReady = true;
      const assetsStatistics = gatherAssetsStatistics();
      controllerBridge.send({
        type: "ready",
        data: { assetsStatistics }
      });
      activity.startActivityMonitor();
    }
    if (callback) {
      callback(void 0);
    }
  },
  addVisibilityHandler(handler) {
    visibilityEventEmitter.on(handler);
  },
  removeVisibilityHandler(handler) {
    visibilityEventEmitter.off(handler);
  },
  getVisibility(callback) {
    callback(void 0, currentVisibilityState);
  },
  lockOrientation(orientation) {
    controllerBridge.send({
      type: "lockOrientation",
      data: { orientation }
    });
  },
  addOrientationChangeHandler(handler) {
    orientationEventEmitter.on(handler);
  },
  removeOrientationChangeHandler(handler) {
    orientationEventEmitter.off(handler);
  },
  setDebugContextField: (options) => {
    controllerBridge.send({
      type: "setDebugContextField",
      data: options
    });
  },
  showView: (options) => {
    controllerBridge.send({
      type: "showView",
      data: options
    });
  }
};

// src/menu.ts
var eventEmitter = new SingleEventEmitter();
controllerBridge.on("customMenuButton", (buttonState) => {
  eventEmitter.emit(buttonState);
});
var menu = {
  addMenuHandler(handler) {
    eventEmitter.on(handler);
  },
  removeMenuHandler(handler) {
    eventEmitter.off(handler);
  }
};

// src/message.ts
var errorCodeMessages = {
  NO_ERROR: "No error",
  UNKNOWN_CLIENT_ID: "Unknown client id",
  NOT_CONNECTED: "Not connected",
  SEND_ERROR: "Send error",
  TIMEOUT: "Timeout"
};
var eventEmitter2 = new SingleEventEmitter();
controllerBridge.on("message", (data) => {
  eventEmitter2.emit(data.data);
});
var lastMessageId = 0;
var messageTimeout = 5e3;
var pendingMessages = /* @__PURE__ */ new Map();
controllerBridge.on("messageAck", (ack) => {
  var _a;
  const callback = pendingMessages.get(ack.messageId);
  if (typeof callback === "function") {
    if (!ack.delivered) {
      const message = (_a = errorCodeMessages[ack.errorCode]) != null ? _a : "Unknown error";
      callback({ message, code: ack.errorCode });
    } else {
      callback(void 0);
    }
  }
});
var gameMessage = {
  send(data, callback) {
    const messageId = lastMessageId++;
    const timeout = setTimeout(() => {
      pendingMessages.delete(messageId);
      callback({ message: "Send timeout", code: "TIMEOUT" });
    }, messageTimeout);
    pendingMessages.set(messageId, (error) => {
      clearTimeout(timeout);
      pendingMessages.delete(messageId);
      callback(error);
    });
    const transfer = data instanceof ArrayBuffer ? [data] : void 0;
    controllerBridge.send(
      { type: "message", data: { messageId, data } },
      transfer
    );
  },
  addReceiveHandler(handler) {
    eventEmitter2.on(handler);
  },
  removeReceiveHandler(handler) {
    eventEmitter2.off(handler);
  }
};

// src/variable.ts
var eventEmitter3 = new SingleEventEmitter();
var variables = {};
controllerBridge.on("variable", (data) => {
  variables[data.name] = data.value;
  eventEmitter3.emit(data.name, data.value);
});
var gameVariable = {
  addChangeHandler(handler) {
    eventEmitter3.on(handler);
  },
  removeChangeHandler(handler) {
    eventEmitter3.off(handler);
  },
  get(name, callback) {
    return callback(void 0, variables[name]);
  }
};

// src/input.ts
var GamepadButton = /* @__PURE__ */ ((GamepadButton2) => {
  GamepadButton2["BTN_A"] = "BTN_A";
  GamepadButton2["BTN_B"] = "BTN_B";
  GamepadButton2["BTN_X"] = "BTN_X";
  GamepadButton2["BTN_Y"] = "BTN_Y";
  GamepadButton2["BTN_Z"] = "BTN_Z";
  GamepadButton2["BTN_TL"] = "BTN_TL";
  GamepadButton2["BTN_TR"] = "BTN_TR";
  GamepadButton2["BTN_TL2"] = "BTN_TL2";
  GamepadButton2["BTN_TR2"] = "BTN_TR2";
  GamepadButton2["BTN_SELECT"] = "BTN_SELECT";
  GamepadButton2["BTN_START"] = "BTN_START";
  GamepadButton2["BTN_MODE"] = "BTN_MODE";
  GamepadButton2["BTN_THUMBL"] = "BTN_THUMBL";
  GamepadButton2["BTN_THUMBR"] = "BTN_THUMBR";
  GamepadButton2["BTN_DPAD_LEFT"] = "BTN_DPAD_LEFT";
  GamepadButton2["BTN_DPAD_RIGHT"] = "BTN_DPAD_RIGHT";
  GamepadButton2["BTN_DPAD_UP"] = "BTN_DPAD_UP";
  GamepadButton2["BTN_DPAD_DOWN"] = "BTN_DPAD_DOWN";
  return GamepadButton2;
})(GamepadButton || {});
var MouseButton = /* @__PURE__ */ ((MouseButton2) => {
  MouseButton2["BTN_LEFT"] = "BTN_LEFT";
  MouseButton2["BTN_RIGHT"] = "BTN_RIGHT";
  return MouseButton2;
})(MouseButton || {});
var GamepadAxis = /* @__PURE__ */ ((GamepadAxis2) => {
  GamepadAxis2["X"] = "ABS_X";
  GamepadAxis2["Y"] = "ABS_Y";
  GamepadAxis2["RIGHT_X"] = "ABS_RX";
  GamepadAxis2["RIGHT_Y"] = "ABS_RY";
  return GamepadAxis2;
})(GamepadAxis || {});
var buttonStates = /* @__PURE__ */ new Map();
var axisStates = /* @__PURE__ */ new Map();
var mouseButtonStates = /* @__PURE__ */ new Map();
var input = {
  setGamepadButton(button, state) {
    if (buttonStates.get(button) !== state) {
      buttonStates.set(button, state);
      controllerBridge.send({
        type: "input",
        data: [{ code: button, value: state }]
      });
    }
  },
  setGamepadAxis(axis, value) {
    if (axisStates.get(axis) !== value) {
      axisStates.set(axis, value);
      controllerBridge.send({
        type: "input",
        data: [{ code: axis, value }]
      });
    }
  },
  setMouseButton(button, state) {
    if (mouseButtonStates.get(button) !== state) {
      mouseButtonStates.set(button, state);
      controllerBridge.send({
        type: "mouse",
        data: [{ code: button, value: state }]
      });
    }
  },
  setMousePosition(position) {
    controllerBridge.send({
      type: "mouse",
      data: [
        { code: "ABS_X", value: position.x, isRawValue: true },
        { code: "ABS_Y", value: position.y, isRawValue: true }
      ]
    });
  },
  setMouseMovement(movement) {
    controllerBridge.send({
      type: "mouse",
      data: [
        { code: "REL_X", value: movement.deltaX },
        { code: "REL_Y", value: movement.deltaY }
      ]
    });
  },
  setMousePositionAndMovement(position, movement) {
    controllerBridge.send({
      type: "mouse",
      data: [
        { code: "ABS_X", value: position.x, isRawValue: true },
        { code: "ABS_Y", value: position.y, isRawValue: true },
        { code: "REL_X", value: movement.deltaX },
        { code: "REL_Y", value: movement.deltaY }
      ]
    });
  }
};

// src/haptic.ts
var HapticPreset = /* @__PURE__ */ ((HapticPreset2) => {
  HapticPreset2["TAP"] = "TAP";
  HapticPreset2["HOVER"] = "HOVER";
  HapticPreset2["TICK"] = "TICK";
  HapticPreset2["SUCCESS"] = "SUCCESS";
  HapticPreset2["ERROR"] = "ERROR";
  HapticPreset2["LIGHT"] = "LIGHT";
  HapticPreset2["MEDIUM"] = "MEDIUM";
  HapticPreset2["HEAVY"] = "HEAVY";
  HapticPreset2["SHARP"] = "SHARP";
  HapticPreset2["SOFT"] = "SOFT";
  HapticPreset2["DOUBLE_TAP_SHARP"] = "DOUBLE_TAP_SHARP";
  HapticPreset2["DOUBLE_TAP_SOFT"] = "DOUBLE_TAP_SOFT";
  HapticPreset2["TRIPLE_TAP_SHARP"] = "TRIPLE_TAP_SHARP";
  HapticPreset2["TRIPLE_TAP_SOFT"] = "TRIPLE_TAP_SOFT";
  HapticPreset2["BUZZ"] = "BUZZ";
  HapticPreset2["SHORT_BUZZ"] = "SHORT_BUZZ";
  return HapticPreset2;
})(HapticPreset || {});
var haptics = {
  create(options) {
    controllerBridge.send({
      type: "haptics",
      data: {
        action: "create",
        id: options.id,
        presetId: options.presetId,
        audioUrl: options.audioUrl ? absoluteUrl(options.audioUrl) : void 0
      }
    });
  },
  play(options) {
    controllerBridge.send({
      type: "haptics",
      data: { action: "play", id: options.id }
    });
  },
  stop() {
    controllerBridge.send({
      type: "haptics",
      data: { action: "stop" }
    });
  }
};

// src/internal/request-manager.ts
var RequestManager = class {
  constructor(responseEventType) {
    this.currentRequestId = 0;
    this.requestMap = /* @__PURE__ */ new Map();
    controllerBridge.on(responseEventType, (response) => {
      const { requestId, error, data } = response;
      const callback = this.requestMap.get(requestId);
      if (!callback || typeof callback !== "function") {
        console.warn(
          `RequestManager: Callback not found or callback is not a function for request id ${requestId}`
        );
        return;
      }
      callback(error, data);
      this.requestMap.delete(requestId);
    });
  }
  getNextRequestId() {
    return ++this.currentRequestId;
  }
  // Registers the callback with a unique request id and return the id to be
  // included in the request.
  registerCallback(callback) {
    const requestId = this.getNextRequestId();
    if (this.requestMap.has(requestId)) {
      console.warn(
        `RequestManager: Request id ${requestId} already exists`
      );
    }
    this.requestMap.set(requestId, callback);
    return requestId;
  }
};

// src/storage.ts
var requestManager = new RequestManager("storageResponse");
var storage = {
  set: (options, callback) => {
    const { key, value } = options;
    const requestId = requestManager.registerCallback(callback);
    controllerBridge.send({
      type: "storage",
      action: "set",
      data: { requestId, key, value }
    });
  },
  get: (options, callback) => {
    const { key } = options;
    const requestId = requestManager.registerCallback(callback);
    controllerBridge.send({
      type: "storage",
      action: "get",
      data: { requestId, key }
    });
  },
  getAll: (callback) => {
    const requestId = requestManager.registerCallback(callback);
    controllerBridge.send({
      type: "storage",
      action: "getAll",
      data: { requestId }
    });
  },
  remove: (options, callback) => {
    const { key } = options;
    const requestId = requestManager.registerCallback(callback);
    controllerBridge.send({
      type: "storage",
      action: "remove",
      data: { requestId, key }
    });
  },
  clear: (callback) => {
    const requestId = requestManager.registerCallback(callback);
    controllerBridge.send({
      type: "storage",
      action: "clear",
      data: { requestId }
    });
  }
};

// src/text-input.ts
var eventEmitter4 = new SingleEventEmitter();
controllerBridge.on("textInputEvent", (event) => {
  eventEmitter4.emit(event);
});
controllerBridge.on("motionEventsChannel", (event) => {
  const port = event.port;
  if (port) {
    port.onmessage = (event2) => {
      eventEmitter4.emit(event2.data);
    };
  }
});
var textInput = {
  open(options, callback) {
    controllerBridge.send({ type: "openTextInput", data: options });
    callback(void 0);
  },
  close(callback) {
    controllerBridge.send({ type: "closeTextInput" });
    callback(void 0);
  },
  addChangeHandler(handler) {
    eventEmitter4.on(handler);
  },
  removeChangeHandler(handler) {
    eventEmitter4.off(handler);
  }
};

// src/air-mouse.ts
var AirMouseButton = /* @__PURE__ */ ((AirMouseButton2) => {
  AirMouseButton2["BTN_LEFT"] = "BTN_LEFT";
  AirMouseButton2["BTN_RIGHT"] = "BTN_RIGHT";
  return AirMouseButton2;
})(AirMouseButton || {});
var AirMouseFilter = /* @__PURE__ */ ((AirMouseFilter2) => {
  AirMouseFilter2["NONE"] = "NONE";
  AirMouseFilter2["PRECISE"] = "PRECISE";
  return AirMouseFilter2;
})(AirMouseFilter || {});
var airMouse = {
  start(options, callback) {
    controllerBridge.send({ type: "airMouse.start", data: options });
    callback(void 0);
  },
  stop(callback) {
    controllerBridge.send({ type: "airMouse.stop" });
    callback(void 0);
  },
  setButton(code, pressed, eventTimestamp, callback) {
    controllerBridge.send({
      type: "airMouse.setMouseButton",
      data: { code, pressed, eventTimestamp }
    });
    callback(void 0);
  }
};

// src/air-dpad.ts
var airDpad = {
  start(options, callback) {
    controllerBridge.send({ type: "startAirDpad", data: options });
    callback(void 0);
  },
  stop(callback) {
    controllerBridge.send({ type: "stopAirDpad" });
    callback(void 0);
  }
};

// src/motion.ts
var eventEmitter5 = new SingleEventEmitter();
controllerBridge.on("motionEventsChannel", (event) => {
  const port = event.port;
  if (port) {
    port.onmessage = (event2) => {
      const motionEvent = event2.data;
      eventEmitter5.emit(motionEvent);
    };
  }
});
var motion = {
  addHandler: (handler) => {
    if (eventEmitter5.empty) {
      controllerBridge.send({ type: "startMotionEvents" });
    }
    eventEmitter5.on(handler);
  },
  removeHandler: (handler) => {
    eventEmitter5.off(handler);
    if (eventEmitter5.empty) {
      controllerBridge.send({ type: "stopMotionEvents" });
    }
  }
};

// src/audio.ts
var AudioSourcePlaybackState = /* @__PURE__ */ ((AudioSourcePlaybackState2) => {
  AudioSourcePlaybackState2["PAUSED"] = "paused";
  AudioSourcePlaybackState2["BUFFERING"] = "buffering";
  AudioSourcePlaybackState2["PLAYING"] = "playing";
  AudioSourcePlaybackState2["ENDED"] = "ended";
  AudioSourcePlaybackState2["ERROR"] = "error";
  return AudioSourcePlaybackState2;
})(AudioSourcePlaybackState || {});
var createSourceRequestManager = new RequestManager("audio.sourceCreated");
var updateSourceRequestManager = new RequestManager("audio.sourceUpdated");
var closeSourceRequestManager = new RequestManager("audio.sourceClosed");
var updateHandlers = /* @__PURE__ */ new Map();
var audioSourceInstances = /* @__PURE__ */ new Map();
var sourceState = /* @__PURE__ */ new Map();
controllerBridge.on("audio.sourceUpdate", (event) => {
  var _b;
  const _a = event, { sourceId } = _a, state = __objRest(_a, ["sourceId"]);
  sourceState.set(event.sourceId, state);
  const source = audioSourceInstances.get(sourceId);
  if (source) {
    const event2 = { source };
    (_b = updateHandlers.get(sourceId)) == null ? void 0 : _b.forEach((handler) => handler(event2));
  }
});
var audioSettings = {
  isDisabled: false,
  isDeviceVolumeLow: false
};
var audioSettingsChangeHandlers = [];
controllerBridge.on("audio.settingsChange", (settings2) => {
  audioSettings = settings2;
  audioSettingsChangeHandlers.forEach((handler) => handler(settings2));
});
function createAudioSourceCallbackAdaptor(audioSourceType, callback) {
  return (error, data) => {
    if (!(data == null ? void 0 : data.sourceId)) {
      return callback(error, { source: void 0 });
    }
    const source = new AudioSourceInternal(data.sourceId);
    audioSourceInstances.set(data.sourceId, source);
    sourceState.set(data.sourceId, {
      state: "paused" /* PAUSED */,
      currentTime: 0,
      bufferProgress: audioSourceType === "memory" ? 1 : 0,
      isMuted: false,
      volume: 1
    });
    callback(error, { source });
  };
}
var audio = {
  createMemorySource(options, callback) {
    const internalCallback = createAudioSourceCallbackAdaptor(
      "memory",
      callback
    );
    const requestId = createSourceRequestManager.registerCallback(internalCallback);
    controllerBridge.send({
      type: "audio.createMemorySource",
      data: __spreadProps(__spreadValues({
        requestId
      }, options), {
        url: absoluteUrl(options.url)
      })
    });
  },
  createStreamingSource(options, callback) {
    const internalCallback = createAudioSourceCallbackAdaptor(
      "streaming",
      callback
    );
    const requestId = createSourceRequestManager.registerCallback(internalCallback);
    controllerBridge.send({
      type: "audio.createStreamingSource",
      data: __spreadProps(__spreadValues({
        requestId
      }, options), {
        url: absoluteUrl(options.url)
      })
    });
  },
  getSettings(callback) {
    callback(void 0, audioSettings);
  },
  addSettingsChangeHandler(handler) {
    audioSettingsChangeHandlers.push(handler);
  },
  removeSettingsChangeHandler(handler) {
    const index = audioSettingsChangeHandlers.indexOf(handler);
    if (index !== -1) {
      audioSettingsChangeHandlers.splice(index, 1);
    }
  }
};
var AudioSourceInternal = class {
  constructor(id) {
    this.id = id;
  }
  toJSON() {
    return __spreadProps(__spreadValues({}, sourceState.get(this.id)), { id: this.id });
  }
  addUpdateHandler(handler) {
    var _a;
    const handlers = (_a = updateHandlers.get(this.id)) != null ? _a : [];
    handlers.push(handler);
    updateHandlers.set(this.id, handlers);
  }
  removeUpdateHandler(handler) {
    const handlers = updateHandlers.get(this.id);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
        updateHandlers.set(this.id, handlers);
      }
    }
  }
  get bufferProgress() {
    var _a;
    const state = sourceState.get(this.id);
    return (_a = state == null ? void 0 : state.bufferProgress) != null ? _a : -1;
  }
  play(optionsOrCallback, maybeCallback) {
    const hasOptions = typeof optionsOrCallback === "object";
    const options = hasOptions ? optionsOrCallback : void 0;
    const callback = hasOptions ? maybeCallback : optionsOrCallback;
    const requestId = updateSourceRequestManager.registerCallback(callback);
    controllerBridge.send({
      type: "audio.updateSource",
      data: __spreadValues({
        requestId,
        sourceId: this.id,
        playing: true
      }, (options == null ? void 0 : options.from) !== void 0 ? { currentTime: options.from } : {})
    });
  }
  pause(callback) {
    const requestId = updateSourceRequestManager.registerCallback(callback);
    controllerBridge.send({
      type: "audio.updateSource",
      data: { requestId, sourceId: this.id, playing: false }
    });
  }
  get state() {
    var _a;
    const state = sourceState.get(this.id);
    return (_a = state == null ? void 0 : state.state) != null ? _a : "error";
  }
  seek(currentTime, callback) {
    const requestId = updateSourceRequestManager.registerCallback(callback);
    controllerBridge.send({
      type: "audio.updateSource",
      data: { requestId, sourceId: this.id, currentTime }
    });
  }
  get currentTime() {
    var _a;
    const state = sourceState.get(this.id);
    return (_a = state == null ? void 0 : state.currentTime) != null ? _a : -1;
  }
  get duration() {
    var _a;
    const state = sourceState.get(this.id);
    return (_a = state == null ? void 0 : state.duration) != null ? _a : -1;
  }
  mute(muted, callback) {
    const requestId = updateSourceRequestManager.registerCallback(callback);
    controllerBridge.send({
      type: "audio.updateSource",
      data: { requestId, sourceId: this.id, muted }
    });
  }
  get isMuted() {
    var _a;
    const state = sourceState.get(this.id);
    return (_a = state == null ? void 0 : state.isMuted) != null ? _a : false;
  }
  setVolume(volume, callback) {
    const requestId = updateSourceRequestManager.registerCallback(callback);
    controllerBridge.send({
      type: "audio.updateSource",
      data: { requestId, sourceId: this.id, volume }
    });
  }
  get volume() {
    var _a;
    const state = sourceState.get(this.id);
    return (_a = state == null ? void 0 : state.volume) != null ? _a : -1;
  }
  get error() {
    const state = sourceState.get(this.id);
    return state == null ? void 0 : state.error;
  }
  close(callback) {
    const requestId = closeSourceRequestManager.registerCallback(callback);
    controllerBridge.send({
      type: "audio.closeSource",
      data: { requestId, sourceId: this.id }
    });
    updateHandlers.delete(this.id);
    sourceState.delete(this.id);
    audioSourceInstances.delete(this.id);
  }
};

// src/telemetry.ts
var telemetry = {
  logEvent(event) {
    controllerBridge.send({
      type: "telemetry",
      action: "logEvent",
      data: {
        event
      }
    });
  }
};

// src/index.ts
var VERSION = settings.version;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AirMouseButton,
  AirMouseFilter,
  AudioSourcePlaybackState,
  ControllerView,
  GamepadAxis,
  GamepadButton,
  HapticPreset,
  MouseButton,
  ScreenOrientation,
  VERSION,
  airDpad,
  airMouse,
  audio,
  gameMessage,
  gameVariable,
  haptics,
  input,
  layout,
  menu,
  motion,
  storage,
  telemetry,
  textInput
});
//# sourceMappingURL=index.cjs.map