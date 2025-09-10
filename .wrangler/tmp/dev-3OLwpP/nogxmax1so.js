var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options2) {
    this.name = name;
    this.startTime = options2?.startTime || _performanceNow();
    this.detail = options2?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e3) => e3.name !== markName) : this._entries.filter((e3) => e3.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e3) => e3.name !== measureName) : this._entries.filter((e3) => e3.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e3) => e3.entryType !== "resource" || e3.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e3) => e3.name === name && (!type || e3.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e3) => e3.entryType === type);
  }
  mark(name, options2) {
    const entry = new PerformanceMark(name, options2);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options2) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options2) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options2) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env4) {
    return 1;
  }
  hasColors(count4, env4) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule(
  "node:process"
);
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// .wrangler/tmp/pages-dsDAQZ/bundledWorker-0.2824497514860065.mjs
import { Writable as Writable2 } from "node:stream";
import { EventEmitter as EventEmitter2 } from "node:events";
import { env as env2 } from "cloudflare:workers";
var __create = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __esm = /* @__PURE__ */ __name((fn, res) => /* @__PURE__ */ __name(function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
}, "__init"), "__esm");
var __commonJS = /* @__PURE__ */ __name((cb, mod) => /* @__PURE__ */ __name(function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
}, "__require"), "__commonJS");
var __export = /* @__PURE__ */ __name((target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
}, "__export");
var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp2(to, key2, { get: /* @__PURE__ */ __name(() => from[key2], "get"), enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
}, "__copyProps");
var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
  mod
)), "__toESM");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError2(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError2, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented2(name) {
  const fn = /* @__PURE__ */ __name2(() => {
    throw /* @__PURE__ */ createNotImplementedError2(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented2, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass2(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass2, "notImplementedClass");
var init_utils = __esm({
  "../../node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name2(createNotImplementedError2, "createNotImplementedError");
    __name2(notImplemented2, "notImplemented");
    __name2(notImplementedClass2, "notImplementedClass");
  }
});
var _timeOrigin2;
var _performanceNow2;
var nodeTiming2;
var PerformanceEntry2;
var PerformanceMark3;
var PerformanceMeasure2;
var PerformanceResourceTiming2;
var PerformanceObserverEntryList2;
var Performance2;
var PerformanceObserver2;
var performance2;
var init_performance = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin2 = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow2 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin2;
    nodeTiming2 = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry2 = class {
      static {
        __name(this, "PerformanceEntry");
      }
      static {
        __name2(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options2) {
        this.name = name;
        this.startTime = options2?.startTime || _performanceNow2();
        this.detail = options2?.detail;
      }
      get duration() {
        return _performanceNow2() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark3 = class PerformanceMark2 extends PerformanceEntry2 {
      static {
        __name(this, "PerformanceMark2");
      }
      static {
        __name2(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure2 = class extends PerformanceEntry2 {
      static {
        __name(this, "PerformanceMeasure");
      }
      static {
        __name2(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming2 = class extends PerformanceEntry2 {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      static {
        __name2(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList2 = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      static {
        __name2(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance2 = class {
      static {
        __name(this, "Performance");
      }
      static {
        __name2(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin2;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming2;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming2("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin2) {
          return _performanceNow2();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e3) => e3.name !== markName) : this._entries.filter((e3) => e3.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e3) => e3.name !== measureName) : this._entries.filter((e3) => e3.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e3) => e3.entryType !== "resource" || e3.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e3) => e3.name === name && (!type || e3.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e3) => e3.entryType === type);
      }
      mark(name, options2) {
        const entry = new PerformanceMark3(name, options2);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure2(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options2) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.addEventListener");
      }
      removeEventListener(type, listener, options2) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw /* @__PURE__ */ createNotImplementedError2("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver2 = class {
      static {
        __name(this, "PerformanceObserver");
      }
      static {
        __name2(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.disconnect");
      }
      observe(options2) {
        throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance2();
  }
});
var init_perf_hooks = __esm({
  "../../node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});
var init_performance2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance2;
    globalThis.Performance = Performance2;
    globalThis.PerformanceEntry = PerformanceEntry2;
    globalThis.PerformanceMark = PerformanceMark3;
    globalThis.PerformanceMeasure = PerformanceMeasure2;
    globalThis.PerformanceObserver = PerformanceObserver2;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList2;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming2;
  }
});
var noop_default2;
var init_noop = __esm({
  "../../node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default2 = Object.assign(() => {
    }, { __unenv__: true });
  }
});
var _console2;
var _ignoreErrors2;
var _stderr2;
var _stdout2;
var log3;
var info3;
var trace3;
var debug3;
var table3;
var error3;
var warn3;
var createTask3;
var clear3;
var count3;
var countReset3;
var dir3;
var dirxml3;
var group3;
var groupEnd3;
var groupCollapsed3;
var profile3;
var profileEnd3;
var time3;
var timeEnd3;
var timeLog3;
var timeStamp3;
var Console2;
var _times2;
var _stdoutErrorHandler2;
var _stderrErrorHandler2;
var init_console = __esm({
  "../../node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console2 = globalThis.console;
    _ignoreErrors2 = true;
    _stderr2 = new Writable2();
    _stdout2 = new Writable2();
    log3 = _console2?.log ?? noop_default2;
    info3 = _console2?.info ?? log3;
    trace3 = _console2?.trace ?? info3;
    debug3 = _console2?.debug ?? log3;
    table3 = _console2?.table ?? log3;
    error3 = _console2?.error ?? log3;
    warn3 = _console2?.warn ?? error3;
    createTask3 = _console2?.createTask ?? /* @__PURE__ */ notImplemented2("console.createTask");
    clear3 = _console2?.clear ?? noop_default2;
    count3 = _console2?.count ?? noop_default2;
    countReset3 = _console2?.countReset ?? noop_default2;
    dir3 = _console2?.dir ?? noop_default2;
    dirxml3 = _console2?.dirxml ?? noop_default2;
    group3 = _console2?.group ?? noop_default2;
    groupEnd3 = _console2?.groupEnd ?? noop_default2;
    groupCollapsed3 = _console2?.groupCollapsed ?? noop_default2;
    profile3 = _console2?.profile ?? noop_default2;
    profileEnd3 = _console2?.profileEnd ?? noop_default2;
    time3 = _console2?.time ?? noop_default2;
    timeEnd3 = _console2?.timeEnd ?? noop_default2;
    timeLog3 = _console2?.timeLog ?? noop_default2;
    timeStamp3 = _console2?.timeStamp ?? noop_default2;
    Console2 = _console2?.Console ?? /* @__PURE__ */ notImplementedClass2("console.Console");
    _times2 = /* @__PURE__ */ new Map();
    _stdoutErrorHandler2 = noop_default2;
    _stderrErrorHandler2 = noop_default2;
  }
});
var workerdConsole2;
var assert3;
var clear22;
var context2;
var count22;
var countReset22;
var createTask22;
var debug22;
var dir22;
var dirxml22;
var error22;
var group22;
var groupCollapsed22;
var groupEnd22;
var info22;
var log22;
var profile22;
var profileEnd22;
var table22;
var time22;
var timeEnd22;
var timeLog22;
var timeStamp22;
var trace22;
var warn22;
var console_default2;
var init_console2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole2 = globalThis["console"];
    ({
      assert: assert3,
      clear: clear22,
      context: (
        // @ts-expect-error undocumented public API
        context2
      ),
      count: count22,
      countReset: countReset22,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask22
      ),
      debug: debug22,
      dir: dir22,
      dirxml: dirxml22,
      error: error22,
      group: group22,
      groupCollapsed: groupCollapsed22,
      groupEnd: groupEnd22,
      info: info22,
      log: log22,
      profile: profile22,
      profileEnd: profileEnd22,
      table: table22,
      time: time22,
      timeEnd: timeEnd22,
      timeLog: timeLog22,
      timeStamp: timeStamp22,
      trace: trace22,
      warn: warn22
    } = workerdConsole2);
    Object.assign(workerdConsole2, {
      Console: Console2,
      _ignoreErrors: _ignoreErrors2,
      _stderr: _stderr2,
      _stderrErrorHandler: _stderrErrorHandler2,
      _stdout: _stdout2,
      _stdoutErrorHandler: _stdoutErrorHandler2,
      _times: _times2
    });
    console_default2 = workerdConsole2;
  }
});
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default2;
  }
});
var hrtime4;
var init_hrtime = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime4 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime22(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint2() {
      return BigInt(Date.now() * 1e6);
    }, "bigint"), "bigint") });
  }
});
var ReadStream2;
var init_read_stream = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream2 = class {
      static {
        __name(this, "ReadStream");
      }
      static {
        __name2(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});
var WriteStream2;
var init_write_stream = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream2 = class {
      static {
        __name(this, "WriteStream");
      }
      static {
        __name2(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir32, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env32) {
        return 1;
      }
      hasColors(count32, env32) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});
var init_tty = __esm({
  "../../node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});
var NODE_VERSION2;
var init_node_version = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION2 = "22.14.0";
  }
});
var Process2;
var init_process = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process2 = class _Process extends EventEmitter2 {
      static {
        __name(this, "_Process");
      }
      static {
        __name2(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter2.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream2(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream2(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream2(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd22) {
        this.#cwd = cwd22;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION2}`;
      }
      get versions() {
        return { node: NODE_VERSION2 };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw /* @__PURE__ */ createNotImplementedError2("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw /* @__PURE__ */ createNotImplementedError2("process.getActiveResourcesInfo");
      }
      exit() {
        throw /* @__PURE__ */ createNotImplementedError2("process.exit");
      }
      reallyExit() {
        throw /* @__PURE__ */ createNotImplementedError2("process.reallyExit");
      }
      kill() {
        throw /* @__PURE__ */ createNotImplementedError2("process.kill");
      }
      abort() {
        throw /* @__PURE__ */ createNotImplementedError2("process.abort");
      }
      dlopen() {
        throw /* @__PURE__ */ createNotImplementedError2("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw /* @__PURE__ */ createNotImplementedError2("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw /* @__PURE__ */ createNotImplementedError2("process.loadEnvFile");
      }
      disconnect() {
        throw /* @__PURE__ */ createNotImplementedError2("process.disconnect");
      }
      cpuUsage() {
        throw /* @__PURE__ */ createNotImplementedError2("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw /* @__PURE__ */ createNotImplementedError2("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw /* @__PURE__ */ createNotImplementedError2("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw /* @__PURE__ */ createNotImplementedError2("process.initgroups");
      }
      openStdin() {
        throw /* @__PURE__ */ createNotImplementedError2("process.openStdin");
      }
      assert() {
        throw /* @__PURE__ */ createNotImplementedError2("process.assert");
      }
      binding() {
        throw /* @__PURE__ */ createNotImplementedError2("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented2("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented2("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented2("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented2("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented2("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented2("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name2(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});
var globalProcess2;
var getBuiltinModule2;
var exit2;
var platform2;
var nextTick2;
var unenvProcess2;
var abort2;
var addListener2;
var allowedNodeEnvironmentFlags2;
var hasUncaughtExceptionCaptureCallback2;
var setUncaughtExceptionCaptureCallback2;
var loadEnvFile2;
var sourceMapsEnabled2;
var arch2;
var argv2;
var argv02;
var chdir2;
var config2;
var connected2;
var constrainedMemory2;
var availableMemory2;
var cpuUsage2;
var cwd2;
var debugPort2;
var dlopen2;
var disconnect2;
var emit2;
var emitWarning2;
var env3;
var eventNames2;
var execArgv2;
var execPath2;
var finalization2;
var features2;
var getActiveResourcesInfo2;
var getMaxListeners2;
var hrtime32;
var kill2;
var listeners2;
var listenerCount2;
var memoryUsage2;
var on2;
var off2;
var once2;
var pid2;
var ppid2;
var prependListener2;
var prependOnceListener2;
var rawListeners2;
var release2;
var removeAllListeners2;
var removeListener2;
var report2;
var resourceUsage2;
var setMaxListeners2;
var setSourceMapsEnabled2;
var stderr2;
var stdin2;
var stdout2;
var title2;
var throwDeprecation2;
var traceDeprecation2;
var umask2;
var uptime2;
var version2;
var versions2;
var domain2;
var initgroups2;
var moduleLoadList2;
var reallyExit2;
var openStdin2;
var assert22;
var binding2;
var send2;
var exitCode2;
var channel2;
var getegid2;
var geteuid2;
var getgid2;
var getgroups2;
var getuid2;
var setegid2;
var seteuid2;
var setgid2;
var setgroups2;
var setuid2;
var permission2;
var mainModule2;
var _events2;
var _eventsCount2;
var _exiting2;
var _maxListeners2;
var _debugEnd2;
var _debugProcess2;
var _fatalException2;
var _getActiveHandles2;
var _getActiveRequests2;
var _kill2;
var _preload_modules2;
var _rawDebug2;
var _startProfilerIdleNotifier2;
var _stopProfilerIdleNotifier2;
var _tickCallback2;
var _disconnect2;
var _handleQueue2;
var _pendingMessage2;
var _channel2;
var _send2;
var _linkedBinding2;
var _process2;
var process_default2;
var init_process2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess2 = globalThis["process"];
    getBuiltinModule2 = globalProcess2.getBuiltinModule;
    ({ exit: exit2, platform: platform2, nextTick: nextTick2 } = getBuiltinModule2(
      "node:process"
    ));
    unenvProcess2 = new Process2({
      env: globalProcess2.env,
      hrtime: hrtime4,
      nextTick: nextTick2
    });
    ({
      abort: abort2,
      addListener: addListener2,
      allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
      hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
      setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
      loadEnvFile: loadEnvFile2,
      sourceMapsEnabled: sourceMapsEnabled2,
      arch: arch2,
      argv: argv2,
      argv0: argv02,
      chdir: chdir2,
      config: config2,
      connected: connected2,
      constrainedMemory: constrainedMemory2,
      availableMemory: availableMemory2,
      cpuUsage: cpuUsage2,
      cwd: cwd2,
      debugPort: debugPort2,
      dlopen: dlopen2,
      disconnect: disconnect2,
      emit: emit2,
      emitWarning: emitWarning2,
      env: env3,
      eventNames: eventNames2,
      execArgv: execArgv2,
      execPath: execPath2,
      finalization: finalization2,
      features: features2,
      getActiveResourcesInfo: getActiveResourcesInfo2,
      getMaxListeners: getMaxListeners2,
      hrtime: hrtime32,
      kill: kill2,
      listeners: listeners2,
      listenerCount: listenerCount2,
      memoryUsage: memoryUsage2,
      on: on2,
      off: off2,
      once: once2,
      pid: pid2,
      ppid: ppid2,
      prependListener: prependListener2,
      prependOnceListener: prependOnceListener2,
      rawListeners: rawListeners2,
      release: release2,
      removeAllListeners: removeAllListeners2,
      removeListener: removeListener2,
      report: report2,
      resourceUsage: resourceUsage2,
      setMaxListeners: setMaxListeners2,
      setSourceMapsEnabled: setSourceMapsEnabled2,
      stderr: stderr2,
      stdin: stdin2,
      stdout: stdout2,
      title: title2,
      throwDeprecation: throwDeprecation2,
      traceDeprecation: traceDeprecation2,
      umask: umask2,
      uptime: uptime2,
      version: version2,
      versions: versions2,
      domain: domain2,
      initgroups: initgroups2,
      moduleLoadList: moduleLoadList2,
      reallyExit: reallyExit2,
      openStdin: openStdin2,
      assert: assert22,
      binding: binding2,
      send: send2,
      exitCode: exitCode2,
      channel: channel2,
      getegid: getegid2,
      geteuid: geteuid2,
      getgid: getgid2,
      getgroups: getgroups2,
      getuid: getuid2,
      setegid: setegid2,
      seteuid: seteuid2,
      setgid: setgid2,
      setgroups: setgroups2,
      setuid: setuid2,
      permission: permission2,
      mainModule: mainModule2,
      _events: _events2,
      _eventsCount: _eventsCount2,
      _exiting: _exiting2,
      _maxListeners: _maxListeners2,
      _debugEnd: _debugEnd2,
      _debugProcess: _debugProcess2,
      _fatalException: _fatalException2,
      _getActiveHandles: _getActiveHandles2,
      _getActiveRequests: _getActiveRequests2,
      _kill: _kill2,
      _preload_modules: _preload_modules2,
      _rawDebug: _rawDebug2,
      _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
      _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
      _tickCallback: _tickCallback2,
      _disconnect: _disconnect2,
      _handleQueue: _handleQueue2,
      _pendingMessage: _pendingMessage2,
      _channel: _channel2,
      _send: _send2,
      _linkedBinding: _linkedBinding2
    } = unenvProcess2);
    _process2 = {
      abort: abort2,
      addListener: addListener2,
      allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
      hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
      setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
      loadEnvFile: loadEnvFile2,
      sourceMapsEnabled: sourceMapsEnabled2,
      arch: arch2,
      argv: argv2,
      argv0: argv02,
      chdir: chdir2,
      config: config2,
      connected: connected2,
      constrainedMemory: constrainedMemory2,
      availableMemory: availableMemory2,
      cpuUsage: cpuUsage2,
      cwd: cwd2,
      debugPort: debugPort2,
      dlopen: dlopen2,
      disconnect: disconnect2,
      emit: emit2,
      emitWarning: emitWarning2,
      env: env3,
      eventNames: eventNames2,
      execArgv: execArgv2,
      execPath: execPath2,
      exit: exit2,
      finalization: finalization2,
      features: features2,
      getBuiltinModule: getBuiltinModule2,
      getActiveResourcesInfo: getActiveResourcesInfo2,
      getMaxListeners: getMaxListeners2,
      hrtime: hrtime32,
      kill: kill2,
      listeners: listeners2,
      listenerCount: listenerCount2,
      memoryUsage: memoryUsage2,
      nextTick: nextTick2,
      on: on2,
      off: off2,
      once: once2,
      pid: pid2,
      platform: platform2,
      ppid: ppid2,
      prependListener: prependListener2,
      prependOnceListener: prependOnceListener2,
      rawListeners: rawListeners2,
      release: release2,
      removeAllListeners: removeAllListeners2,
      removeListener: removeListener2,
      report: report2,
      resourceUsage: resourceUsage2,
      setMaxListeners: setMaxListeners2,
      setSourceMapsEnabled: setSourceMapsEnabled2,
      stderr: stderr2,
      stdin: stdin2,
      stdout: stdout2,
      title: title2,
      throwDeprecation: throwDeprecation2,
      traceDeprecation: traceDeprecation2,
      umask: umask2,
      uptime: uptime2,
      version: version2,
      versions: versions2,
      // @ts-expect-error old API
      domain: domain2,
      initgroups: initgroups2,
      moduleLoadList: moduleLoadList2,
      reallyExit: reallyExit2,
      openStdin: openStdin2,
      assert: assert22,
      binding: binding2,
      send: send2,
      exitCode: exitCode2,
      channel: channel2,
      getegid: getegid2,
      geteuid: geteuid2,
      getgid: getgid2,
      getgroups: getgroups2,
      getuid: getuid2,
      setegid: setegid2,
      seteuid: seteuid2,
      setgid: setgid2,
      setgroups: setgroups2,
      setuid: setuid2,
      permission: permission2,
      mainModule: mainModule2,
      _events: _events2,
      _eventsCount: _eventsCount2,
      _exiting: _exiting2,
      _maxListeners: _maxListeners2,
      _debugEnd: _debugEnd2,
      _debugProcess: _debugProcess2,
      _fatalException: _fatalException2,
      _getActiveHandles: _getActiveHandles2,
      _getActiveRequests: _getActiveRequests2,
      _kill: _kill2,
      _preload_modules: _preload_modules2,
      _rawDebug: _rawDebug2,
      _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
      _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
      _tickCallback: _tickCallback2,
      _disconnect: _disconnect2,
      _handleQueue: _handleQueue2,
      _pendingMessage: _pendingMessage2,
      _channel: _channel2,
      _send: _send2,
      _linkedBinding: _linkedBinding2
    };
    process_default2 = _process2;
  }
});
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default2;
  }
});
var BROWSER;
var init_false = __esm({
  "../output/server/chunks/false.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    BROWSER = false;
  }
});
var init_remote_functions = __esm({
  "../../node_modules/@sveltejs/kit/src/exports/internal/remote-functions.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});
var HttpError;
var Redirect;
var SvelteKitError;
var ActionFailure;
var init_internal = __esm({
  "../../node_modules/@sveltejs/kit/src/exports/internal/index.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_remote_functions();
    HttpError = class {
      static {
        __name(this, "HttpError");
      }
      static {
        __name2(this, "HttpError");
      }
      /**
       * @param {number} status
       * @param {{message: string} extends App.Error ? (App.Error | string | undefined) : App.Error} body
       */
      constructor(status, body2) {
        this.status = status;
        if (typeof body2 === "string") {
          this.body = { message: body2 };
        } else if (body2) {
          this.body = body2;
        } else {
          this.body = { message: `Error: ${status}` };
        }
      }
      toString() {
        return JSON.stringify(this.body);
      }
    };
    Redirect = class {
      static {
        __name(this, "Redirect");
      }
      static {
        __name2(this, "Redirect");
      }
      /**
       * @param {300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308} status
       * @param {string} location
       */
      constructor(status, location) {
        this.status = status;
        this.location = location;
      }
    };
    SvelteKitError = class extends Error {
      static {
        __name(this, "SvelteKitError");
      }
      static {
        __name2(this, "SvelteKitError");
      }
      /**
       * @param {number} status
       * @param {string} text
       * @param {string} message
       */
      constructor(status, text2, message) {
        super(message);
        this.status = status;
        this.text = text2;
      }
    };
    ActionFailure = class {
      static {
        __name(this, "ActionFailure");
      }
      static {
        __name2(this, "ActionFailure");
      }
      /**
       * @param {number} status
       * @param {T} data
       */
      constructor(status, data) {
        this.status = status;
        this.data = data;
      }
    };
  }
});
function resolve(base2, path) {
  if (path[0] === "/" && path[1] === "/") return path;
  let url = new URL(base2, internal);
  url = new URL(path, url);
  return url.protocol === internal.protocol ? url.pathname + url.search + url.hash : url.href;
}
__name(resolve, "resolve");
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore") return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}
__name(normalize_path, "normalize_path");
function decode_pathname(pathname) {
  return pathname.split("%25").map(decodeURI).join("%25");
}
__name(decode_pathname, "decode_pathname");
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = decodeURIComponent(params[key2]);
  }
  return params;
}
__name(decode_params, "decode_params");
function make_trackable(url, callback, search_params_callback, allow_hash = false) {
  const tracked = new URL(url);
  Object.defineProperty(tracked, "searchParams", {
    value: new Proxy(tracked.searchParams, {
      get(obj, key2) {
        if (key2 === "get" || key2 === "getAll" || key2 === "has") {
          return (param) => {
            search_params_callback(param);
            return obj[key2](param);
          };
        }
        callback();
        const value = Reflect.get(obj, key2);
        return typeof value === "function" ? value.bind(obj) : value;
      }
    }),
    enumerable: true,
    configurable: true
  });
  const tracked_url_properties = ["href", "pathname", "search", "toString", "toJSON"];
  if (allow_hash) tracked_url_properties.push("hash");
  for (const property of tracked_url_properties) {
    Object.defineProperty(tracked, property, {
      get() {
        callback();
        return url[property];
      },
      enumerable: true,
      configurable: true
    });
  }
  {
    tracked[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(url, opts);
    };
    tracked.searchParams[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(url.searchParams, opts);
    };
  }
  if (!allow_hash) {
    disable_hash(tracked);
  }
  return tracked;
}
__name(make_trackable, "make_trackable");
function disable_hash(url) {
  allow_nodejs_console_log(url);
  Object.defineProperty(url, "hash", {
    get() {
      throw new Error(
        "Cannot access event.url.hash. Consider using `page.url.hash` inside a component instead"
      );
    }
  });
}
__name(disable_hash, "disable_hash");
function disable_search(url) {
  allow_nodejs_console_log(url);
  for (const property of ["search", "searchParams"]) {
    Object.defineProperty(url, property, {
      get() {
        throw new Error(`Cannot access url.${property} on a page with prerendering enabled`);
      }
    });
  }
}
__name(disable_search, "disable_search");
function allow_nodejs_console_log(url) {
  {
    url[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(new URL(url), opts);
    };
  }
}
__name(allow_nodejs_console_log, "allow_nodejs_console_log");
function validator(expected) {
  function validate(module, file) {
    if (!module) return;
    for (const key2 in module) {
      if (key2[0] === "_" || expected.has(key2)) continue;
      const values = [...expected.values()];
      const hint = hint_for_supported_files(key2, file?.slice(file.lastIndexOf("."))) ?? `valid exports are ${values.join(", ")}, or anything with a '_' prefix`;
      throw new Error(`Invalid export '${key2}'${file ? ` in ${file}` : ""} (${hint})`);
    }
  }
  __name(validate, "validate");
  __name2(validate, "validate");
  return validate;
}
__name(validator, "validator");
function hint_for_supported_files(key2, ext = ".js") {
  const supported_files = [];
  if (valid_layout_exports.has(key2)) {
    supported_files.push(`+layout${ext}`);
  }
  if (valid_page_exports.has(key2)) {
    supported_files.push(`+page${ext}`);
  }
  if (valid_layout_server_exports.has(key2)) {
    supported_files.push(`+layout.server${ext}`);
  }
  if (valid_page_server_exports.has(key2)) {
    supported_files.push(`+page.server${ext}`);
  }
  if (valid_server_exports.has(key2)) {
    supported_files.push(`+server${ext}`);
  }
  if (supported_files.length > 0) {
    return `'${key2}' is a valid export in ${supported_files.slice(0, -1).join(", ")}${supported_files.length > 1 ? " or " : ""}${supported_files.at(-1)}`;
  }
}
__name(hint_for_supported_files, "hint_for_supported_files");
var internal;
var valid_layout_exports;
var valid_page_exports;
var valid_layout_server_exports;
var valid_page_server_exports;
var valid_server_exports;
var validate_layout_exports;
var validate_page_exports;
var validate_layout_server_exports;
var validate_page_server_exports;
var validate_server_exports;
var init_exports = __esm({
  "../output/server/chunks/exports.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    internal = new URL("sveltekit-internal://");
    __name2(resolve, "resolve");
    __name2(normalize_path, "normalize_path");
    __name2(decode_pathname, "decode_pathname");
    __name2(decode_params, "decode_params");
    __name2(make_trackable, "make_trackable");
    __name2(disable_hash, "disable_hash");
    __name2(disable_search, "disable_search");
    __name2(allow_nodejs_console_log, "allow_nodejs_console_log");
    __name2(validator, "validator");
    __name2(hint_for_supported_files, "hint_for_supported_files");
    valid_layout_exports = /* @__PURE__ */ new Set([
      "load",
      "prerender",
      "csr",
      "ssr",
      "trailingSlash",
      "config"
    ]);
    valid_page_exports = /* @__PURE__ */ new Set([...valid_layout_exports, "entries"]);
    valid_layout_server_exports = /* @__PURE__ */ new Set([...valid_layout_exports]);
    valid_page_server_exports = /* @__PURE__ */ new Set([...valid_layout_server_exports, "actions", "entries"]);
    valid_server_exports = /* @__PURE__ */ new Set([
      "GET",
      "POST",
      "PATCH",
      "PUT",
      "DELETE",
      "OPTIONS",
      "HEAD",
      "fallback",
      "prerender",
      "trailingSlash",
      "config",
      "entries"
    ]);
    validate_layout_exports = validator(valid_layout_exports);
    validate_page_exports = validator(valid_page_exports);
    validate_layout_server_exports = validator(valid_layout_server_exports);
    validate_page_server_exports = validator(valid_page_server_exports);
    validate_server_exports = validator(valid_server_exports);
  }
});
function get_relative_path(from, to) {
  const from_parts = from.split(/[/\\]/);
  const to_parts = to.split(/[/\\]/);
  from_parts.pop();
  while (from_parts[0] === to_parts[0]) {
    from_parts.shift();
    to_parts.shift();
  }
  let i = from_parts.length;
  while (i--) from_parts[i] = "..";
  return from_parts.concat(to_parts).join("/");
}
__name(get_relative_path, "get_relative_path");
function base64_encode(bytes) {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
__name(base64_encode, "base64_encode");
function base64_decode(encoded) {
  if (globalThis.Buffer) {
    const buffer = globalThis.Buffer.from(encoded, "base64");
    return new Uint8Array(buffer);
  }
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
__name(base64_decode, "base64_decode");
var text_encoder2;
var text_decoder2;
var init_utils2 = __esm({
  "../output/server/chunks/utils.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    text_encoder2 = new TextEncoder();
    text_decoder2 = new TextDecoder();
    __name2(get_relative_path, "get_relative_path");
    __name2(base64_encode, "base64_encode");
    __name2(base64_decode, "base64_decode");
  }
});
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
__name(run_all, "run_all");
function deferred() {
  var resolve2;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve2 = res;
    reject = rej;
  });
  return { promise, resolve: resolve2, reject };
}
__name(deferred, "deferred");
var is_array;
var index_of;
var array_from;
var define_property;
var get_descriptor;
var object_prototype;
var array_prototype;
var get_prototype_of;
var is_extensible;
var noop;
var init_utils22 = __esm({
  "../output/server/chunks/utils2.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    is_array = Array.isArray;
    index_of = Array.prototype.indexOf;
    array_from = Array.from;
    define_property = Object.defineProperty;
    get_descriptor = Object.getOwnPropertyDescriptor;
    object_prototype = Object.prototype;
    array_prototype = Array.prototype;
    get_prototype_of = Object.getPrototypeOf;
    is_extensible = Object.isExtensible;
    noop = /* @__PURE__ */ __name2(() => {
    }, "noop");
    __name2(run_all, "run_all");
    __name2(deferred, "deferred");
  }
});
function equals(value) {
  return value === this.v;
}
__name(equals, "equals");
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
__name(safe_not_equal, "safe_not_equal");
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}
__name(safe_equals, "safe_equals");
var init_equality = __esm({
  "../output/server/chunks/equality.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name2(equals, "equals");
    __name2(safe_not_equal, "safe_not_equal");
    __name2(safe_equals, "safe_equals");
  }
});
var init_clsx = __esm({
  "../../node_modules/clsx/dist/clsx.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
__name(readable, "readable");
function writable(value, start = noop) {
  let stop = null;
  const subscribers = /* @__PURE__ */ new Set();
  function set2(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  __name(set2, "set2");
  __name2(set2, "set");
  function update(fn) {
    set2(fn(
      /** @type {T} */
      value
    ));
  }
  __name(update, "update");
  __name2(update, "update");
  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set2, update) || noop;
    }
    run(
      /** @type {T} */
      value
    );
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  __name(subscribe, "subscribe");
  __name2(subscribe, "subscribe");
  return { set: set2, update, subscribe };
}
__name(writable, "writable");
var subscriber_queue;
var init_chunks = __esm({
  "../output/server/chunks/index.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils22();
    init_equality();
    init_clsx();
    subscriber_queue = [];
    __name2(readable, "readable");
    __name2(writable, "writable");
  }
});
function lifecycle_outside_component(name) {
  {
    throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
  }
}
__name(lifecycle_outside_component, "lifecycle_outside_component");
function escape_html(value, is_attr) {
  const str = String(value ?? "");
  const pattern2 = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern2.lastIndex = 0;
  let escaped2 = "";
  let last = 0;
  while (pattern2.test(str)) {
    const i = pattern2.lastIndex - 1;
    const ch = str[i];
    escaped2 += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped2 + str.substring(last);
}
__name(escape_html, "escape_html");
function getContext(key2) {
  const context_map = get_or_init_context_map();
  const result = (
    /** @type {T} */
    context_map.get(key2)
  );
  return result;
}
__name(getContext, "getContext");
function setContext(key2, context3) {
  get_or_init_context_map().set(key2, context3);
  return context3;
}
__name(setContext, "setContext");
function get_or_init_context_map(name) {
  if (current_component === null) {
    lifecycle_outside_component();
  }
  return current_component.c ??= new Map(get_parent_context(current_component) || void 0);
}
__name(get_or_init_context_map, "get_or_init_context_map");
function push(fn) {
  current_component = { p: current_component, c: null, d: null };
}
__name(push, "push");
function pop() {
  var component4 = (
    /** @type {Component} */
    current_component
  );
  var ondestroy = component4.d;
  if (ondestroy) {
    on_destroy.push(...ondestroy);
  }
  current_component = component4.p;
}
__name(pop, "pop");
function get_parent_context(component_context2) {
  let parent = component_context2.p;
  while (parent !== null) {
    const context_map = parent.c;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.p;
  }
  return null;
}
__name(get_parent_context, "get_parent_context");
function props_id_generator(prefix) {
  let uid = 1;
  return () => `${prefix}s${uid++}`;
}
__name(props_id_generator, "props_id_generator");
function abort22() {
  controller?.abort(STALE_REACTION);
  controller = null;
}
__name(abort22, "abort2");
function render(component4, options2 = {}) {
  try {
    const payload = new Payload(options2.idPrefix ? options2.idPrefix + "-" : "");
    const prev_on_destroy = on_destroy;
    on_destroy = [];
    payload.out.push(BLOCK_OPEN);
    let reset_reset_element;
    if (BROWSER) ;
    if (options2.context) {
      push();
      current_component.c = options2.context;
    }
    component4(payload, options2.props ?? {}, {}, {});
    if (options2.context) {
      pop();
    }
    if (reset_reset_element) {
      reset_reset_element();
    }
    payload.out.push(BLOCK_CLOSE);
    for (const cleanup of on_destroy) cleanup();
    on_destroy = prev_on_destroy;
    let head2 = payload.head.out.join("") + payload.head.title;
    for (const { hash: hash2, code } of payload.css) {
      head2 += `<style id="${hash2}">${code}</style>`;
    }
    const body2 = payload.out.join("");
    return {
      head: head2,
      html: body2,
      body: body2
    };
  } finally {
    abort22();
  }
}
__name(render, "render");
function slot(payload, $$props, name, slot_props, fallback_fn) {
  var slot_fn = $$props.$$slots?.[name];
  if (slot_fn === true) {
    slot_fn = $$props["children"];
  }
  if (slot_fn !== void 0) {
    slot_fn(payload, slot_props);
  }
}
__name(slot, "slot");
function bind_props(props_parent, props_now) {
  for (const key2 in props_now) {
    const initial_value = props_parent[key2];
    const value = props_now[key2];
    if (initial_value === void 0 && value !== void 0 && Object.getOwnPropertyDescriptor(props_parent, key2)?.set) {
      props_parent[key2] = value;
    }
  }
}
__name(bind_props, "bind_props");
function ensure_array_like(array_like_or_iterator) {
  if (array_like_or_iterator) {
    return array_like_or_iterator.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  return [];
}
__name(ensure_array_like, "ensure_array_like");
var DERIVED;
var EFFECT;
var BLOCK_EFFECT;
var BRANCH_EFFECT;
var ROOT_EFFECT;
var BOUNDARY_EFFECT;
var UNOWNED;
var DISCONNECTED;
var CLEAN;
var DIRTY;
var MAYBE_DIRTY;
var INERT;
var DESTROYED;
var EFFECT_RAN;
var EFFECT_TRANSPARENT;
var INSPECT_EFFECT;
var HEAD_EFFECT;
var EFFECT_PRESERVED;
var USER_EFFECT;
var REACTION_IS_UPDATING;
var ASYNC;
var ERROR_VALUE;
var STATE_SYMBOL;
var LEGACY_PROPS;
var STALE_REACTION;
var COMMENT_NODE;
var HYDRATION_START;
var HYDRATION_END;
var HYDRATION_ERROR;
var UNINITIALIZED;
var ATTR_REGEX;
var CONTENT_REGEX;
var current_component;
var BLOCK_OPEN;
var BLOCK_CLOSE;
var HeadPayload;
var Payload;
var controller;
var on_destroy;
var init_index2 = __esm({
  "../output/server/chunks/index2.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_clsx();
    init_false();
    DERIVED = 1 << 1;
    EFFECT = 1 << 2;
    BLOCK_EFFECT = 1 << 4;
    BRANCH_EFFECT = 1 << 5;
    ROOT_EFFECT = 1 << 6;
    BOUNDARY_EFFECT = 1 << 7;
    UNOWNED = 1 << 8;
    DISCONNECTED = 1 << 9;
    CLEAN = 1 << 10;
    DIRTY = 1 << 11;
    MAYBE_DIRTY = 1 << 12;
    INERT = 1 << 13;
    DESTROYED = 1 << 14;
    EFFECT_RAN = 1 << 15;
    EFFECT_TRANSPARENT = 1 << 16;
    INSPECT_EFFECT = 1 << 17;
    HEAD_EFFECT = 1 << 18;
    EFFECT_PRESERVED = 1 << 19;
    USER_EFFECT = 1 << 20;
    REACTION_IS_UPDATING = 1 << 21;
    ASYNC = 1 << 22;
    ERROR_VALUE = 1 << 23;
    STATE_SYMBOL = Symbol("$state");
    LEGACY_PROPS = Symbol("legacy props");
    STALE_REACTION = new class StaleReactionError extends Error {
      static {
        __name(this, "StaleReactionError");
      }
      static {
        __name2(this, "StaleReactionError");
      }
      name = "StaleReactionError";
      message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
    }();
    COMMENT_NODE = 8;
    __name2(lifecycle_outside_component, "lifecycle_outside_component");
    HYDRATION_START = "[";
    HYDRATION_END = "]";
    HYDRATION_ERROR = {};
    UNINITIALIZED = Symbol();
    ATTR_REGEX = /[&"<]/g;
    CONTENT_REGEX = /[&<]/g;
    __name2(escape_html, "escape_html");
    current_component = null;
    __name2(getContext, "getContext");
    __name2(setContext, "setContext");
    __name2(get_or_init_context_map, "get_or_init_context_map");
    __name2(push, "push");
    __name2(pop, "pop");
    __name2(get_parent_context, "get_parent_context");
    BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
    BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;
    HeadPayload = class {
      static {
        __name(this, "HeadPayload");
      }
      static {
        __name2(this, "HeadPayload");
      }
      /** @type {Set<{ hash: string; code: string }>} */
      css = /* @__PURE__ */ new Set();
      /** @type {string[]} */
      out = [];
      uid = /* @__PURE__ */ __name2(() => "", "uid");
      title = "";
      constructor(css = /* @__PURE__ */ new Set(), out = [], title22 = "", uid = () => "") {
        this.css = css;
        this.out = out;
        this.title = title22;
        this.uid = uid;
      }
    };
    Payload = class {
      static {
        __name(this, "Payload");
      }
      static {
        __name2(this, "Payload");
      }
      /** @type {Set<{ hash: string; code: string }>} */
      css = /* @__PURE__ */ new Set();
      /** @type {string[]} */
      out = [];
      uid = /* @__PURE__ */ __name2(() => "", "uid");
      select_value = void 0;
      head = new HeadPayload();
      constructor(id_prefix = "") {
        this.uid = props_id_generator(id_prefix);
        this.head.uid = this.uid;
      }
    };
    __name2(props_id_generator, "props_id_generator");
    controller = null;
    __name2(abort22, "abort");
    on_destroy = [];
    __name2(render, "render");
    __name2(slot, "slot");
    __name2(bind_props, "bind_props");
    __name2(ensure_array_like, "ensure_array_like");
  }
});
var require_cookie = __commonJS({
  "../../node_modules/cookie/index.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    exports.parse = parse3;
    exports.serialize = serialize2;
    var __toString = Object.prototype.toString;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse3(str, options2) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options2 || {};
      var dec = opt.decode || decode;
      var index4 = 0;
      while (index4 < str.length) {
        var eqIdx = str.indexOf("=", index4);
        if (eqIdx === -1) {
          break;
        }
        var endIdx = str.indexOf(";", index4);
        if (endIdx === -1) {
          endIdx = str.length;
        } else if (endIdx < eqIdx) {
          index4 = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        var key2 = str.slice(index4, eqIdx).trim();
        if (void 0 === obj[key2]) {
          var val = str.slice(eqIdx + 1, endIdx).trim();
          if (val.charCodeAt(0) === 34) {
            val = val.slice(1, -1);
          }
          obj[key2] = tryDecode(val, dec);
        }
        index4 = endIdx + 1;
      }
      return obj;
    }
    __name(parse3, "parse3");
    __name2(parse3, "parse");
    function serialize2(name, val, options2) {
      var opt = options2 || {};
      var enc = opt.encode || encode2;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.partitioned) {
        str += "; Partitioned";
      }
      if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError("option priority is invalid");
        }
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    __name(serialize2, "serialize2");
    __name2(serialize2, "serialize");
    function decode(str) {
      return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
    }
    __name(decode, "decode");
    __name2(decode, "decode");
    function encode2(val) {
      return encodeURIComponent(val);
    }
    __name(encode2, "encode2");
    __name2(encode2, "encode");
    function isDate(val) {
      return __toString.call(val) === "[object Date]" || val instanceof Date;
    }
    __name(isDate, "isDate");
    __name2(isDate, "isDate");
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e3) {
        return str;
      }
    }
    __name(tryDecode, "tryDecode");
    __name2(tryDecode, "tryDecode");
  }
});
var require_set_cookie = __commonJS({
  "../../node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var defaultParseOptions = {
      decodeValues: true,
      map: false,
      silent: false
    };
    function isNonEmptyString(str) {
      return typeof str === "string" && !!str.trim();
    }
    __name(isNonEmptyString, "isNonEmptyString");
    __name2(isNonEmptyString, "isNonEmptyString");
    function parseString2(setCookieValue, options2) {
      var parts = setCookieValue.split(";").filter(isNonEmptyString);
      var nameValuePairStr = parts.shift();
      var parsed = parseNameValuePair(nameValuePairStr);
      var name = parsed.name;
      var value = parsed.value;
      options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
      try {
        value = options2.decodeValues ? decodeURIComponent(value) : value;
      } catch (e3) {
        console.error(
          "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
          e3
        );
      }
      var cookie = {
        name,
        value
      };
      parts.forEach(function(part) {
        var sides = part.split("=");
        var key2 = sides.shift().trimLeft().toLowerCase();
        var value2 = sides.join("=");
        if (key2 === "expires") {
          cookie.expires = new Date(value2);
        } else if (key2 === "max-age") {
          cookie.maxAge = parseInt(value2, 10);
        } else if (key2 === "secure") {
          cookie.secure = true;
        } else if (key2 === "httponly") {
          cookie.httpOnly = true;
        } else if (key2 === "samesite") {
          cookie.sameSite = value2;
        } else if (key2 === "partitioned") {
          cookie.partitioned = true;
        } else {
          cookie[key2] = value2;
        }
      });
      return cookie;
    }
    __name(parseString2, "parseString2");
    __name2(parseString2, "parseString");
    function parseNameValuePair(nameValuePairStr) {
      var name = "";
      var value = "";
      var nameValueArr = nameValuePairStr.split("=");
      if (nameValueArr.length > 1) {
        name = nameValueArr.shift();
        value = nameValueArr.join("=");
      } else {
        value = nameValuePairStr;
      }
      return { name, value };
    }
    __name(parseNameValuePair, "parseNameValuePair");
    __name2(parseNameValuePair, "parseNameValuePair");
    function parse3(input, options2) {
      options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
      if (!input) {
        if (!options2.map) {
          return [];
        } else {
          return {};
        }
      }
      if (input.headers) {
        if (typeof input.headers.getSetCookie === "function") {
          input = input.headers.getSetCookie();
        } else if (input.headers["set-cookie"]) {
          input = input.headers["set-cookie"];
        } else {
          var sch = input.headers[Object.keys(input.headers).find(function(key2) {
            return key2.toLowerCase() === "set-cookie";
          })];
          if (!sch && input.headers.cookie && !options2.silent) {
            console.warn(
              "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
            );
          }
          input = sch;
        }
      }
      if (!Array.isArray(input)) {
        input = [input];
      }
      if (!options2.map) {
        return input.filter(isNonEmptyString).map(function(str) {
          return parseString2(str, options2);
        });
      } else {
        var cookies = {};
        return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
          var cookie = parseString2(str, options2);
          cookies2[cookie.name] = cookie;
          return cookies2;
        }, cookies);
      }
    }
    __name(parse3, "parse3");
    __name2(parse3, "parse");
    function splitCookiesString2(cookiesString) {
      if (Array.isArray(cookiesString)) {
        return cookiesString;
      }
      if (typeof cookiesString !== "string") {
        return [];
      }
      var cookiesStrings = [];
      var pos = 0;
      var start;
      var ch;
      var lastComma;
      var nextStart;
      var cookiesSeparatorFound;
      function skipWhitespace() {
        while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
          pos += 1;
        }
        return pos < cookiesString.length;
      }
      __name(skipWhitespace, "skipWhitespace");
      __name2(skipWhitespace, "skipWhitespace");
      function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
      }
      __name(notSpecialChar, "notSpecialChar");
      __name2(notSpecialChar, "notSpecialChar");
      while (pos < cookiesString.length) {
        start = pos;
        cookiesSeparatorFound = false;
        while (skipWhitespace()) {
          ch = cookiesString.charAt(pos);
          if (ch === ",") {
            lastComma = pos;
            pos += 1;
            skipWhitespace();
            nextStart = pos;
            while (pos < cookiesString.length && notSpecialChar()) {
              pos += 1;
            }
            if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
              cookiesSeparatorFound = true;
              pos = nextStart;
              cookiesStrings.push(cookiesString.substring(start, lastComma));
              start = pos;
            } else {
              pos = lastComma + 1;
            }
          } else {
            pos += 1;
          }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
          cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
      }
      return cookiesStrings;
    }
    __name(splitCookiesString2, "splitCookiesString2");
    __name2(splitCookiesString2, "splitCookiesString");
    module.exports = parse3;
    module.exports.parse = parse3;
    module.exports.parseString = parseString2;
    module.exports.splitCookiesString = splitCookiesString2;
  }
});
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: /* @__PURE__ */ __name(() => _layout, "default")
});
function _layout($$payload, $$props) {
  $$payload.out.push(`<!---->`);
  slot($$payload, $$props, "default", {});
  $$payload.out.push(`<!---->`);
}
__name(_layout, "_layout");
var init_layout_svelte = __esm({
  "../output/server/entries/pages/_layout.svelte.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_index2();
    __name2(_layout, "_layout");
  }
});
var __exports = {};
__export(__exports, {
  component: /* @__PURE__ */ __name(() => component, "component"),
  fonts: /* @__PURE__ */ __name(() => fonts, "fonts"),
  imports: /* @__PURE__ */ __name(() => imports, "imports"),
  index: /* @__PURE__ */ __name(() => index, "index"),
  stylesheets: /* @__PURE__ */ __name(() => stylesheets, "stylesheets"),
  universal: /* @__PURE__ */ __name(() => universal, "universal"),
  universal_id: /* @__PURE__ */ __name(() => universal_id, "universal_id")
});
var index;
var component_cache;
var component;
var universal;
var universal_id;
var imports;
var stylesheets;
var fonts;
var init__ = __esm({
  "../output/server/nodes/0.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    index = 0;
    component = /* @__PURE__ */ __name2(async () => component_cache ??= (await Promise.resolve().then(() => (init_layout_svelte(), layout_svelte_exports))).default, "component");
    universal = {
      "ssr": false,
      "prerender": true
    };
    universal_id = "src/routes/+layout.ts";
    imports = ["_app/immutable/nodes/0.9B0ZCc5b.js", "_app/immutable/chunks/DsnmJJEf.js", "_app/immutable/chunks/BOa9FnyB.js", "_app/immutable/chunks/DqNh6aJv.js"];
    stylesheets = ["_app/immutable/assets/0.CF2Kqvlc.css"];
    fonts = [];
  }
});
var is_legacy;
var init_state_svelte = __esm({
  "../output/server/chunks/state.svelte.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_clsx();
    init_utils22();
    is_legacy = noop.toString().includes("$$") || /function \w+\(\) \{\}/.test(noop.toString());
    if (is_legacy) {
      ({
        data: {},
        form: null,
        error: null,
        params: {},
        route: { id: null },
        state: {},
        status: -1,
        url: new URL("https://example.com")
      });
    }
  }
});
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: /* @__PURE__ */ __name(() => Error$1, "default")
});
function create_updated_store() {
  const { set: set2, subscribe } = writable(false);
  {
    return {
      subscribe,
      // eslint-disable-next-line @typescript-eslint/require-await
      check: /* @__PURE__ */ __name2(async () => false, "check")
    };
  }
}
__name(create_updated_store, "create_updated_store");
function context22() {
  return getContext("__request__");
}
__name(context22, "context2");
function Error$1($$payload, $$props) {
  push();
  $$payload.out.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
  pop();
}
__name(Error$1, "Error$1");
var stores;
var page$1;
var page;
var init_error_svelte = __esm({
  "../output/server/entries/fallbacks/error.svelte.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_index2();
    init_clsx();
    init_state_svelte();
    init_internal();
    init_exports();
    init_utils2();
    init_chunks();
    __name2(create_updated_store, "create_updated_store");
    stores = {
      updated: /* @__PURE__ */ create_updated_store()
    };
    ({
      check: stores.updated.check
    });
    __name2(context22, "context");
    page$1 = {
      get error() {
        return context22().page.error;
      },
      get status() {
        return context22().page.status;
      }
    };
    page = page$1;
    __name2(Error$1, "Error$1");
  }
});
var __exports2 = {};
__export(__exports2, {
  component: /* @__PURE__ */ __name(() => component2, "component"),
  fonts: /* @__PURE__ */ __name(() => fonts2, "fonts"),
  imports: /* @__PURE__ */ __name(() => imports2, "imports"),
  index: /* @__PURE__ */ __name(() => index2, "index"),
  stylesheets: /* @__PURE__ */ __name(() => stylesheets2, "stylesheets")
});
var index2;
var component_cache2;
var component2;
var imports2;
var stylesheets2;
var fonts2;
var init__2 = __esm({
  "../output/server/nodes/1.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    index2 = 1;
    component2 = /* @__PURE__ */ __name2(async () => component_cache2 ??= (await Promise.resolve().then(() => (init_error_svelte(), error_svelte_exports))).default, "component");
    imports2 = ["_app/immutable/nodes/1.BYy_QZKz.js", "_app/immutable/chunks/DsnmJJEf.js", "_app/immutable/chunks/BOa9FnyB.js", "_app/immutable/chunks/DqNh6aJv.js", "_app/immutable/chunks/Dm3dlnA8.js", "_app/immutable/chunks/CepPuhdz.js", "_app/immutable/chunks/CDd9afVY.js", "_app/immutable/chunks/BEwx_mex.js"];
    stylesheets2 = [];
    fonts2 = [];
  }
});
var page_server_ts_exports = {};
__export(page_server_ts_exports, {
  load: /* @__PURE__ */ __name(() => load, "load")
});
async function ensureSchema(DB) {
  await DB.prepare(
    `CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      filename TEXT,
      store_number TEXT,
      store_name TEXT,
      pages_scanned INTEGER,
      pages_total INTEGER,
      rows_returned INTEGER,
      rows_considered INTEGER,
      limit_pages INTEGER,
      parser_url TEXT,
      client_ip TEXT
    )`
  ).run();
  await DB.prepare(
    `CREATE INDEX IF NOT EXISTS idx_uploads_store
     ON uploads (store_number, store_name)`
  ).run();
  await DB.prepare(
    `CREATE INDEX IF NOT EXISTS idx_uploads_created
     ON uploads (created_at)`
  ).run();
}
__name(ensureSchema, "ensureSchema");
var load;
var init_page_server_ts = __esm({
  "../output/server/entries/pages/admin/_page.server.ts.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    load = /* @__PURE__ */ __name2(async (event) => {
      event.setHeaders({ "cache-control": "no-store" });
      const DB = event.platform?.env?.DB;
      if (!DB) {
        return {
          summary: {
            totals: { uploads: 0, rows_returned: 0 },
            byStore: [],
            recent: []
          }
        };
      }
      await ensureSchema(DB);
      const totalsRow = await DB.prepare(
        `SELECT COUNT(*) AS uploads, COALESCE(SUM(rows_returned),0) AS rows_returned FROM uploads`
      ).first() ?? { uploads: 0, rows_returned: 0 };
      const byStoreRes = await DB.prepare(
        `SELECT
        COALESCE(store_number,'') AS store_number,
        COALESCE(store_name,'')   AS store_name,
        COUNT(*)                  AS uploads,
        COALESCE(SUM(rows_returned),0) AS rows_returned,
        MIN(created_at)           AS first_upload,
        MAX(created_at)           AS last_upload
     FROM uploads
     GROUP BY store_number, store_name
     ORDER BY (store_number = '') ASC, store_number ASC, store_name ASC`
      ).all();
      const byStore = byStoreRes?.results ?? [];
      const recentRes = await DB.prepare(
        `SELECT id, created_at, filename, store_number, store_name,
            pages_scanned, pages_total, rows_returned, rows_considered,
            limit_pages, parser_url, client_ip
     FROM uploads
     ORDER BY created_at DESC
     LIMIT 200`
      ).all();
      const recent = recentRes?.results ?? [];
      return {
        summary: {
          totals: totalsRow,
          byStore,
          recent
        }
      };
    }, "load");
    __name2(ensureSchema, "ensureSchema");
  }
});
var page_svelte_exports = {};
__export(page_svelte_exports, {
  default: /* @__PURE__ */ __name(() => _page, "default")
});
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  const { totals, byStore, recent } = data.summary;
  function fmt(ts) {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return ts;
    }
  }
  __name(fmt, "fmt");
  __name2(fmt, "fmt");
  const each_array = ensure_array_like(byStore);
  const each_array_1 = ensure_array_like(recent);
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100"><header class="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur-md"><div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between"><div class="text-lg font-semibold tracking-tight">Admin \u2014 Upload Logs</div> <a href="/" class="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">\u2190 Back</a></div></header> <section class="mx-auto max-w-6xl px-4 py-6 space-y-8"><div class="grid sm:grid-cols-2 gap-4"><div class="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/70"><div class="text-xs text-slate-500">Total uploads</div> <div class="text-2xl font-semibold">${escape_html(totals.uploads)}</div></div> <div class="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/70"><div class="text-xs text-slate-500">Total rows returned</div> <div class="text-2xl font-semibold">${escape_html(totals.rows_returned)}</div></div></div> <div class="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/70"><div class="flex items-center justify-between mb-3"><h2 class="text-lg font-semibold">By Store</h2> <div class="text-xs text-slate-500">Sorted by store number/name</div></div> <div class="overflow-auto"><table class="min-w-[760px] w-full text-left"><thead class="bg-slate-100 dark:bg-slate-800 sticky top-0"><tr class="text-slate-700 dark:text-slate-200"><th class="px-4 py-2 text-sm font-semibold">Store #</th><th class="px-4 py-2 text-sm font-semibold">Store Name</th><th class="px-4 py-2 text-sm font-semibold">Uploads</th><th class="px-4 py-2 text-sm font-semibold">Rows Returned</th><th class="px-4 py-2 text-sm font-semibold">First Upload</th><th class="px-4 py-2 text-sm font-semibold">Last Upload</th></tr></thead><tbody class="[&amp;>tr:nth-child(odd)]:bg-white [&amp;>tr:nth-child(even)]:bg-slate-50 dark:[&amp;>tr:nth-child(odd)]:bg-slate-900/60 dark:[&amp;>tr:nth-child(even)]:bg-slate-900/30"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let s3 = each_array[$$index];
    $$payload.out.push(`<tr class="border-t border-slate-200 dark:border-slate-800"><td class="px-4 py-2">${escape_html(s3.store_number || "\u2014")}</td><td class="px-4 py-2">${escape_html(s3.store_name || "\u2014")}</td><td class="px-4 py-2 tabular-nums">${escape_html(s3.uploads)}</td><td class="px-4 py-2 tabular-nums">${escape_html(s3.rows_returned)}</td><td class="px-4 py-2 text-xs">${escape_html(fmt(s3.first_upload))}</td><td class="px-4 py-2 text-xs">${escape_html(fmt(s3.last_upload))}</td></tr>`);
  }
  $$payload.out.push(`<!--]--></tbody></table></div></div> <div class="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/70"><div class="flex items-center justify-between mb-3"><h2 class="text-lg font-semibold">Recent Uploads</h2> <div class="text-xs text-slate-500">Last 200</div></div> <div class="overflow-auto"><table class="min-w-[860px] w-full text-left"><thead class="bg-slate-100 dark:bg-slate-800 sticky top-0"><tr class="text-slate-700 dark:text-slate-200"><th class="px-4 py-2 text-sm font-semibold">When</th><th class="px-4 py-2 text-sm font-semibold">File</th><th class="px-4 py-2 text-sm font-semibold">Store #</th><th class="px-4 py-2 text-sm font-semibold">Store Name</th><th class="px-4 py-2 text-sm font-semibold">Pages</th><th class="px-4 py-2 text-sm font-semibold">Rows Returned</th><th class="px-4 py-2 text-sm font-semibold">Rows Considered</th><th class="px-4 py-2 text-sm font-semibold">Limit</th><th class="px-4 py-2 text-sm font-semibold">Parser</th><th class="px-4 py-2 text-sm font-semibold">IP</th></tr></thead><tbody class="[&amp;>tr:nth-child(odd)]:bg-white [&amp;>tr:nth-child(even)]:bg-slate-50 dark:[&amp;>tr:nth-child(odd)]:bg-slate-900/60 dark:[&amp;>tr:nth-child(even)]:bg-slate-900/30"><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let r3 = each_array_1[$$index_1];
    $$payload.out.push(`<tr class="border-t border-slate-200 dark:border-slate-800"><td class="px-4 py-2 text-xs">${escape_html(fmt(r3.created_at))}</td><td class="px-4 py-2">${escape_html(r3.filename || "\u2014")}</td><td class="px-4 py-2 tabular-nums">${escape_html(r3.store_number || "\u2014")}</td><td class="px-4 py-2">${escape_html(r3.store_name || "\u2014")}</td><td class="px-4 py-2 tabular-nums">${escape_html(r3.pages_scanned)}/${escape_html(r3.pages_total)}</td><td class="px-4 py-2 tabular-nums">${escape_html(r3.rows_returned ?? "\u2014")}</td><td class="px-4 py-2 tabular-nums">${escape_html(r3.rows_considered ?? "\u2014")}</td><td class="px-4 py-2 tabular-nums">${escape_html(r3.limit_pages ?? "\u2014")}</td><td class="px-4 py-2 text-xs">${escape_html(r3.parser_url || "\u2014")}</td><td class="px-4 py-2 text-xs">${escape_html(r3.client_ip || "\u2014")}</td></tr>`);
  }
  $$payload.out.push(`<!--]--></tbody></table></div></div></section></div>`);
  bind_props($$props, { data });
  pop();
}
__name(_page, "_page");
var init_page_svelte = __esm({
  "../output/server/entries/pages/admin/_page.svelte.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_index2();
    __name2(_page, "_page");
  }
});
var __exports3 = {};
__export(__exports3, {
  component: /* @__PURE__ */ __name(() => component3, "component"),
  fonts: /* @__PURE__ */ __name(() => fonts3, "fonts"),
  imports: /* @__PURE__ */ __name(() => imports3, "imports"),
  index: /* @__PURE__ */ __name(() => index3, "index"),
  server: /* @__PURE__ */ __name(() => page_server_ts_exports, "server"),
  server_id: /* @__PURE__ */ __name(() => server_id, "server_id"),
  stylesheets: /* @__PURE__ */ __name(() => stylesheets3, "stylesheets"),
  universal: /* @__PURE__ */ __name(() => universal2, "universal"),
  universal_id: /* @__PURE__ */ __name(() => universal_id2, "universal_id")
});
var index3;
var component_cache3;
var component3;
var universal2;
var universal_id2;
var server_id;
var imports3;
var stylesheets3;
var fonts3;
var init__3 = __esm({
  "../output/server/nodes/3.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_page_server_ts();
    index3 = 3;
    component3 = /* @__PURE__ */ __name2(async () => component_cache3 ??= (await Promise.resolve().then(() => (init_page_svelte(), page_svelte_exports))).default, "component");
    universal2 = {
      "ssr": false,
      "prerender": false
    };
    universal_id2 = "src/routes/admin/+page.ts";
    server_id = "src/routes/admin/+page.server.ts";
    imports3 = ["_app/immutable/nodes/3.DdI9crxK.js", "_app/immutable/chunks/DsnmJJEf.js", "_app/immutable/chunks/BOa9FnyB.js", "_app/immutable/chunks/DqNh6aJv.js", "_app/immutable/chunks/Dm3dlnA8.js", "_app/immutable/chunks/BDlpvsd4.js", "_app/immutable/chunks/CepPuhdz.js", "_app/immutable/chunks/CVgM_pso.js"];
    stylesheets3 = [];
    fonts3 = [];
  }
});
var server_exports = {};
__export(server_exports, {
  GET: /* @__PURE__ */ __name(() => GET, "GET")
});
var GET;
var init_server = __esm({
  "../output/server/entries/endpoints/api/debug/_server.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    GET = /* @__PURE__ */ __name2(async ({ platform: platform22 }) => {
      const headers2 = { "cache-control": "no-store", "content-type": "application/json" };
      try {
        const PARSER_URL = platform22?.env?.PARSER_URL || "";
        const PARSER_TOKEN = platform22?.env?.PARSER_TOKEN || "";
        let health = { tried: false };
        if (PARSER_URL) {
          try {
            const u = new URL(PARSER_URL);
            const healthUrl = new URL(u);
            healthUrl.pathname = u.pathname.replace(/\/parse\/?$/, "/health");
            const r3 = await fetch(healthUrl.toString(), { method: "GET" });
            const text2 = await r3.text();
            health = { tried: true, url: healthUrl.toString(), status: r3.status, body: text2.slice(0, 300) };
          } catch (e3) {
            health = { tried: true, error: String(e3) };
          }
        }
        return new Response(JSON.stringify({
          ok: true,
          env_present: {
            PARSER_URL: Boolean(PARSER_URL),
            PARSER_TOKEN: Boolean(PARSER_TOKEN)
          },
          parser_url: PARSER_URL,
          health
        }, null, 2), { headers: headers2 });
      } catch (e3) {
        return new Response(JSON.stringify({ ok: false, error: String(e3) }, null, 2), { status: 500, headers: headers2 });
      }
    }, "GET");
  }
});
var server_exports2 = {};
__export(server_exports2, {
  GET: /* @__PURE__ */ __name(() => GET2, "GET")
});
var GET2;
var init_server2 = __esm({
  "../output/server/entries/endpoints/api/model/_server.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    GET2 = /* @__PURE__ */ __name2(async ({ platform: platform22, url }) => {
      const provider = (url.searchParams.get("provider") || "openai").toLowerCase();
      let model = "unknown";
      if (provider === "gemini") {
        model = platform22?.env?.GEMINI_MODEL || "gemini-2.5-flash";
      } else {
        model = platform22?.env?.OPENAI_MODEL || "gpt-5-mini";
      }
      return new Response(JSON.stringify({ provider, model }), {
        headers: { "content-type": "application/json", "cache-control": "no-store" }
      });
    }, "GET");
  }
});
var server_ts_exports = {};
__export(server_ts_exports, {
  GET: /* @__PURE__ */ __name(() => GET3, "GET"),
  POST: /* @__PURE__ */ __name(() => POST, "POST")
});
function getClientIp(request) {
  return request.headers.get("cf-connecting-ip") || (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || null;
}
__name(getClientIp, "getClientIp");
function guessStoreFromParsed(parsed) {
  if (!parsed) return { store_number: null, store_name: null };
  const meta = parsed.meta || {};
  const store = parsed.store || {};
  let store_number = store.number || meta.store_number || null;
  let store_name = store.name || meta.store_name || null;
  const header = meta.header || meta.title || meta.report_header || "";
  if ((!store_number || !store_name) && typeof header === "string" && header) {
    const reList = [
      /Store\s*#?\s*(\d{3,6})\s*[-–—]\s*([A-Za-z0-9 &'()./+-]+)/i,
      /Store\s*No\.?\s*(\d{3,6})\s*[:\-]?\s*([A-Za-z0-9 &'()./+-]+)/i,
      /([A-Za-z0-9 &'()./+-]+)\s*\(\s*Store\s*(\d{3,6})\s*\)/i,
      /([A-Za-z0-9 &'()./+-]+)\s*[-–—]\s*Store\s*(\d{3,6})/i
    ];
    for (const re of reList) {
      const m = re.exec(header);
      if (m) {
        const num = /\d/.test(m[1]) ? m[1] : m[2];
        const name = /\d/.test(m[1]) ? m[2] || "" : m[1] || "";
        store_number ||= num?.trim();
        store_name ||= name?.trim();
        break;
      }
    }
  }
  return { store_number: store_number || null, store_name: store_name || null };
}
__name(guessStoreFromParsed, "guessStoreFromParsed");
async function ensureSchema2(DB) {
  await DB.prepare(
    `CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      filename TEXT,
      store_number TEXT,
      store_name TEXT,
      pages_scanned INTEGER,
      pages_total INTEGER,
      rows_returned INTEGER,
      rows_considered INTEGER,
      limit_pages INTEGER,
      parser_url TEXT,
      client_ip TEXT
    )`
  ).run();
  await DB.prepare(
    `CREATE INDEX IF NOT EXISTS idx_uploads_store
     ON uploads (store_number, store_name)`
  ).run();
  await DB.prepare(
    `CREATE INDEX IF NOT EXISTS idx_uploads_created
     ON uploads (created_at)`
  ).run();
}
__name(ensureSchema2, "ensureSchema2");
async function logUploadToD1({
  platform: platform22,
  filename,
  store_number,
  store_name,
  meta,
  rowsCount,
  limit_pages,
  parser_url,
  client_ip
}) {
  const DB = platform22?.env?.DB;
  if (!DB) return;
  try {
    await ensureSchema2(DB);
    const pages_scanned = Number.isFinite(Number(meta?.pages_scanned)) ? Number(meta.pages_scanned) : null;
    const pages_total = Number.isFinite(Number(meta?.pages_total)) ? Number(meta.pages_total) : null;
    const rows_returned = Number.isFinite(Number(meta?.rows_returned)) ? Number(meta.rows_returned) : Number.isFinite(rowsCount) ? rowsCount : null;
    const rows_considered = Number.isFinite(Number(meta?.rows_considered)) ? Number(meta.rows_considered) : null;
    await DB.prepare(
      `INSERT INTO uploads (
        filename, store_number, store_name,
        pages_scanned, pages_total, rows_returned, rows_considered,
        limit_pages, parser_url, client_ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      filename ?? null,
      store_number ?? null,
      store_name ?? null,
      pages_scanned,
      pages_total,
      rows_returned,
      rows_considered,
      limit_pages ?? null,
      parser_url ?? null,
      client_ip ?? null
    ).run();
  } catch (e3) {
    console.error("D1 log insert failed:", e3);
  }
}
__name(logUploadToD1, "logUploadToD1");
var POST;
var GET3;
var init_server_ts = __esm({
  "../output/server/entries/endpoints/api/upload/_server.ts.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    POST = /* @__PURE__ */ __name2(async ({ request, platform: platform22 }) => {
      const baseHeaders = { "cache-control": "no-store", "content-type": "application/json" };
      try {
        const form = await request.formData();
        const file = form.get("file");
        const limitPages = form.get("limit_pages");
        if (!(file instanceof File)) {
          return new Response(JSON.stringify({ error: 'No PDF file provided (expected form field "file")' }), {
            status: 400,
            headers: baseHeaders
          });
        }
        const storeNumberForm = (form.get("store_number") || "").toString().trim();
        const storeNameForm = (form.get("store_name") || "").toString().trim();
        const PARSER_URL = platform22?.env?.PARSER_URL;
        if (!PARSER_URL) {
          return new Response(JSON.stringify({ error: "PARSER_URL not configured" }), { status: 500, headers: baseHeaders });
        }
        const url = new URL(PARSER_URL);
        const limit = limitPages && String(limitPages).trim() !== "" ? String(limitPages) : "0";
        url.searchParams.set("limit_pages", limit);
        const buf = await file.arrayBuffer();
        const freshFile = new File([buf], file.name || "report.pdf", {
          type: file.type || "application/pdf",
          lastModified: Date.now()
        });
        const fd = new FormData();
        fd.append("file", freshFile);
        const headers2 = {};
        const token = platform22?.env?.PARSER_TOKEN || platform22?.env?.PARSER_AUTH;
        if (token) headers2["Authorization"] = String(token).startsWith("Bearer") ? String(token) : `Bearer ${token}`;
        const timeoutMs = Number(platform22?.env?.PARSER_TIMEOUT_MS) > 0 ? Number(platform22.env.PARSER_TIMEOUT_MS) : 9e4;
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort("timeout"), timeoutMs);
        const r3 = await fetch(url.toString(), { method: "POST", body: fd, headers: headers2, signal: ac.signal }).finally(() => clearTimeout(timer));
        const bodyText = await r3.text();
        let parsed = null;
        try {
          parsed = JSON.parse(bodyText || "{}");
        } catch {
        }
        const guess = guessStoreFromParsed(parsed);
        const store_number = storeNumberForm || guess.store_number || null;
        const store_name = storeNameForm || guess.store_name || null;
        await logUploadToD1({
          platform: platform22,
          filename: file.name || null,
          store_number,
          store_name,
          meta: parsed?.meta,
          rowsCount: Array.isArray(parsed?.rows) ? parsed.rows.length : null,
          limit_pages: Number.isFinite(Number(limit)) ? Number(limit) : null,
          parser_url: url.toString(),
          client_ip: getClientIp(request)
        });
        if (r3.ok) {
          return new Response(bodyText || '{"rows":[]}', {
            status: 200,
            headers: {
              ...baseHeaders,
              "x-parser-status": String(r3.status),
              "x-parser-url": url.toString()
            }
          });
        }
        return new Response(bodyText || JSON.stringify({ error: "Parser error (empty response body)" }), {
          status: r3.status,
          headers: {
            ...baseHeaders,
            "x-parser-status": String(r3.status),
            "x-parser-url": url.toString()
          }
        });
      } catch (e3) {
        return new Response(JSON.stringify({
          error: e3?.message || String(e3),
          hint: "This error happened inside the Cloudflare worker (or a timeout) before returning to the client."
        }), { status: 500, headers: baseHeaders });
      }
    }, "POST");
    GET3 = /* @__PURE__ */ __name2(async ({ request, platform: platform22 }) => {
      const headers2 = { "cache-control": "no-store", "content-type": "application/json" };
      const url = new URL(request.url);
      if (url.searchParams.get("stats") && platform22?.env?.DB) {
        try {
          await ensureSchema2(platform22.env.DB);
          const totals = await platform22.env.DB.prepare(
            `SELECT COUNT(*) AS uploads, COALESCE(SUM(rows_returned),0) AS rows_returned FROM uploads`
          ).first();
          return new Response(JSON.stringify({ ok: true, totals, parser_url: platform22?.env?.PARSER_URL || null }), { headers: headers2 });
        } catch (e3) {
          return new Response(JSON.stringify({ ok: false, error: String(e3) }), { headers: headers2, status: 500 });
        }
      }
      return new Response(JSON.stringify({
        ok: true,
        parser_url: platform22?.env?.PARSER_URL || null
      }), { headers: headers2 });
    }, "GET");
    __name2(getClientIp, "getClientIp");
    __name2(guessStoreFromParsed, "guessStoreFromParsed");
    __name2(ensureSchema2, "ensureSchema");
    __name2(logUploadToD1, "logUploadToD1");
  }
});
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_false();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_internal();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var true_default = true;
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var node_env = globalThis.process?.env?.NODE_ENV;
var dev_fallback_default = node_env && !node_env.toLowerCase().startsWith("prod");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var text_encoder = new TextEncoder();
var text_decoder = new TextDecoder();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function error32(status, body2) {
  if ((!true_default || dev_fallback_default) && (isNaN(status) || status < 400 || status > 599)) {
    throw new Error(`HTTP error status codes must be between 400 and 599 \u2014 ${status} is invalid`);
  }
  throw new HttpError(status, body2);
}
__name(error32, "error3");
__name2(error32, "error");
function json(data, init2) {
  const body2 = JSON.stringify(data);
  const headers2 = new Headers(init2?.headers);
  if (!headers2.has("content-length")) {
    headers2.set("content-length", text_encoder.encode(body2).byteLength.toString());
  }
  if (!headers2.has("content-type")) {
    headers2.set("content-type", "application/json");
  }
  return new Response(body2, {
    ...init2,
    headers: headers2
  });
}
__name(json, "json");
__name2(json, "json");
function text(body2, init2) {
  const headers2 = new Headers(init2?.headers);
  if (!headers2.has("content-length")) {
    const encoded = text_encoder.encode(body2);
    headers2.set("content-length", encoded.byteLength.toString());
    return new Response(encoded, {
      ...init2,
      headers: headers2
    });
  }
  return new Response(body2, {
    ...init2,
    headers: headers2
  });
}
__name(text, "text");
__name2(text, "text");
init_internal();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var sync_store = null;
var als;
import("node:async_hooks").then((hooks) => als = new hooks.AsyncLocalStorage()).catch(() => {
});
function with_request_store(store, fn) {
  try {
    sync_store = store;
    return als ? als.run(store, fn) : fn();
  } finally {
    sync_store = null;
  }
}
__name(with_request_store, "with_request_store");
__name2(with_request_store, "with_request_store");
function merge_tracing(event_like, current) {
  return {
    ...event_like,
    tracing: {
      ...event_like.tracing,
      current
    }
  };
}
__name(merge_tracing, "merge_tracing");
__name2(merge_tracing, "merge_tracing");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var base = "";
var assets = base;
var app_dir = "_app";
var initial = { base, assets };
function override(paths) {
  base = paths.base;
  assets = paths.assets;
}
__name(override, "override");
__name2(override, "override");
function reset() {
  base = initial.base;
  assets = initial.assets;
}
__name(reset, "reset");
__name2(reset, "reset");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var escaped = {
  "<": "\\u003C",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var DevalueError = class extends Error {
  static {
    __name(this, "DevalueError");
  }
  static {
    __name2(this, "DevalueError");
  }
  /**
   * @param {string} message
   * @param {string[]} keys
   */
  constructor(message, keys) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
  }
};
function is_primitive(thing) {
  return Object(thing) !== thing;
}
__name(is_primitive, "is_primitive");
__name2(is_primitive, "is_primitive");
var object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(
  Object.prototype
).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
__name(is_plain_object, "is_plain_object");
__name2(is_plain_object, "is_plain_object");
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
__name(get_type, "get_type");
__name2(get_type, "get_type");
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
__name(get_escaped_char, "get_escaped_char");
__name2(get_escaped_char, "get_escaped_char");
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    const char = str[i];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i) + replacement;
      last_pos = i + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
__name(stringify_string, "stringify_string");
__name2(stringify_string, "stringify_string");
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
__name(enumerable_symbols, "enumerable_symbols");
__name2(enumerable_symbols, "enumerable_symbols");
var is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function stringify_key(key2) {
  return is_identifier.test(key2) ? "." + key2 : "[" + JSON.stringify(key2) + "]";
}
__name(stringify_key, "stringify_key");
__name2(stringify_key, "stringify_key");
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafe_chars = /[<\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
function uneval(value, replacer) {
  const counts = /* @__PURE__ */ new Map();
  const keys = [];
  const custom = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys);
    }
    if (!is_primitive(thing)) {
      if (counts.has(thing)) {
        counts.set(thing, counts.get(thing) + 1);
        return;
      }
      counts.set(thing, 1);
      if (replacer) {
        const str2 = replacer(thing);
        if (typeof str2 === "string") {
          custom.set(thing, str2);
          return;
        }
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "BigInt":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
        case "URL":
        case "URLSearchParams":
          return;
        case "Array":
          thing.forEach((value2, i) => {
            keys.push(`[${i}]`);
            walk(value2);
            keys.pop();
          });
          break;
        case "Set":
          Array.from(thing).forEach(walk);
          break;
        case "Map":
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive(key2) : "..."})`
            );
            walk(value2);
            keys.pop();
          }
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array":
          walk(thing.buffer);
          return;
        case "ArrayBuffer":
          return;
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          return;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys
            );
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys
            );
          }
          for (const key2 in thing) {
            keys.push(stringify_key(key2));
            walk(thing[key2]);
            keys.pop();
          }
      }
    }
  }
  __name(walk, "walk");
  __name2(walk, "walk");
  walk(value);
  const names = /* @__PURE__ */ new Map();
  Array.from(counts).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i) => {
    names.set(entry[0], get_name(i));
  });
  function stringify3(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (is_primitive(thing)) {
      return stringify_primitive(thing);
    }
    if (custom.has(thing)) {
      return custom.get(thing);
    }
    const type = get_type(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return `Object(${stringify3(thing.valueOf())})`;
      case "RegExp":
        return `new RegExp(${stringify_string(thing.source)}, "${thing.flags}")`;
      case "Date":
        return `new Date(${thing.getTime()})`;
      case "URL":
        return `new URL(${stringify_string(thing.toString())})`;
      case "URLSearchParams":
        return `new URLSearchParams(${stringify_string(thing.toString())})`;
      case "Array":
        const members = (
          /** @type {any[]} */
          thing.map(
            (v, i) => i in thing ? stringify3(v) : ""
          )
        );
        const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return `[${members.join(",")}${tail}]`;
      case "Set":
      case "Map":
        return `new ${type}([${Array.from(thing).map(stringify3).join(",")}])`;
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "BigInt64Array":
      case "BigUint64Array": {
        let str2 = `new ${type}`;
        if (counts.get(thing.buffer) === 1) {
          const array2 = new thing.constructor(thing.buffer);
          str2 += `([${array2}])`;
        } else {
          str2 += `([${stringify3(thing.buffer)}])`;
        }
        const a = thing.byteOffset;
        const b = a + thing.byteLength;
        if (a > 0 || b !== thing.buffer.byteLength) {
          const m = +/(\d+)/.exec(type)[1] / 8;
          str2 += `.subarray(${a / m},${b / m})`;
        }
        return str2;
      }
      case "ArrayBuffer": {
        const ui8 = new Uint8Array(thing);
        return `new Uint8Array([${ui8.toString()}]).buffer`;
      }
      case "Temporal.Duration":
      case "Temporal.Instant":
      case "Temporal.PlainDate":
      case "Temporal.PlainTime":
      case "Temporal.PlainDateTime":
      case "Temporal.PlainMonthDay":
      case "Temporal.PlainYearMonth":
      case "Temporal.ZonedDateTime":
        return `${type}.from(${stringify_string(thing.toString())})`;
      default:
        const obj = `{${Object.keys(thing).map((key2) => `${safe_key(key2)}:${stringify3(thing[key2])}`).join(",")}}`;
        const proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? `Object.assign(Object.create(null),${obj})` : `Object.create(null)`;
        }
        return obj;
    }
  }
  __name(stringify3, "stringify3");
  __name2(stringify3, "stringify");
  const str = stringify3(value);
  if (names.size) {
    const params = [];
    const statements = [];
    const values = [];
    names.forEach((name, thing) => {
      params.push(name);
      if (custom.has(thing)) {
        values.push(
          /** @type {string} */
          custom.get(thing)
        );
        return;
      }
      if (is_primitive(thing)) {
        values.push(stringify_primitive(thing));
        return;
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values.push(`Object(${stringify3(thing.valueOf())})`);
          break;
        case "RegExp":
          values.push(thing.toString());
          break;
        case "Date":
          values.push(`new Date(${thing.getTime()})`);
          break;
        case "Array":
          values.push(`Array(${thing.length})`);
          thing.forEach((v, i) => {
            statements.push(`${name}[${i}]=${stringify3(v)}`);
          });
          break;
        case "Set":
          values.push(`new Set`);
          statements.push(
            `${name}.${Array.from(thing).map((v) => `add(${stringify3(v)})`).join(".")}`
          );
          break;
        case "Map":
          values.push(`new Map`);
          statements.push(
            `${name}.${Array.from(thing).map(([k, v]) => `set(${stringify3(k)}, ${stringify3(v)})`).join(".")}`
          );
          break;
        case "ArrayBuffer":
          values.push(
            `new Uint8Array([${new Uint8Array(thing).join(",")}]).buffer`
          );
          break;
        default:
          values.push(
            Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}"
          );
          Object.keys(thing).forEach((key2) => {
            statements.push(
              `${name}${safe_prop(key2)}=${stringify3(thing[key2])}`
            );
          });
      }
    });
    statements.push(`return ${str}`);
    return `(function(${params.join(",")}){${statements.join(
      ";"
    )}}(${values.join(",")}))`;
  } else {
    return str;
  }
}
__name(uneval, "uneval");
__name2(uneval, "uneval");
function get_name(num) {
  let name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? `${name}0` : name;
}
__name(get_name, "get_name");
__name2(get_name, "get_name");
function escape_unsafe_char(c2) {
  return escaped[c2] || c2;
}
__name(escape_unsafe_char, "escape_unsafe_char");
__name2(escape_unsafe_char, "escape_unsafe_char");
function escape_unsafe_chars(str) {
  return str.replace(unsafe_chars, escape_unsafe_char);
}
__name(escape_unsafe_chars, "escape_unsafe_chars");
__name2(escape_unsafe_chars, "escape_unsafe_chars");
function safe_key(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escape_unsafe_chars(JSON.stringify(key2));
}
__name(safe_key, "safe_key");
__name2(safe_key, "safe_key");
function safe_prop(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? `.${key2}` : `[${escape_unsafe_chars(JSON.stringify(key2))}]`;
}
__name(safe_prop, "safe_prop");
__name2(safe_prop, "safe_prop");
function stringify_primitive(thing) {
  if (typeof thing === "string") return stringify_string(thing);
  if (thing === void 0) return "void 0";
  if (thing === 0 && 1 / thing < 0) return "-0";
  const str = String(thing);
  if (typeof thing === "number") return str.replace(/^(-)?0\./, "$1.");
  if (typeof thing === "bigint") return thing + "n";
  return str;
}
__name(stringify_primitive, "stringify_primitive");
__name2(stringify_primitive, "stringify_primitive");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function encode64(arraybuffer) {
  const dv = new DataView(arraybuffer);
  let binaryString = "";
  for (let i = 0; i < arraybuffer.byteLength; i++) {
    binaryString += String.fromCharCode(dv.getUint8(i));
  }
  return binaryToAscii(binaryString);
}
__name(encode64, "encode64");
__name2(encode64, "encode64");
function decode64(string) {
  const binaryString = asciiToBinary(string);
  const arraybuffer = new ArrayBuffer(binaryString.length);
  const dv = new DataView(arraybuffer);
  for (let i = 0; i < arraybuffer.byteLength; i++) {
    dv.setUint8(i, binaryString.charCodeAt(i));
  }
  return arraybuffer;
}
__name(decode64, "decode64");
__name2(decode64, "decode64");
var KEY_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function asciiToBinary(data) {
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, "");
  }
  let output = "";
  let buffer = 0;
  let accumulatedBits = 0;
  for (let i = 0; i < data.length; i++) {
    buffer <<= 6;
    buffer |= KEY_STRING.indexOf(data[i]);
    accumulatedBits += 6;
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 16711680) >> 16);
      output += String.fromCharCode((buffer & 65280) >> 8);
      output += String.fromCharCode(buffer & 255);
      buffer = accumulatedBits = 0;
    }
  }
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 65280) >> 8);
    output += String.fromCharCode(buffer & 255);
  }
  return output;
}
__name(asciiToBinary, "asciiToBinary");
__name2(asciiToBinary, "asciiToBinary");
function binaryToAscii(str) {
  let out = "";
  for (let i = 0; i < str.length; i += 3) {
    const groupsOfSix = [void 0, void 0, void 0, void 0];
    groupsOfSix[0] = str.charCodeAt(i) >> 2;
    groupsOfSix[1] = (str.charCodeAt(i) & 3) << 4;
    if (str.length > i + 1) {
      groupsOfSix[1] |= str.charCodeAt(i + 1) >> 4;
      groupsOfSix[2] = (str.charCodeAt(i + 1) & 15) << 2;
    }
    if (str.length > i + 2) {
      groupsOfSix[2] |= str.charCodeAt(i + 2) >> 6;
      groupsOfSix[3] = str.charCodeAt(i + 2) & 63;
    }
    for (let j = 0; j < groupsOfSix.length; j++) {
      if (typeof groupsOfSix[j] === "undefined") {
        out += "=";
      } else {
        out += KEY_STRING[groupsOfSix[j]];
      }
    }
  }
  return out;
}
__name(binaryToAscii, "binaryToAscii");
__name2(binaryToAscii, "binaryToAscii");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var UNDEFINED = -1;
var HOLE = -2;
var NAN = -3;
var POSITIVE_INFINITY = -4;
var NEGATIVE_INFINITY = -5;
var NEGATIVE_ZERO = -6;
function parse(serialized, revivers) {
  return unflatten(JSON.parse(serialized), revivers);
}
__name(parse, "parse");
__name2(parse, "parse");
function unflatten(parsed, revivers) {
  if (typeof parsed === "number") return hydrate2(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  function hydrate2(index4, standalone = false) {
    if (index4 === UNDEFINED) return void 0;
    if (index4 === NAN) return NaN;
    if (index4 === POSITIVE_INFINITY) return Infinity;
    if (index4 === NEGATIVE_INFINITY) return -Infinity;
    if (index4 === NEGATIVE_ZERO) return -0;
    if (standalone || typeof index4 !== "number") {
      throw new Error(`Invalid input`);
    }
    if (index4 in hydrated) return hydrated[index4];
    const value = values[index4];
    if (!value || typeof value !== "object") {
      hydrated[index4] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers?.[type];
        if (reviver) {
          return hydrated[index4] = reviver(hydrate2(value[1]));
        }
        switch (type) {
          case "Date":
            hydrated[index4] = new Date(value[1]);
            break;
          case "Set":
            const set2 = /* @__PURE__ */ new Set();
            hydrated[index4] = set2;
            for (let i = 1; i < value.length; i += 1) {
              set2.add(hydrate2(value[i]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index4] = map;
            for (let i = 1; i < value.length; i += 2) {
              map.set(hydrate2(value[i]), hydrate2(value[i + 1]));
            }
            break;
          case "RegExp":
            hydrated[index4] = new RegExp(value[1], value[2]);
            break;
          case "Object":
            hydrated[index4] = Object(value[1]);
            break;
          case "BigInt":
            hydrated[index4] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index4] = obj;
            for (let i = 1; i < value.length; i += 2) {
              obj[value[i]] = hydrate2(value[i + 1]);
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array": {
            const TypedArrayConstructor = globalThis[type];
            const typedArray = new TypedArrayConstructor(hydrate2(value[1]));
            hydrated[index4] = value[2] !== void 0 ? typedArray.subarray(value[2], value[3]) : typedArray;
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            const arraybuffer = decode64(base64);
            hydrated[index4] = arraybuffer;
            break;
          }
          case "Temporal.Duration":
          case "Temporal.Instant":
          case "Temporal.PlainDate":
          case "Temporal.PlainTime":
          case "Temporal.PlainDateTime":
          case "Temporal.PlainMonthDay":
          case "Temporal.PlainYearMonth":
          case "Temporal.ZonedDateTime": {
            const temporalName = type.slice(9);
            hydrated[index4] = Temporal[temporalName].from(value[1]);
            break;
          }
          case "URL": {
            const url = new URL(value[1]);
            hydrated[index4] = url;
            break;
          }
          case "URLSearchParams": {
            const url = new URLSearchParams(value[1]);
            hydrated[index4] = url;
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else {
        const array2 = new Array(value.length);
        hydrated[index4] = array2;
        for (let i = 0; i < value.length; i += 1) {
          const n2 = value[i];
          if (n2 === HOLE) continue;
          array2[i] = hydrate2(n2);
        }
      }
    } else {
      const object = {};
      hydrated[index4] = object;
      for (const key2 in value) {
        if (key2 === "__proto__") {
          throw new Error("Cannot parse an object with a `__proto__` property");
        }
        const n2 = value[key2];
        object[key2] = hydrate2(n2);
      }
    }
    return hydrated[index4];
  }
  __name(hydrate2, "hydrate2");
  __name2(hydrate2, "hydrate");
  return hydrate2(0);
}
__name(unflatten, "unflatten");
__name2(unflatten, "unflatten");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function stringify(value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  if (reducers) {
    for (const key2 of Object.getOwnPropertyNames(reducers)) {
      custom.push({ key: key2, fn: reducers[key2] });
    }
  }
  const keys = [];
  let p = 0;
  function flatten(thing) {
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys);
    }
    if (thing === void 0) return UNDEFINED;
    if (Number.isNaN(thing)) return NAN;
    if (thing === Infinity) return POSITIVE_INFINITY;
    if (thing === -Infinity) return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO;
    if (indexes.has(thing)) return indexes.get(thing);
    const index5 = p++;
    indexes.set(thing, index5);
    for (const { key: key2, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index5] = `["${key2}",${flatten(value2)}]`;
        return index5;
      }
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive2(thing);
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          str = `["Object",${stringify_primitive2(thing)}]`;
          break;
        case "BigInt":
          str = `["BigInt",${thing}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "URL":
          str = `["URL",${stringify_string(thing.toString())}]`;
          break;
        case "URLSearchParams":
          str = `["URLSearchParams",${stringify_string(thing.toString())}]`;
          break;
        case "RegExp":
          const { source: source2, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source2)},"${flags}"]` : `["RegExp",${stringify_string(source2)}]`;
          break;
        case "Array":
          str = "[";
          for (let i = 0; i < thing.length; i += 1) {
            if (i > 0) str += ",";
            if (i in thing) {
              keys.push(`[${i}]`);
              str += flatten(thing[i]);
              keys.pop();
            } else {
              str += HOLE;
            }
          }
          str += "]";
          break;
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive2(key2) : "..."})`
            );
            str += `,${flatten(key2)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array": {
          const typedArray = thing;
          str = '["' + type + '",' + flatten(typedArray.buffer);
          const a = thing.byteOffset;
          const b = a + thing.byteLength;
          if (a > 0 || b !== typedArray.buffer.byteLength) {
            const m = +/(\d+)/.exec(type)[1] / 8;
            str += `,${a / m},${b / m}`;
          }
          str += "]";
          break;
        }
        case "ArrayBuffer": {
          const arraybuffer = thing;
          const base64 = encode64(arraybuffer);
          str = `["ArrayBuffer","${base64}"]`;
          break;
        }
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          str = `["${type}",${stringify_string(thing.toString())}]`;
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys
            );
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys
            );
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key2 in thing) {
              keys.push(stringify_key(key2));
              str += `,${stringify_string(key2)},${flatten(thing[key2])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key2 in thing) {
              if (started) str += ",";
              started = true;
              keys.push(stringify_key(key2));
              str += `${stringify_string(key2)}:${flatten(thing[key2])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index5] = str;
    return index5;
  }
  __name(flatten, "flatten");
  __name2(flatten, "flatten");
  const index4 = flatten(value);
  if (index4 < 0) return `${index4}`;
  return `[${stringified.join(",")}]`;
}
__name(stringify, "stringify");
__name2(stringify, "stringify");
function stringify_primitive2(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing instanceof String) return stringify_string(thing.toString());
  if (thing === void 0) return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}
__name(stringify_primitive2, "stringify_primitive2");
__name2(stringify_primitive2, "stringify_primitive");
init_exports();
init_utils2();
init_chunks();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_index2();
init_false();
init_utils22();
init_equality();
init_clsx();
var public_env = {};
function set_private_env(environment) {
}
__name(set_private_env, "set_private_env");
__name2(set_private_env, "set_private_env");
function set_public_env(environment) {
  public_env = environment;
}
__name(set_public_env, "set_public_env");
__name2(set_public_env, "set_public_env");
function effect_update_depth_exceeded() {
  {
    throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
  }
}
__name(effect_update_depth_exceeded, "effect_update_depth_exceeded");
__name2(effect_update_depth_exceeded, "effect_update_depth_exceeded");
function hydration_failed() {
  {
    throw new Error(`https://svelte.dev/e/hydration_failed`);
  }
}
__name(hydration_failed, "hydration_failed");
__name2(hydration_failed, "hydration_failed");
function state_descriptors_fixed() {
  {
    throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
  }
}
__name(state_descriptors_fixed, "state_descriptors_fixed");
__name2(state_descriptors_fixed, "state_descriptors_fixed");
function state_prototype_fixed() {
  {
    throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
  }
}
__name(state_prototype_fixed, "state_prototype_fixed");
__name2(state_prototype_fixed, "state_prototype_fixed");
function state_unsafe_mutation() {
  {
    throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
  }
}
__name(state_unsafe_mutation, "state_unsafe_mutation");
__name2(state_unsafe_mutation, "state_unsafe_mutation");
function hydration_mismatch(location) {
  {
    console.warn(`https://svelte.dev/e/hydration_mismatch`);
  }
}
__name(hydration_mismatch, "hydration_mismatch");
__name2(hydration_mismatch, "hydration_mismatch");
var hydrating = false;
function set_hydrating(value) {
  hydrating = value;
}
__name(set_hydrating, "set_hydrating");
__name2(set_hydrating, "set_hydrating");
var hydrate_node;
function set_hydrate_node(node) {
  if (node === null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return hydrate_node = node;
}
__name(set_hydrate_node, "set_hydrate_node");
__name2(set_hydrate_node, "set_hydrate_node");
function hydrate_next() {
  return set_hydrate_node(
    /** @type {TemplateNode} */
    /* @__PURE__ */ get_next_sibling(hydrate_node)
  );
}
__name(hydrate_next, "hydrate_next");
__name2(hydrate_next, "hydrate_next");
var tracing_mode_flag = false;
var component_context = null;
function set_component_context(context3) {
  component_context = context3;
}
__name(set_component_context, "set_component_context");
__name2(set_component_context, "set_component_context");
function push2(props, runes = false, fn) {
  component_context = {
    p: component_context,
    c: null,
    e: null,
    s: props,
    x: null,
    l: null
  };
}
__name(push2, "push2");
__name2(push2, "push");
function pop2(component4) {
  var context3 = (
    /** @type {ComponentContext} */
    component_context
  );
  var effects = context3.e;
  if (effects !== null) {
    context3.e = null;
    for (var fn of effects) {
      create_user_effect(fn);
    }
  }
  component_context = context3.p;
  return (
    /** @type {T} */
    {}
  );
}
__name(pop2, "pop2");
__name2(pop2, "pop");
function is_runes() {
  return true;
}
__name(is_runes, "is_runes");
__name2(is_runes, "is_runes");
var adjustments = /* @__PURE__ */ new WeakMap();
function handle_error(error4) {
  var effect = active_effect;
  if (effect === null) {
    active_reaction.f |= ERROR_VALUE;
    return error4;
  }
  if ((effect.f & EFFECT_RAN) === 0) {
    if ((effect.f & BOUNDARY_EFFECT) === 0) {
      if (!effect.parent && error4 instanceof Error) {
        apply_adjustments(error4);
      }
      throw error4;
    }
    effect.b.error(error4);
  } else {
    invoke_error_boundary(error4, effect);
  }
}
__name(handle_error, "handle_error");
__name2(handle_error, "handle_error");
function invoke_error_boundary(error4, effect) {
  while (effect !== null) {
    if ((effect.f & BOUNDARY_EFFECT) !== 0) {
      try {
        effect.b.error(error4);
        return;
      } catch (e3) {
        error4 = e3;
      }
    }
    effect = effect.parent;
  }
  if (error4 instanceof Error) {
    apply_adjustments(error4);
  }
  throw error4;
}
__name(invoke_error_boundary, "invoke_error_boundary");
__name2(invoke_error_boundary, "invoke_error_boundary");
function apply_adjustments(error4) {
  const adjusted = adjustments.get(error4);
  if (adjusted) {
    define_property(error4, "message", {
      value: adjusted.message
    });
    define_property(error4, "stack", {
      value: adjusted.stack
    });
  }
}
__name(apply_adjustments, "apply_adjustments");
__name2(apply_adjustments, "apply_adjustments");
var micro_tasks = [];
var idle_tasks = [];
function run_micro_tasks() {
  var tasks2 = micro_tasks;
  micro_tasks = [];
  run_all(tasks2);
}
__name(run_micro_tasks, "run_micro_tasks");
__name2(run_micro_tasks, "run_micro_tasks");
function run_idle_tasks() {
  var tasks2 = idle_tasks;
  idle_tasks = [];
  run_all(tasks2);
}
__name(run_idle_tasks, "run_idle_tasks");
__name2(run_idle_tasks, "run_idle_tasks");
function flush_tasks() {
  if (micro_tasks.length > 0) {
    run_micro_tasks();
  }
  if (idle_tasks.length > 0) {
    run_idle_tasks();
  }
}
__name(flush_tasks, "flush_tasks");
__name2(flush_tasks, "flush_tasks");
function destroy_derived_effects(derived) {
  var effects = derived.effects;
  if (effects !== null) {
    derived.effects = null;
    for (var i = 0; i < effects.length; i += 1) {
      destroy_effect(
        /** @type {Effect} */
        effects[i]
      );
    }
  }
}
__name(destroy_derived_effects, "destroy_derived_effects");
__name2(destroy_derived_effects, "destroy_derived_effects");
function get_derived_parent_effect(derived) {
  var parent = derived.parent;
  while (parent !== null) {
    if ((parent.f & DERIVED) === 0) {
      return (
        /** @type {Effect} */
        parent
      );
    }
    parent = parent.parent;
  }
  return null;
}
__name(get_derived_parent_effect, "get_derived_parent_effect");
__name2(get_derived_parent_effect, "get_derived_parent_effect");
function execute_derived(derived) {
  var value;
  var prev_active_effect = active_effect;
  set_active_effect(get_derived_parent_effect(derived));
  {
    try {
      destroy_derived_effects(derived);
      value = update_reaction(derived);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
__name(execute_derived, "execute_derived");
__name2(execute_derived, "execute_derived");
function update_derived(derived) {
  var value = execute_derived(derived);
  if (!derived.equals(value)) {
    derived.v = value;
    derived.wv = increment_write_version();
  }
  if (is_destroying_effect) {
    return;
  }
  {
    var status = (skip_reaction || (derived.f & UNOWNED) !== 0) && derived.deps !== null ? MAYBE_DIRTY : CLEAN;
    set_signal_status(derived, status);
  }
}
__name(update_derived, "update_derived");
__name2(update_derived, "update_derived");
var batches = /* @__PURE__ */ new Set();
var current_batch = null;
var effect_pending_updates = /* @__PURE__ */ new Set();
var tasks = [];
function dequeue() {
  const task = (
    /** @type {() => void} */
    tasks.shift()
  );
  if (tasks.length > 0) {
    queueMicrotask(dequeue);
  }
  task();
}
__name(dequeue, "dequeue");
__name2(dequeue, "dequeue");
var queued_root_effects = [];
var last_scheduled_effect = null;
var is_flushing = false;
var is_flushing_sync = false;
var Batch = class _Batch {
  static {
    __name(this, "_Batch");
  }
  static {
    __name2(this, "Batch");
  }
  /**
   * The current values of any sources that are updated in this batch
   * They keys of this map are identical to `this.#previous`
   * @type {Map<Source, any>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values of any sources that are updated in this batch _before_ those updates took place.
   * They keys of this map are identical to `this.#current`
   * @type {Map<Source, any>}
   */
  #previous = /* @__PURE__ */ new Map();
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks
   * @type {Set<() => void>}
   */
  #callbacks = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #pending = 0;
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #deferred = null;
  /**
   * True if an async effect inside this batch resolved and
   * its parent branch was already deleted
   */
  #neutered = false;
  /**
   * Async effects (created inside `async_derived`) encountered during processing.
   * These run after the rest of the batch has updated, since they should
   * always have the latest values
   * @type {Effect[]}
   */
  #async_effects = [];
  /**
   * The same as `#async_effects`, but for effects inside a newly-created
   * `<svelte:boundary>` — these do not prevent the batch from committing
   * @type {Effect[]}
   */
  #boundary_async_effects = [];
  /**
   * Template effects and `$effect.pre` effects, which run when
   * a batch is committed
   * @type {Effect[]}
   */
  #render_effects = [];
  /**
   * The same as `#render_effects`, but for `$effect` (which runs after)
   * @type {Effect[]}
   */
  #effects = [];
  /**
   * Block effects, which may need to re-run on subsequent flushes
   * in order to update internal sources (e.g. each block items)
   * @type {Effect[]}
   */
  #block_effects = [];
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Effect[]}
   */
  #dirty_effects = [];
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Effect[]}
   */
  #maybe_dirty_effects = [];
  /**
   * A set of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`
   * @type {Set<Effect>}
   */
  skipped_effects = /* @__PURE__ */ new Set();
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(root_effects) {
    queued_root_effects = [];
    for (const root2 of root_effects) {
      this.#traverse_effect_tree(root2);
    }
    if (this.#async_effects.length === 0 && this.#pending === 0) {
      this.#commit();
      var render_effects = this.#render_effects;
      var effects = this.#effects;
      this.#render_effects = [];
      this.#effects = [];
      this.#block_effects = [];
      current_batch = null;
      flush_queued_effects(render_effects);
      flush_queued_effects(effects);
      if (current_batch === null) {
        current_batch = this;
      } else {
        batches.delete(this);
      }
      this.#deferred?.resolve();
    } else {
      this.#defer_effects(this.#render_effects);
      this.#defer_effects(this.#effects);
      this.#defer_effects(this.#block_effects);
    }
    for (const effect of this.#async_effects) {
      update_effect(effect);
    }
    for (const effect of this.#boundary_async_effects) {
      update_effect(effect);
    }
    this.#async_effects = [];
    this.#boundary_async_effects = [];
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   */
  #traverse_effect_tree(root2) {
    root2.f ^= CLEAN;
    var effect = root2.first;
    while (effect !== null) {
      var flags = effect.f;
      var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
      var skip = is_skippable_branch || (flags & INERT) !== 0 || this.skipped_effects.has(effect);
      if (!skip && effect.fn !== null) {
        if (is_branch) {
          effect.f ^= CLEAN;
        } else if ((flags & EFFECT) !== 0) {
          this.#effects.push(effect);
        } else if ((flags & CLEAN) === 0) {
          if ((flags & ASYNC) !== 0) {
            var effects = effect.b?.is_pending() ? this.#boundary_async_effects : this.#async_effects;
            effects.push(effect);
          } else if (is_dirty(effect)) {
            if ((effect.f & BLOCK_EFFECT) !== 0) this.#block_effects.push(effect);
            update_effect(effect);
          }
        }
        var child = effect.first;
        if (child !== null) {
          effect = child;
          continue;
        }
      }
      var parent = effect.parent;
      effect = effect.next;
      while (effect === null && parent !== null) {
        effect = parent.next;
        parent = parent.parent;
      }
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #defer_effects(effects) {
    for (const e3 of effects) {
      const target = (e3.f & DIRTY) !== 0 ? this.#dirty_effects : this.#maybe_dirty_effects;
      target.push(e3);
      set_signal_status(e3, CLEAN);
    }
    effects.length = 0;
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Source} source
   * @param {any} value
   */
  capture(source2, value) {
    if (!this.#previous.has(source2)) {
      this.#previous.set(source2, value);
    }
    this.current.set(source2, source2.v);
  }
  activate() {
    current_batch = this;
  }
  deactivate() {
    current_batch = null;
    for (const update of effect_pending_updates) {
      effect_pending_updates.delete(update);
      update();
      if (current_batch !== null) {
        break;
      }
    }
  }
  neuter() {
    this.#neutered = true;
  }
  flush() {
    if (queued_root_effects.length > 0) {
      flush_effects();
    } else {
      this.#commit();
    }
    if (current_batch !== this) {
      return;
    }
    if (this.#pending === 0) {
      batches.delete(this);
    }
    this.deactivate();
  }
  /**
   * Append and remove branches to/from the DOM
   */
  #commit() {
    if (!this.#neutered) {
      for (const fn of this.#callbacks) {
        fn();
      }
    }
    this.#callbacks.clear();
  }
  increment() {
    this.#pending += 1;
  }
  decrement() {
    this.#pending -= 1;
    if (this.#pending === 0) {
      for (const e3 of this.#dirty_effects) {
        set_signal_status(e3, DIRTY);
        schedule_effect(e3);
      }
      for (const e3 of this.#maybe_dirty_effects) {
        set_signal_status(e3, MAYBE_DIRTY);
        schedule_effect(e3);
      }
      this.#render_effects = [];
      this.#effects = [];
      this.flush();
    } else {
      this.deactivate();
    }
  }
  /** @param {() => void} fn */
  add_callback(fn) {
    this.#callbacks.add(fn);
  }
  settled() {
    return (this.#deferred ??= deferred()).promise;
  }
  static ensure() {
    if (current_batch === null) {
      const batch = current_batch = new _Batch();
      batches.add(current_batch);
      if (!is_flushing_sync) {
        _Batch.enqueue(() => {
          if (current_batch !== batch) {
            return;
          }
          batch.flush();
        });
      }
    }
    return current_batch;
  }
  /** @param {() => void} task */
  static enqueue(task) {
    if (tasks.length === 0) {
      queueMicrotask(dequeue);
    }
    tasks.unshift(task);
  }
};
function flushSync(fn) {
  var was_flushing_sync = is_flushing_sync;
  is_flushing_sync = true;
  try {
    var result;
    if (fn) ;
    while (true) {
      flush_tasks();
      if (queued_root_effects.length === 0) {
        current_batch?.flush();
        if (queued_root_effects.length === 0) {
          last_scheduled_effect = null;
          return (
            /** @type {T} */
            result
          );
        }
      }
      flush_effects();
    }
  } finally {
    is_flushing_sync = was_flushing_sync;
  }
}
__name(flushSync, "flushSync");
__name2(flushSync, "flushSync");
function flush_effects() {
  var was_updating_effect = is_updating_effect;
  is_flushing = true;
  try {
    var flush_count = 0;
    set_is_updating_effect(true);
    while (queued_root_effects.length > 0) {
      var batch = Batch.ensure();
      if (flush_count++ > 1e3) {
        var updates, entry;
        if (BROWSER) ;
        infinite_loop_guard();
      }
      batch.process(queued_root_effects);
      old_values.clear();
    }
  } finally {
    is_flushing = false;
    set_is_updating_effect(was_updating_effect);
    last_scheduled_effect = null;
  }
}
__name(flush_effects, "flush_effects");
__name2(flush_effects, "flush_effects");
function infinite_loop_guard() {
  try {
    effect_update_depth_exceeded();
  } catch (error4) {
    invoke_error_boundary(error4, last_scheduled_effect);
  }
}
__name(infinite_loop_guard, "infinite_loop_guard");
__name2(infinite_loop_guard, "infinite_loop_guard");
var eager_block_effects = null;
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0) return;
  var i = 0;
  while (i < length) {
    var effect = effects[i++];
    if ((effect.f & (DESTROYED | INERT)) === 0 && is_dirty(effect)) {
      eager_block_effects = [];
      update_effect(effect);
      if (effect.deps === null && effect.first === null && effect.nodes_start === null) {
        if (effect.teardown === null && effect.ac === null) {
          unlink_effect(effect);
        } else {
          effect.fn = null;
        }
      }
      if (eager_block_effects?.length > 0) {
        old_values.clear();
        for (const e3 of eager_block_effects) {
          update_effect(e3);
        }
        eager_block_effects = [];
      }
    }
  }
  eager_block_effects = null;
}
__name(flush_queued_effects, "flush_queued_effects");
__name2(flush_queued_effects, "flush_queued_effects");
function schedule_effect(signal) {
  var effect = last_scheduled_effect = signal;
  while (effect.parent !== null) {
    effect = effect.parent;
    var flags = effect.f;
    if (is_flushing && effect === active_effect && (flags & BLOCK_EFFECT) !== 0) {
      return;
    }
    if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
      if ((flags & CLEAN) === 0) return;
      effect.f ^= CLEAN;
    }
  }
  queued_root_effects.push(effect);
}
__name(schedule_effect, "schedule_effect");
__name2(schedule_effect, "schedule_effect");
var old_values = /* @__PURE__ */ new Map();
function source(v, stack) {
  var signal = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v,
    reactions: null,
    equals,
    rv: 0,
    wv: 0
  };
  return signal;
}
__name(source, "source");
__name2(source, "source");
// @__NO_SIDE_EFFECTS__
function state(v, stack) {
  const s3 = source(v);
  push_reaction_value(s3);
  return s3;
}
__name(state, "state");
__name2(state, "state");
// @__NO_SIDE_EFFECTS__
function mutable_source(initial_value, immutable2 = false, trackable = true) {
  const s3 = source(initial_value);
  if (!immutable2) {
    s3.equals = safe_equals;
  }
  return s3;
}
__name(mutable_source, "mutable_source");
__name2(mutable_source, "mutable_source");
function set(source2, value, should_proxy = false) {
  if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!untracking || (active_reaction.f & INSPECT_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | INSPECT_EFFECT)) !== 0 && !current_sources?.includes(source2)) {
    state_unsafe_mutation();
  }
  let new_value = should_proxy ? proxy(value) : value;
  return internal_set(source2, new_value);
}
__name(set, "set");
__name2(set, "set");
function internal_set(source2, value) {
  if (!source2.equals(value)) {
    var old_value = source2.v;
    if (is_destroying_effect) {
      old_values.set(source2, value);
    } else {
      old_values.set(source2, old_value);
    }
    source2.v = value;
    var batch = Batch.ensure();
    batch.capture(source2, old_value);
    if ((source2.f & DERIVED) !== 0) {
      if ((source2.f & DIRTY) !== 0) {
        execute_derived(
          /** @type {Derived} */
          source2
        );
      }
      set_signal_status(source2, (source2.f & UNOWNED) === 0 ? CLEAN : MAYBE_DIRTY);
    }
    source2.wv = increment_write_version();
    mark_reactions(source2, DIRTY);
    if (active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
      if (untracked_writes === null) {
        set_untracked_writes([source2]);
      } else {
        untracked_writes.push(source2);
      }
    }
  }
  return value;
}
__name(internal_set, "internal_set");
__name2(internal_set, "internal_set");
function increment(source2) {
  set(source2, source2.v + 1);
}
__name(increment, "increment");
__name2(increment, "increment");
function mark_reactions(signal, status) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  var length = reactions.length;
  for (var i = 0; i < length; i++) {
    var reaction = reactions[i];
    var flags = reaction.f;
    var not_dirty = (flags & DIRTY) === 0;
    if (not_dirty) {
      set_signal_status(reaction, status);
    }
    if ((flags & DERIVED) !== 0) {
      mark_reactions(
        /** @type {Derived} */
        reaction,
        MAYBE_DIRTY
      );
    } else if (not_dirty) {
      if ((flags & BLOCK_EFFECT) !== 0) {
        if (eager_block_effects !== null) {
          eager_block_effects.push(
            /** @type {Effect} */
            reaction
          );
        }
      }
      schedule_effect(
        /** @type {Effect} */
        reaction
      );
    }
  }
}
__name(mark_reactions, "mark_reactions");
__name2(mark_reactions, "mark_reactions");
function proxy(value) {
  if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
    return value;
  }
  const prototype = get_prototype_of(value);
  if (prototype !== object_prototype && prototype !== array_prototype) {
    return value;
  }
  var sources = /* @__PURE__ */ new Map();
  var is_proxied_array = is_array(value);
  var version22 = /* @__PURE__ */ state(0);
  var parent_version = update_version;
  var with_parent = /* @__PURE__ */ __name2((fn) => {
    if (update_version === parent_version) {
      return fn();
    }
    var reaction = active_reaction;
    var version222 = update_version;
    set_active_reaction(null);
    set_update_version(parent_version);
    var result = fn();
    set_active_reaction(reaction);
    set_update_version(version222);
    return result;
  }, "with_parent");
  if (is_proxied_array) {
    sources.set("length", /* @__PURE__ */ state(
      /** @type {any[]} */
      value.length
    ));
  }
  return new Proxy(
    /** @type {any} */
    value,
    {
      defineProperty(_, prop, descriptor) {
        if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
          state_descriptors_fixed();
        }
        var s3 = sources.get(prop);
        if (s3 === void 0) {
          s3 = with_parent(() => {
            var s22 = /* @__PURE__ */ state(descriptor.value);
            sources.set(prop, s22);
            return s22;
          });
        } else {
          set(s3, descriptor.value, true);
        }
        return true;
      },
      deleteProperty(target, prop) {
        var s3 = sources.get(prop);
        if (s3 === void 0) {
          if (prop in target) {
            const s22 = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
            sources.set(prop, s22);
            increment(version22);
          }
        } else {
          set(s3, UNINITIALIZED);
          increment(version22);
        }
        return true;
      },
      get(target, prop, receiver) {
        if (prop === STATE_SYMBOL) {
          return value;
        }
        var s3 = sources.get(prop);
        var exists = prop in target;
        if (s3 === void 0 && (!exists || get_descriptor(target, prop)?.writable)) {
          s3 = with_parent(() => {
            var p = proxy(exists ? target[prop] : UNINITIALIZED);
            var s22 = /* @__PURE__ */ state(p);
            return s22;
          });
          sources.set(prop, s3);
        }
        if (s3 !== void 0) {
          var v = get(s3);
          return v === UNINITIALIZED ? void 0 : v;
        }
        return Reflect.get(target, prop, receiver);
      },
      getOwnPropertyDescriptor(target, prop) {
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
        if (descriptor && "value" in descriptor) {
          var s3 = sources.get(prop);
          if (s3) descriptor.value = get(s3);
        } else if (descriptor === void 0) {
          var source2 = sources.get(prop);
          var value2 = source2?.v;
          if (source2 !== void 0 && value2 !== UNINITIALIZED) {
            return {
              enumerable: true,
              configurable: true,
              value: value2,
              writable: true
            };
          }
        }
        return descriptor;
      },
      has(target, prop) {
        if (prop === STATE_SYMBOL) {
          return true;
        }
        var s3 = sources.get(prop);
        var has = s3 !== void 0 && s3.v !== UNINITIALIZED || Reflect.has(target, prop);
        if (s3 !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop)?.writable)) {
          if (s3 === void 0) {
            s3 = with_parent(() => {
              var p = has ? proxy(target[prop]) : UNINITIALIZED;
              var s22 = /* @__PURE__ */ state(p);
              return s22;
            });
            sources.set(prop, s3);
          }
          var value2 = get(s3);
          if (value2 === UNINITIALIZED) {
            return false;
          }
        }
        return has;
      },
      set(target, prop, value2, receiver) {
        var s3 = sources.get(prop);
        var has = prop in target;
        if (is_proxied_array && prop === "length") {
          for (var i = value2; i < /** @type {Source<number>} */
          s3.v; i += 1) {
            var other_s = sources.get(i + "");
            if (other_s !== void 0) {
              set(other_s, UNINITIALIZED);
            } else if (i in target) {
              other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
              sources.set(i + "", other_s);
            }
          }
        }
        if (s3 === void 0) {
          if (!has || get_descriptor(target, prop)?.writable) {
            s3 = with_parent(() => /* @__PURE__ */ state(void 0));
            set(s3, proxy(value2));
            sources.set(prop, s3);
          }
        } else {
          has = s3.v !== UNINITIALIZED;
          var p = with_parent(() => proxy(value2));
          set(s3, p);
        }
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
        if (descriptor?.set) {
          descriptor.set.call(receiver, value2);
        }
        if (!has) {
          if (is_proxied_array && typeof prop === "string") {
            var ls = (
              /** @type {Source<number>} */
              sources.get("length")
            );
            var n2 = Number(prop);
            if (Number.isInteger(n2) && n2 >= ls.v) {
              set(ls, n2 + 1);
            }
          }
          increment(version22);
        }
        return true;
      },
      ownKeys(target) {
        get(version22);
        var own_keys = Reflect.ownKeys(target).filter((key22) => {
          var source3 = sources.get(key22);
          return source3 === void 0 || source3.v !== UNINITIALIZED;
        });
        for (var [key2, source2] of sources) {
          if (source2.v !== UNINITIALIZED && !(key2 in target)) {
            own_keys.push(key2);
          }
        }
        return own_keys;
      },
      setPrototypeOf() {
        state_prototype_fixed();
      }
    }
  );
}
__name(proxy, "proxy");
__name2(proxy, "proxy");
var $window;
var first_child_getter;
var next_sibling_getter;
function init_operations() {
  if ($window !== void 0) {
    return;
  }
  $window = window;
  var element_prototype = Element.prototype;
  var node_prototype = Node.prototype;
  var text_prototype = Text.prototype;
  first_child_getter = get_descriptor(node_prototype, "firstChild").get;
  next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
  if (is_extensible(element_prototype)) {
    element_prototype.__click = void 0;
    element_prototype.__className = void 0;
    element_prototype.__attributes = null;
    element_prototype.__style = void 0;
    element_prototype.__e = void 0;
  }
  if (is_extensible(text_prototype)) {
    text_prototype.__t = void 0;
  }
}
__name(init_operations, "init_operations");
__name2(init_operations, "init_operations");
function create_text(value = "") {
  return document.createTextNode(value);
}
__name(create_text, "create_text");
__name2(create_text, "create_text");
// @__NO_SIDE_EFFECTS__
function get_first_child(node) {
  return first_child_getter.call(node);
}
__name(get_first_child, "get_first_child");
__name2(get_first_child, "get_first_child");
// @__NO_SIDE_EFFECTS__
function get_next_sibling(node) {
  return next_sibling_getter.call(node);
}
__name(get_next_sibling, "get_next_sibling");
__name2(get_next_sibling, "get_next_sibling");
function clear_text_content(node) {
  node.textContent = "";
}
__name(clear_text_content, "clear_text_content");
__name2(clear_text_content, "clear_text_content");
function without_reactive_context(fn) {
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    return fn();
  } finally {
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
__name(without_reactive_context, "without_reactive_context");
__name2(without_reactive_context, "without_reactive_context");
function push_effect(effect, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect;
  } else {
    parent_last.next = effect;
    effect.prev = parent_last;
    parent_effect.last = effect;
  }
}
__name(push_effect, "push_effect");
__name2(push_effect, "push_effect");
function create_effect(type, fn, sync, push22 = true) {
  var parent = active_effect;
  if (parent !== null && (parent.f & INERT) !== 0) {
    type |= INERT;
  }
  var effect = {
    ctx: component_context,
    deps: null,
    nodes_start: null,
    nodes_end: null,
    f: type | DIRTY,
    first: null,
    fn,
    last: null,
    next: null,
    parent,
    b: parent && parent.b,
    prev: null,
    teardown: null,
    transitions: null,
    wv: 0,
    ac: null
  };
  if (sync) {
    try {
      update_effect(effect);
      effect.f |= EFFECT_RAN;
    } catch (e22) {
      destroy_effect(effect);
      throw e22;
    }
  } else if (fn !== null) {
    schedule_effect(effect);
  }
  if (push22) {
    var e3 = effect;
    if (sync && e3.deps === null && e3.teardown === null && e3.nodes_start === null && e3.first === e3.last && // either `null`, or a singular child
    (e3.f & EFFECT_PRESERVED) === 0) {
      e3 = e3.first;
    }
    if (e3 !== null) {
      e3.parent = parent;
      if (parent !== null) {
        push_effect(e3, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
        var derived = (
          /** @type {Derived} */
          active_reaction
        );
        (derived.effects ??= []).push(e3);
      }
    }
  }
  return effect;
}
__name(create_effect, "create_effect");
__name2(create_effect, "create_effect");
function create_user_effect(fn) {
  return create_effect(EFFECT | USER_EFFECT, fn, false);
}
__name(create_user_effect, "create_user_effect");
__name2(create_user_effect, "create_user_effect");
function component_root(fn) {
  Batch.ensure();
  const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);
  return (options2 = {}) => {
    return new Promise((fulfil) => {
      if (options2.outro) {
        pause_effect(effect, () => {
          destroy_effect(effect);
          fulfil(void 0);
        });
      } else {
        destroy_effect(effect);
        fulfil(void 0);
      }
    });
  };
}
__name(component_root, "component_root");
__name2(component_root, "component_root");
function branch(fn, push22 = true) {
  return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn, true, push22);
}
__name(branch, "branch");
__name2(branch, "branch");
function execute_effect_teardown(effect) {
  var teardown = effect.teardown;
  if (teardown !== null) {
    const previously_destroying_effect = is_destroying_effect;
    const previous_reaction = active_reaction;
    set_is_destroying_effect(true);
    set_active_reaction(null);
    try {
      teardown.call(null);
    } finally {
      set_is_destroying_effect(previously_destroying_effect);
      set_active_reaction(previous_reaction);
    }
  }
}
__name(execute_effect_teardown, "execute_effect_teardown");
__name2(execute_effect_teardown, "execute_effect_teardown");
function destroy_effect_children(signal, remove_dom = false) {
  var effect = signal.first;
  signal.first = signal.last = null;
  while (effect !== null) {
    const controller2 = effect.ac;
    if (controller2 !== null) {
      without_reactive_context(() => {
        controller2.abort(STALE_REACTION);
      });
    }
    var next = effect.next;
    if ((effect.f & ROOT_EFFECT) !== 0) {
      effect.parent = null;
    } else {
      destroy_effect(effect, remove_dom);
    }
    effect = next;
  }
}
__name(destroy_effect_children, "destroy_effect_children");
__name2(destroy_effect_children, "destroy_effect_children");
function destroy_block_effect_children(signal) {
  var effect = signal.first;
  while (effect !== null) {
    var next = effect.next;
    if ((effect.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect);
    }
    effect = next;
  }
}
__name(destroy_block_effect_children, "destroy_block_effect_children");
__name2(destroy_block_effect_children, "destroy_block_effect_children");
function destroy_effect(effect, remove_dom = true) {
  var removed = false;
  if ((remove_dom || (effect.f & HEAD_EFFECT) !== 0) && effect.nodes_start !== null && effect.nodes_end !== null) {
    remove_effect_dom(
      effect.nodes_start,
      /** @type {TemplateNode} */
      effect.nodes_end
    );
    removed = true;
  }
  destroy_effect_children(effect, remove_dom && !removed);
  remove_reactions(effect, 0);
  set_signal_status(effect, DESTROYED);
  var transitions = effect.transitions;
  if (transitions !== null) {
    for (const transition of transitions) {
      transition.stop();
    }
  }
  execute_effect_teardown(effect);
  var parent = effect.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect);
  }
  effect.next = effect.prev = effect.teardown = effect.ctx = effect.deps = effect.fn = effect.nodes_start = effect.nodes_end = effect.ac = null;
}
__name(destroy_effect, "destroy_effect");
__name2(destroy_effect, "destroy_effect");
function remove_effect_dom(node, end) {
  while (node !== null) {
    var next = node === end ? null : (
      /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(node)
    );
    node.remove();
    node = next;
  }
}
__name(remove_effect_dom, "remove_effect_dom");
__name2(remove_effect_dom, "remove_effect_dom");
function unlink_effect(effect) {
  var parent = effect.parent;
  var prev = effect.prev;
  var next = effect.next;
  if (prev !== null) prev.next = next;
  if (next !== null) next.prev = prev;
  if (parent !== null) {
    if (parent.first === effect) parent.first = next;
    if (parent.last === effect) parent.last = prev;
  }
}
__name(unlink_effect, "unlink_effect");
__name2(unlink_effect, "unlink_effect");
function pause_effect(effect, callback) {
  var transitions = [];
  pause_children(effect, transitions, true);
  run_out_transitions(transitions, () => {
    destroy_effect(effect);
    if (callback) callback();
  });
}
__name(pause_effect, "pause_effect");
__name2(pause_effect, "pause_effect");
function run_out_transitions(transitions, fn) {
  var remaining = transitions.length;
  if (remaining > 0) {
    var check = /* @__PURE__ */ __name2(() => --remaining || fn(), "check");
    for (var transition of transitions) {
      transition.out(check);
    }
  } else {
    fn();
  }
}
__name(run_out_transitions, "run_out_transitions");
__name2(run_out_transitions, "run_out_transitions");
function pause_children(effect, transitions, local) {
  if ((effect.f & INERT) !== 0) return;
  effect.f ^= INERT;
  if (effect.transitions !== null) {
    for (const transition of effect.transitions) {
      if (transition.is_global || local) {
        transitions.push(transition);
      }
    }
  }
  var child = effect.first;
  while (child !== null) {
    var sibling = child.next;
    var transparent = (child.f & EFFECT_TRANSPARENT) !== 0 || (child.f & BRANCH_EFFECT) !== 0;
    pause_children(child, transitions, transparent ? local : false);
    child = sibling;
  }
}
__name(pause_children, "pause_children");
__name2(pause_children, "pause_children");
var is_updating_effect = false;
function set_is_updating_effect(value) {
  is_updating_effect = value;
}
__name(set_is_updating_effect, "set_is_updating_effect");
__name2(set_is_updating_effect, "set_is_updating_effect");
var is_destroying_effect = false;
function set_is_destroying_effect(value) {
  is_destroying_effect = value;
}
__name(set_is_destroying_effect, "set_is_destroying_effect");
__name2(set_is_destroying_effect, "set_is_destroying_effect");
var active_reaction = null;
var untracking = false;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
__name(set_active_reaction, "set_active_reaction");
__name2(set_active_reaction, "set_active_reaction");
var active_effect = null;
function set_active_effect(effect) {
  active_effect = effect;
}
__name(set_active_effect, "set_active_effect");
__name2(set_active_effect, "set_active_effect");
var current_sources = null;
function push_reaction_value(value) {
  if (active_reaction !== null && true) {
    if (current_sources === null) {
      current_sources = [value];
    } else {
      current_sources.push(value);
    }
  }
}
__name(push_reaction_value, "push_reaction_value");
__name2(push_reaction_value, "push_reaction_value");
var new_deps = null;
var skipped_deps = 0;
var untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
__name(set_untracked_writes, "set_untracked_writes");
__name2(set_untracked_writes, "set_untracked_writes");
var write_version = 1;
var read_version = 0;
var update_version = read_version;
function set_update_version(value) {
  update_version = value;
}
__name(set_update_version, "set_update_version");
__name2(set_update_version, "set_update_version");
var skip_reaction = false;
function increment_write_version() {
  return ++write_version;
}
__name(increment_write_version, "increment_write_version");
__name2(increment_write_version, "increment_write_version");
function is_dirty(reaction) {
  var flags = reaction.f;
  if ((flags & DIRTY) !== 0) {
    return true;
  }
  if ((flags & MAYBE_DIRTY) !== 0) {
    var dependencies = reaction.deps;
    var is_unowned = (flags & UNOWNED) !== 0;
    if (dependencies !== null) {
      var i;
      var dependency;
      var is_disconnected = (flags & DISCONNECTED) !== 0;
      var is_unowned_connected = is_unowned && active_effect !== null && !skip_reaction;
      var length = dependencies.length;
      if ((is_disconnected || is_unowned_connected) && (active_effect === null || (active_effect.f & DESTROYED) === 0)) {
        var derived = (
          /** @type {Derived} */
          reaction
        );
        var parent = derived.parent;
        for (i = 0; i < length; i++) {
          dependency = dependencies[i];
          if (is_disconnected || !dependency?.reactions?.includes(derived)) {
            (dependency.reactions ??= []).push(derived);
          }
        }
        if (is_disconnected) {
          derived.f ^= DISCONNECTED;
        }
        if (is_unowned_connected && parent !== null && (parent.f & UNOWNED) === 0) {
          derived.f ^= UNOWNED;
        }
      }
      for (i = 0; i < length; i++) {
        dependency = dependencies[i];
        if (is_dirty(
          /** @type {Derived} */
          dependency
        )) {
          update_derived(
            /** @type {Derived} */
            dependency
          );
        }
        if (dependency.wv > reaction.wv) {
          return true;
        }
      }
    }
    if (!is_unowned || active_effect !== null && !skip_reaction) {
      set_signal_status(reaction, CLEAN);
    }
  }
  return false;
}
__name(is_dirty, "is_dirty");
__name2(is_dirty, "is_dirty");
function schedule_possible_effect_self_invalidation(signal, effect, root2 = true) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  if (current_sources?.includes(signal)) {
    return;
  }
  for (var i = 0; i < reactions.length; i++) {
    var reaction = reactions[i];
    if ((reaction.f & DERIVED) !== 0) {
      schedule_possible_effect_self_invalidation(
        /** @type {Derived} */
        reaction,
        effect,
        false
      );
    } else if (effect === reaction) {
      if (root2) {
        set_signal_status(reaction, DIRTY);
      } else if ((reaction.f & CLEAN) !== 0) {
        set_signal_status(reaction, MAYBE_DIRTY);
      }
      schedule_effect(
        /** @type {Effect} */
        reaction
      );
    }
  }
}
__name(schedule_possible_effect_self_invalidation, "schedule_possible_effect_self_invalidation");
__name2(schedule_possible_effect_self_invalidation, "schedule_possible_effect_self_invalidation");
function update_reaction(reaction) {
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_skip_reaction = skip_reaction;
  var previous_sources = current_sources;
  var previous_component_context = component_context;
  var previous_untracking = untracking;
  var previous_update_version = update_version;
  var flags = reaction.f;
  new_deps = /** @type {null | Value[]} */
  null;
  skipped_deps = 0;
  untracked_writes = null;
  skip_reaction = (flags & UNOWNED) !== 0 && (untracking || !is_updating_effect || active_reaction === null);
  active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_sources = null;
  set_component_context(reaction.ctx);
  untracking = false;
  update_version = ++read_version;
  if (reaction.ac !== null) {
    without_reactive_context(() => {
      reaction.ac.abort(STALE_REACTION);
    });
    reaction.ac = null;
  }
  try {
    reaction.f |= REACTION_IS_UPDATING;
    var fn = (
      /** @type {Function} */
      reaction.fn
    );
    var result = fn();
    var deps = reaction.deps;
    if (new_deps !== null) {
      var i;
      remove_reactions(reaction, skipped_deps);
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0; i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (!skip_reaction || // Deriveds that already have reactions can cleanup, so we still add them as reactions
      (flags & DERIVED) !== 0 && /** @type {import('#client').Derived} */
      reaction.reactions !== null) {
        for (i = skipped_deps; i < deps.length; i++) {
          (deps[i].reactions ??= []).push(reaction);
        }
      }
    } else if (deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
      for (i = 0; i < /** @type {Source[]} */
      untracked_writes.length; i++) {
        schedule_possible_effect_self_invalidation(
          untracked_writes[i],
          /** @type {Effect} */
          reaction
        );
      }
    }
    if (previous_reaction !== null && previous_reaction !== reaction) {
      read_version++;
      if (untracked_writes !== null) {
        if (previous_untracked_writes === null) {
          previous_untracked_writes = untracked_writes;
        } else {
          previous_untracked_writes.push(.../** @type {Source[]} */
          untracked_writes);
        }
      }
    }
    if ((reaction.f & ERROR_VALUE) !== 0) {
      reaction.f ^= ERROR_VALUE;
    }
    return result;
  } catch (error4) {
    return handle_error(error4);
  } finally {
    reaction.f ^= REACTION_IS_UPDATING;
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    skip_reaction = previous_skip_reaction;
    current_sources = previous_sources;
    set_component_context(previous_component_context);
    untracking = previous_untracking;
    update_version = previous_update_version;
  }
}
__name(update_reaction, "update_reaction");
__name2(update_reaction, "update_reaction");
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index4 = index_of.call(reactions, signal);
    if (index4 !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index4] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (new_deps === null || !new_deps.includes(dependency))) {
    set_signal_status(dependency, MAYBE_DIRTY);
    if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
      dependency.f ^= DISCONNECTED;
    }
    destroy_derived_effects(
      /** @type {Derived} **/
      dependency
    );
    remove_reactions(
      /** @type {Derived} **/
      dependency,
      0
    );
  }
}
__name(remove_reaction, "remove_reaction");
__name2(remove_reaction, "remove_reaction");
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null) return;
  for (var i = start_index; i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
__name(remove_reactions, "remove_reactions");
__name2(remove_reactions, "remove_reactions");
function update_effect(effect) {
  var flags = effect.f;
  if ((flags & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect, CLEAN);
  var previous_effect = active_effect;
  var was_updating_effect = is_updating_effect;
  active_effect = effect;
  is_updating_effect = true;
  try {
    if ((flags & BLOCK_EFFECT) !== 0) {
      destroy_block_effect_children(effect);
    } else {
      destroy_effect_children(effect);
    }
    execute_effect_teardown(effect);
    var teardown = update_reaction(effect);
    effect.teardown = typeof teardown === "function" ? teardown : null;
    effect.wv = write_version;
    var dep;
    if (BROWSER && tracing_mode_flag && (effect.f & DIRTY) !== 0 && effect.deps !== null) ;
  } finally {
    is_updating_effect = was_updating_effect;
    active_effect = previous_effect;
  }
}
__name(update_effect, "update_effect");
__name2(update_effect, "update_effect");
function get(signal) {
  var flags = signal.f;
  var is_derived = (flags & DERIVED) !== 0;
  if (active_reaction !== null && !untracking) {
    var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
    if (!destroyed && !current_sources?.includes(signal)) {
      var deps = active_reaction.deps;
      if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else if (!skip_reaction || !new_deps.includes(signal)) {
            new_deps.push(signal);
          }
        }
      } else {
        (active_reaction.deps ??= []).push(signal);
        var reactions = signal.reactions;
        if (reactions === null) {
          signal.reactions = [active_reaction];
        } else if (!reactions.includes(active_reaction)) {
          reactions.push(active_reaction);
        }
      }
    }
  } else if (is_derived && /** @type {Derived} */
  signal.deps === null && /** @type {Derived} */
  signal.effects === null) {
    var derived = (
      /** @type {Derived} */
      signal
    );
    var parent = derived.parent;
    if (parent !== null && (parent.f & UNOWNED) === 0) {
      derived.f ^= UNOWNED;
    }
  }
  if (is_destroying_effect) {
    if (old_values.has(signal)) {
      return old_values.get(signal);
    }
    if (is_derived) {
      derived = /** @type {Derived} */
      signal;
      var value = derived.v;
      if ((derived.f & CLEAN) === 0 && derived.reactions !== null || depends_on_old_values(derived)) {
        value = execute_derived(derived);
      }
      old_values.set(derived, value);
      return value;
    }
  } else if (is_derived) {
    derived = /** @type {Derived} */
    signal;
    if (is_dirty(derived)) {
      update_derived(derived);
    }
  }
  if ((signal.f & ERROR_VALUE) !== 0) {
    throw signal.v;
  }
  return signal.v;
}
__name(get, "get");
__name2(get, "get");
function depends_on_old_values(derived) {
  if (derived.v === UNINITIALIZED) return true;
  if (derived.deps === null) return false;
  for (const dep of derived.deps) {
    if (old_values.has(dep)) {
      return true;
    }
    if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
      /** @type {Derived} */
      dep
    )) {
      return true;
    }
  }
  return false;
}
__name(depends_on_old_values, "depends_on_old_values");
__name2(depends_on_old_values, "depends_on_old_values");
var STATUS_MASK = -7169;
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
__name(set_signal_status, "set_signal_status");
__name2(set_signal_status, "set_signal_status");
var PASSIVE_EVENTS = ["touchstart", "touchmove"];
function is_passive_event(name) {
  return PASSIVE_EVENTS.includes(name);
}
__name(is_passive_event, "is_passive_event");
__name2(is_passive_event, "is_passive_event");
var all_registered_events = /* @__PURE__ */ new Set();
var root_event_handles = /* @__PURE__ */ new Set();
var last_propagated_event = null;
function handle_event_propagation(event) {
  var handler_element = this;
  var owner_document = (
    /** @type {Node} */
    handler_element.ownerDocument
  );
  var event_name = event.type;
  var path = event.composedPath?.() || [];
  var current_target = (
    /** @type {null | Element} */
    path[0] || event.target
  );
  last_propagated_event = event;
  var path_idx = 0;
  var handled_at = last_propagated_event === event && event.__root;
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
    window)) {
      event.__root = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = /** @type {Element} */
  path[path_idx] || event.target;
  if (current_target === handler_element) return;
  define_property(event, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
      current_target.host || null;
      try {
        var delegated = current_target["__" + event_name];
        if (delegated != null && (!/** @type {any} */
        current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
        // -> the target could not have been disabled because it emits the event in the first place
        event.target === current_target)) {
          if (is_array(delegated)) {
            var [fn, ...data] = delegated;
            fn.apply(current_target, [event, ...data]);
          } else {
            delegated.call(current_target, event);
          }
        }
      } catch (error4) {
        if (throw_error) {
          other_errors.push(error4);
        } else {
          throw_error = error4;
        }
      }
      if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
        break;
      }
      current_target = parent_element;
    }
    if (throw_error) {
      for (let error4 of other_errors) {
        queueMicrotask(() => {
          throw error4;
        });
      }
      throw throw_error;
    }
  } finally {
    event.__root = handler_element;
    delete event.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
__name(handle_event_propagation, "handle_event_propagation");
__name2(handle_event_propagation, "handle_event_propagation");
function assign_nodes(start, end) {
  var effect = (
    /** @type {Effect} */
    active_effect
  );
  if (effect.nodes_start === null) {
    effect.nodes_start = start;
    effect.nodes_end = end;
  }
}
__name(assign_nodes, "assign_nodes");
__name2(assign_nodes, "assign_nodes");
function mount(component4, options2) {
  return _mount(component4, options2);
}
__name(mount, "mount");
__name2(mount, "mount");
function hydrate(component4, options2) {
  init_operations();
  options2.intro = options2.intro ?? false;
  const target = options2.target;
  const was_hydrating = hydrating;
  const previous_hydrate_node = hydrate_node;
  try {
    var anchor = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ get_first_child(target)
    );
    while (anchor && (anchor.nodeType !== COMMENT_NODE || /** @type {Comment} */
    anchor.data !== HYDRATION_START)) {
      anchor = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(anchor);
    }
    if (!anchor) {
      throw HYDRATION_ERROR;
    }
    set_hydrating(true);
    set_hydrate_node(
      /** @type {Comment} */
      anchor
    );
    hydrate_next();
    const instance = _mount(component4, { ...options2, anchor });
    if (hydrate_node === null || hydrate_node.nodeType !== COMMENT_NODE || /** @type {Comment} */
    hydrate_node.data !== HYDRATION_END) {
      hydration_mismatch();
      throw HYDRATION_ERROR;
    }
    set_hydrating(false);
    return (
      /**  @type {Exports} */
      instance
    );
  } catch (error4) {
    if (error4 instanceof Error && error4.message.split("\n").some((line) => line.startsWith("https://svelte.dev/e/"))) {
      throw error4;
    }
    if (error4 !== HYDRATION_ERROR) {
      console.warn("Failed to hydrate: ", error4);
    }
    if (options2.recover === false) {
      hydration_failed();
    }
    init_operations();
    clear_text_content(target);
    set_hydrating(false);
    return mount(component4, options2);
  } finally {
    set_hydrating(was_hydrating);
    set_hydrate_node(previous_hydrate_node);
  }
}
__name(hydrate, "hydrate");
__name2(hydrate, "hydrate");
var document_listeners = /* @__PURE__ */ new Map();
function _mount(Component, { target, anchor, props = {}, events, context: context3, intro = true }) {
  init_operations();
  var registered_events = /* @__PURE__ */ new Set();
  var event_handle = /* @__PURE__ */ __name2((events2) => {
    for (var i = 0; i < events2.length; i++) {
      var event_name = events2[i];
      if (registered_events.has(event_name)) continue;
      registered_events.add(event_name);
      var passive = is_passive_event(event_name);
      target.addEventListener(event_name, handle_event_propagation, { passive });
      var n2 = document_listeners.get(event_name);
      if (n2 === void 0) {
        document.addEventListener(event_name, handle_event_propagation, { passive });
        document_listeners.set(event_name, 1);
      } else {
        document_listeners.set(event_name, n2 + 1);
      }
    }
  }, "event_handle");
  event_handle(array_from(all_registered_events));
  root_event_handles.add(event_handle);
  var component4 = void 0;
  var unmount2 = component_root(() => {
    var anchor_node = anchor ?? target.appendChild(create_text());
    branch(() => {
      if (context3) {
        push2({});
        var ctx = (
          /** @type {ComponentContext} */
          component_context
        );
        ctx.c = context3;
      }
      if (events) {
        props.$$events = events;
      }
      if (hydrating) {
        assign_nodes(
          /** @type {TemplateNode} */
          anchor_node,
          null
        );
      }
      component4 = Component(anchor_node, props) || {};
      if (hydrating) {
        active_effect.nodes_end = hydrate_node;
      }
      if (context3) {
        pop2();
      }
    });
    return () => {
      for (var event_name of registered_events) {
        target.removeEventListener(event_name, handle_event_propagation);
        var n2 = (
          /** @type {number} */
          document_listeners.get(event_name)
        );
        if (--n2 === 0) {
          document.removeEventListener(event_name, handle_event_propagation);
          document_listeners.delete(event_name);
        } else {
          document_listeners.set(event_name, n2);
        }
      }
      root_event_handles.delete(event_handle);
      if (anchor_node !== anchor) {
        anchor_node.parentNode?.removeChild(anchor_node);
      }
    };
  });
  mounted_components.set(component4, unmount2);
  return component4;
}
__name(_mount, "_mount");
__name2(_mount, "_mount");
var mounted_components = /* @__PURE__ */ new WeakMap();
function unmount(component4, options2) {
  const fn = mounted_components.get(component4);
  if (fn) {
    mounted_components.delete(component4);
    return fn(options2);
  }
  return Promise.resolve();
}
__name(unmount, "unmount");
__name2(unmount, "unmount");
function asClassComponent$1(component4) {
  return class extends Svelte4Component {
    /** @param {any} options */
    constructor(options2) {
      super({
        component: component4,
        ...options2
      });
    }
  };
}
__name(asClassComponent$1, "asClassComponent$1");
__name2(asClassComponent$1, "asClassComponent$1");
var Svelte4Component = class {
  static {
    __name(this, "Svelte4Component");
  }
  static {
    __name2(this, "Svelte4Component");
  }
  /** @type {any} */
  #events;
  /** @type {Record<string, any>} */
  #instance;
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(options2) {
    var sources = /* @__PURE__ */ new Map();
    var add_source = /* @__PURE__ */ __name2((key2, value) => {
      var s3 = /* @__PURE__ */ mutable_source(value, false, false);
      sources.set(key2, s3);
      return s3;
    }, "add_source");
    const props = new Proxy(
      { ...options2.props || {}, $$events: {} },
      {
        get(target, prop) {
          return get(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
        },
        has(target, prop) {
          if (prop === LEGACY_PROPS) return true;
          get(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
          return Reflect.has(target, prop);
        },
        set(target, prop, value) {
          set(sources.get(prop) ?? add_source(prop, value), value);
          return Reflect.set(target, prop, value);
        }
      }
    );
    this.#instance = (options2.hydrate ? hydrate : mount)(options2.component, {
      target: options2.target,
      anchor: options2.anchor,
      props,
      context: options2.context,
      intro: options2.intro ?? false,
      recover: options2.recover
    });
    if (!options2?.props?.$$host || options2.sync === false) {
      flushSync();
    }
    this.#events = props.$$events;
    for (const key2 of Object.keys(this.#instance)) {
      if (key2 === "$set" || key2 === "$destroy" || key2 === "$on") continue;
      define_property(this, key2, {
        get() {
          return this.#instance[key2];
        },
        /** @param {any} value */
        set(value) {
          this.#instance[key2] = value;
        },
        enumerable: true
      });
    }
    this.#instance.$set = /** @param {Record<string, any>} next */
    (next) => {
      Object.assign(props, next);
    };
    this.#instance.$destroy = () => {
      unmount(this.#instance);
    };
  }
  /** @param {Record<string, any>} props */
  $set(props) {
    this.#instance.$set(props);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(event, callback) {
    this.#events[event] = this.#events[event] || [];
    const cb = /* @__PURE__ */ __name2((...args) => callback.call(this, ...args), "cb");
    this.#events[event].push(cb);
    return () => {
      this.#events[event] = this.#events[event].filter(
        /** @param {any} fn */
        (fn) => fn !== cb
      );
    };
  }
  $destroy() {
    this.#instance.$destroy();
  }
};
var read_implementation = null;
function set_read_implementation(fn) {
  read_implementation = fn;
}
__name(set_read_implementation, "set_read_implementation");
__name2(set_read_implementation, "set_read_implementation");
function asClassComponent(component4) {
  const component_constructor = asClassComponent$1(component4);
  const _render = /* @__PURE__ */ __name2((props, { context: context3 } = {}) => {
    const result = render(component4, { props, context: context3 });
    return {
      css: { code: "", map: null },
      head: result.head,
      html: result.body
    };
  }, "_render");
  component_constructor.render = _render;
  return component_constructor;
}
__name(asClassComponent, "asClassComponent");
__name2(asClassComponent, "asClassComponent");
function Root($$payload, $$props) {
  push();
  let {
    stores: stores2,
    page: page2,
    constructors,
    components = [],
    form,
    data_0 = null,
    data_1 = null
  } = $$props;
  {
    setContext("__svelte__", stores2);
  }
  {
    stores2.page.set(page2);
  }
  const Pyramid_1 = constructors[1];
  if (constructors[1]) {
    $$payload.out.push("<!--[-->");
    const Pyramid_0 = constructors[0];
    $$payload.out.push(`<!---->`);
    Pyramid_0($$payload, {
      data: data_0,
      form,
      params: page2.params,
      children: /* @__PURE__ */ __name2(($$payload2) => {
        $$payload2.out.push(`<!---->`);
        Pyramid_1($$payload2, { data: data_1, form, params: page2.params });
        $$payload2.out.push(`<!---->`);
      }, "children"),
      $$slots: { default: true }
    });
    $$payload.out.push(`<!---->`);
  } else {
    $$payload.out.push("<!--[!-->");
    const Pyramid_0 = constructors[0];
    $$payload.out.push(`<!---->`);
    Pyramid_0($$payload, { data: data_0, form, params: page2.params });
    $$payload.out.push(`<!---->`);
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
__name(Root, "Root");
__name2(Root, "Root");
var root = asClassComponent(Root);
var options = {
  app_template_contains_nonce: false,
  csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false }, "reportOnly": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
  csrf_check_origin: true,
  csrf_trusted_origins: [],
  embedded: false,
  env_public_prefix: "PUBLIC_",
  env_private_prefix: "",
  hash_routing: false,
  hooks: null,
  // added lazily, via `get_hooks`
  preload_strategy: "modulepreload",
  root,
  service_worker: false,
  service_worker_options: void 0,
  templates: {
    app: /* @__PURE__ */ __name2(({ head, body: body2, assets: assets2, nonce, env: env32 }) => '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <link rel="icon" href="' + assets2 + '/favicon.png" />\n    ' + head + '\n  </head>\n  <body data-sveltekit-preload-data="hover">\n    <div style="display: contents">' + body2 + "</div>\n  </body>\n</html>\n", "app"),
    error: /* @__PURE__ */ __name2(({ status, message }) => '<!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<title>' + message + `</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family:
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					Oxygen,
					Ubuntu,
					Cantarell,
					'Open Sans',
					'Helvetica Neue',
					sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">` + status + '</span>\n			<div class="message">\n				<h1>' + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n", "error")
  },
  version_hash: "1kxgn0f"
};
async function get_hooks() {
  let handle;
  let handleFetch;
  let handleError;
  let handleValidationError;
  let init2;
  let reroute;
  let transport;
  return {
    handle,
    handleFetch,
    handleError,
    handleValidationError,
    init: init2,
    reroute,
    transport
  };
}
__name(get_hooks, "get_hooks");
__name2(get_hooks, "get_hooks");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_utils2();
var INVALIDATED_PARAM = "x-sveltekit-invalidated";
var TRAILING_SLASH_PARAM = "x-sveltekit-trailing-slash";
function stringify2(data, transport) {
  const encoders = Object.fromEntries(Object.entries(transport).map(([k, v]) => [k, v.encode]));
  return stringify(data, encoders);
}
__name(stringify2, "stringify2");
__name2(stringify2, "stringify");
function parse_remote_arg(string, transport) {
  if (!string) return void 0;
  const json_string = text_decoder2.decode(
    // no need to add back `=` characters, atob can handle it
    base64_decode(string.replaceAll("-", "+").replaceAll("_", "/"))
  );
  const decoders = Object.fromEntries(Object.entries(transport).map(([k, v]) => [k, v.decode]));
  return parse(json_string, decoders);
}
__name(parse_remote_arg, "parse_remote_arg");
__name2(parse_remote_arg, "parse_remote_arg");
var import_cookie = __toESM(require_cookie(), 1);
var set_cookie_parser = __toESM(require_set_cookie(), 1);
var SVELTE_KIT_ASSETS = "/_svelte_kit_assets";
var ENDPOINT_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];
var PAGE_METHODS = ["GET", "POST", "HEAD"];
function negotiate(accept, types) {
  const parts = [];
  accept.split(",").forEach((str, i) => {
    const match = /([^/ \t]+)\/([^; \t]+)[ \t]*(?:;[ \t]*q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      parts.push({ type, subtype, q: +q, i });
    }
  });
  parts.sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }
    if (a.subtype === "*" !== (b.subtype === "*")) {
      return a.subtype === "*" ? 1 : -1;
    }
    if (a.type === "*" !== (b.type === "*")) {
      return a.type === "*" ? 1 : -1;
    }
    return a.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex(
      (part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*")
    );
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
__name(negotiate, "negotiate");
__name2(negotiate, "negotiate");
function is_content_type(request, ...types) {
  const type = request.headers.get("content-type")?.split(";", 1)[0].trim() ?? "";
  return types.includes(type.toLowerCase());
}
__name(is_content_type, "is_content_type");
__name2(is_content_type, "is_content_type");
function is_form_content_type(request) {
  return is_content_type(
    request,
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain"
  );
}
__name(is_form_content_type, "is_form_content_type");
__name2(is_form_content_type, "is_form_content_type");
function coalesce_to_error(err) {
  return err instanceof Error || err && /** @type {any} */
  err.name && /** @type {any} */
  err.message ? (
    /** @type {Error} */
    err
  ) : new Error(JSON.stringify(err));
}
__name(coalesce_to_error, "coalesce_to_error");
__name2(coalesce_to_error, "coalesce_to_error");
function normalize_error(error222) {
  return (
    /** @type {import('../exports/internal/index.js').Redirect | HttpError | SvelteKitError | Error} */
    error222
  );
}
__name(normalize_error, "normalize_error");
__name2(normalize_error, "normalize_error");
function get_status(error222) {
  return error222 instanceof HttpError || error222 instanceof SvelteKitError ? error222.status : 500;
}
__name(get_status, "get_status");
__name2(get_status, "get_status");
function get_message(error222) {
  return error222 instanceof SvelteKitError ? error222.text : "Internal Error";
}
__name(get_message, "get_message");
__name2(get_message, "get_message");
var escape_html_attr_dict = {
  "&": "&amp;",
  '"': "&quot;"
  // Svelte also escapes < because the escape function could be called inside a `noscript` there
  // https://github.com/sveltejs/svelte/security/advisories/GHSA-8266-84wp-wv5c
  // However, that doesn't apply in SvelteKit
};
var escape_html_dict = {
  "&": "&amp;",
  "<": "&lt;"
};
var surrogates = (
  // high surrogate without paired low surrogate
  "[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]"
);
var escape_html_attr_regex = new RegExp(
  `[${Object.keys(escape_html_attr_dict).join("")}]|` + surrogates,
  "g"
);
var escape_html_regex = new RegExp(
  `[${Object.keys(escape_html_dict).join("")}]|` + surrogates,
  "g"
);
function escape_html2(str, is_attr) {
  const dict = is_attr ? escape_html_attr_dict : escape_html_dict;
  const escaped_str = str.replace(is_attr ? escape_html_attr_regex : escape_html_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return escaped_str;
}
__name(escape_html2, "escape_html2");
__name2(escape_html2, "escape_html");
function method_not_allowed(mod, method) {
  return text(`${method} method not allowed`, {
    status: 405,
    headers: {
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: allowed_methods(mod).join(", ")
    }
  });
}
__name(method_not_allowed, "method_not_allowed");
__name2(method_not_allowed, "method_not_allowed");
function allowed_methods(mod) {
  const allowed = ENDPOINT_METHODS.filter((method) => method in mod);
  if ("GET" in mod || "HEAD" in mod) allowed.push("HEAD");
  return allowed;
}
__name(allowed_methods, "allowed_methods");
__name2(allowed_methods, "allowed_methods");
function get_global_name(options2) {
  return `__sveltekit_${options2.version_hash}`;
}
__name(get_global_name, "get_global_name");
__name2(get_global_name, "get_global_name");
function static_error_page(options2, status, message) {
  let page2 = options2.templates.error({ status, message: escape_html2(message) });
  return text(page2, {
    headers: { "content-type": "text/html; charset=utf-8" },
    status
  });
}
__name(static_error_page, "static_error_page");
__name2(static_error_page, "static_error_page");
async function handle_fatal_error(event, state2, options2, error222) {
  error222 = error222 instanceof HttpError ? error222 : coalesce_to_error(error222);
  const status = get_status(error222);
  const body2 = await handle_error_and_jsonify(event, state2, options2, error222);
  const type = negotiate(event.request.headers.get("accept") || "text/html", [
    "application/json",
    "text/html"
  ]);
  if (event.isDataRequest || type === "application/json") {
    return json(body2, {
      status
    });
  }
  return static_error_page(options2, status, body2.message);
}
__name(handle_fatal_error, "handle_fatal_error");
__name2(handle_fatal_error, "handle_fatal_error");
async function handle_error_and_jsonify(event, state2, options2, error222) {
  if (error222 instanceof HttpError) {
    return { message: "Unknown Error", ...error222.body };
  }
  const status = get_status(error222);
  const message = get_message(error222);
  return await with_request_store(
    { event, state: state2 },
    () => options2.hooks.handleError({ error: error222, event, status, message })
  ) ?? { message };
}
__name(handle_error_and_jsonify, "handle_error_and_jsonify");
__name2(handle_error_and_jsonify, "handle_error_and_jsonify");
function redirect_response(status, location) {
  const response = new Response(void 0, {
    status,
    headers: { location }
  });
  return response;
}
__name(redirect_response, "redirect_response");
__name2(redirect_response, "redirect_response");
function clarify_devalue_error(event, error222) {
  if (error222.path) {
    return `Data returned from \`load\` while rendering ${event.route.id} is not serializable: ${error222.message} (${error222.path}). If you need to serialize/deserialize custom types, use transport hooks: https://svelte.dev/docs/kit/hooks#Universal-hooks-transport.`;
  }
  if (error222.path === "") {
    return `Data returned from \`load\` while rendering ${event.route.id} is not a plain object`;
  }
  return error222.message;
}
__name(clarify_devalue_error, "clarify_devalue_error");
__name2(clarify_devalue_error, "clarify_devalue_error");
function serialize_uses(node) {
  const uses = {};
  if (node.uses && node.uses.dependencies.size > 0) {
    uses.dependencies = Array.from(node.uses.dependencies);
  }
  if (node.uses && node.uses.search_params.size > 0) {
    uses.search_params = Array.from(node.uses.search_params);
  }
  if (node.uses && node.uses.params.size > 0) {
    uses.params = Array.from(node.uses.params);
  }
  if (node.uses?.parent) uses.parent = 1;
  if (node.uses?.route) uses.route = 1;
  if (node.uses?.url) uses.url = 1;
  return uses;
}
__name(serialize_uses, "serialize_uses");
__name2(serialize_uses, "serialize_uses");
function has_prerendered_path(manifest2, pathname) {
  return manifest2._.prerendered_routes.has(pathname) || pathname.at(-1) === "/" && manifest2._.prerendered_routes.has(pathname.slice(0, -1));
}
__name(has_prerendered_path, "has_prerendered_path");
__name2(has_prerendered_path, "has_prerendered_path");
function format_server_error(status, error222, event) {
  const formatted_text = `
\x1B[1;31m[${status}] ${event.request.method} ${event.url.pathname}\x1B[0m`;
  if (status === 404) {
    return formatted_text;
  }
  return `${formatted_text}
${error222.stack}`;
}
__name(format_server_error, "format_server_error");
__name2(format_server_error, "format_server_error");
function get_node_type(node_id) {
  const parts = node_id?.split("/");
  const filename = parts?.at(-1);
  if (!filename) return "unknown";
  const dot_parts = filename.split(".");
  return dot_parts.slice(0, -1).join(".");
}
__name(get_node_type, "get_node_type");
__name2(get_node_type, "get_node_type");
async function render_endpoint(event, event_state, mod, state2) {
  const method = (
    /** @type {import('types').HttpMethod} */
    event.request.method
  );
  let handler = mod[method] || mod.fallback;
  if (method === "HEAD" && !mod.HEAD && mod.GET) {
    handler = mod.GET;
  }
  if (!handler) {
    return method_not_allowed(mod, method);
  }
  const prerender = mod.prerender ?? state2.prerender_default;
  if (prerender && (mod.POST || mod.PATCH || mod.PUT || mod.DELETE)) {
    throw new Error("Cannot prerender endpoints that have mutative methods");
  }
  if (state2.prerendering && !state2.prerendering.inside_reroute && !prerender) {
    if (state2.depth > 0) {
      throw new Error(`${event.route.id} is not prerenderable`);
    } else {
      return new Response(void 0, { status: 204 });
    }
  }
  try {
    const response = await with_request_store(
      { event, state: event_state },
      () => handler(
        /** @type {import('@sveltejs/kit').RequestEvent<Record<string, any>>} */
        event
      )
    );
    if (!(response instanceof Response)) {
      throw new Error(
        `Invalid response from route ${event.url.pathname}: handler should return a Response object`
      );
    }
    if (state2.prerendering && (!state2.prerendering.inside_reroute || prerender)) {
      const cloned = new Response(response.clone().body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers)
      });
      cloned.headers.set("x-sveltekit-prerender", String(prerender));
      if (state2.prerendering.inside_reroute && prerender) {
        cloned.headers.set(
          "x-sveltekit-routeid",
          encodeURI(
            /** @type {string} */
            event.route.id
          )
        );
        state2.prerendering.dependencies.set(event.url.pathname, { response: cloned, body: null });
      } else {
        return cloned;
      }
    }
    return response;
  } catch (e3) {
    if (e3 instanceof Redirect) {
      return new Response(void 0, {
        status: e3.status,
        headers: { location: e3.location }
      });
    }
    throw e3;
  }
}
__name(render_endpoint, "render_endpoint");
__name2(render_endpoint, "render_endpoint");
function is_endpoint_request(event) {
  const { method, headers: headers2 } = event.request;
  if (ENDPOINT_METHODS.includes(method) && !PAGE_METHODS.includes(method)) {
    return true;
  }
  if (method === "POST" && headers2.get("x-sveltekit-action") === "true") return false;
  const accept = event.request.headers.get("accept") ?? "*/*";
  return negotiate(accept, ["*", "text/html"]) !== "text/html";
}
__name(is_endpoint_request, "is_endpoint_request");
__name2(is_endpoint_request, "is_endpoint_request");
function compact(arr) {
  return arr.filter(
    /** @returns {val is NonNullable<T>} */
    (val) => val != null
  );
}
__name(compact, "compact");
__name2(compact, "compact");
var DATA_SUFFIX = "/__data.json";
var HTML_DATA_SUFFIX = ".html__data.json";
function has_data_suffix2(pathname) {
  return pathname.endsWith(DATA_SUFFIX) || pathname.endsWith(HTML_DATA_SUFFIX);
}
__name(has_data_suffix2, "has_data_suffix2");
__name2(has_data_suffix2, "has_data_suffix");
function add_data_suffix2(pathname) {
  if (pathname.endsWith(".html")) return pathname.replace(/\.html$/, HTML_DATA_SUFFIX);
  return pathname.replace(/\/$/, "") + DATA_SUFFIX;
}
__name(add_data_suffix2, "add_data_suffix2");
__name2(add_data_suffix2, "add_data_suffix");
function strip_data_suffix2(pathname) {
  if (pathname.endsWith(HTML_DATA_SUFFIX)) {
    return pathname.slice(0, -HTML_DATA_SUFFIX.length) + ".html";
  }
  return pathname.slice(0, -DATA_SUFFIX.length);
}
__name(strip_data_suffix2, "strip_data_suffix2");
__name2(strip_data_suffix2, "strip_data_suffix");
var ROUTE_SUFFIX = "/__route.js";
function has_resolution_suffix2(pathname) {
  return pathname.endsWith(ROUTE_SUFFIX);
}
__name(has_resolution_suffix2, "has_resolution_suffix2");
__name2(has_resolution_suffix2, "has_resolution_suffix");
function add_resolution_suffix2(pathname) {
  return pathname.replace(/\/$/, "") + ROUTE_SUFFIX;
}
__name(add_resolution_suffix2, "add_resolution_suffix2");
__name2(add_resolution_suffix2, "add_resolution_suffix");
function strip_resolution_suffix2(pathname) {
  return pathname.slice(0, -ROUTE_SUFFIX.length);
}
__name(strip_resolution_suffix2, "strip_resolution_suffix2");
__name2(strip_resolution_suffix2, "strip_resolution_suffix");
var noop_span = {
  spanContext() {
    return noop_span_context;
  },
  setAttribute() {
    return this;
  },
  setAttributes() {
    return this;
  },
  addEvent() {
    return this;
  },
  setStatus() {
    return this;
  },
  updateName() {
    return this;
  },
  end() {
    return this;
  },
  isRecording() {
    return false;
  },
  recordException() {
    return this;
  },
  addLink() {
    return this;
  },
  addLinks() {
    return this;
  }
};
var noop_span_context = {
  traceId: "",
  spanId: "",
  traceFlags: 0
};
async function record_span({ name, attributes, fn }) {
  {
    return fn(noop_span);
  }
}
__name(record_span, "record_span");
__name2(record_span, "record_span");
function is_action_json_request(event) {
  const accept = negotiate(event.request.headers.get("accept") ?? "*/*", [
    "application/json",
    "text/html"
  ]);
  return accept === "application/json" && event.request.method === "POST";
}
__name(is_action_json_request, "is_action_json_request");
__name2(is_action_json_request, "is_action_json_request");
async function handle_action_json_request(event, event_state, options2, server2) {
  const actions = server2?.actions;
  if (!actions) {
    const no_actions_error = new SvelteKitError(
      405,
      "Method Not Allowed",
      `POST method not allowed. No form actions exist for ${"this page"}`
    );
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(event, event_state, options2, no_actions_error)
      },
      {
        status: no_actions_error.status,
        headers: {
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
          // "The server must generate an Allow header field in a 405 status code response"
          allow: "GET"
        }
      }
    );
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, event_state, actions);
    if (BROWSER) ;
    if (data instanceof ActionFailure) {
      return action_json({
        type: "failure",
        status: data.status,
        // @ts-expect-error we assign a string to what is supposed to be an object. That's ok
        // because we don't use the object outside, and this way we have better code navigation
        // through knowing where the related interface is used.
        data: stringify_action_response(
          data.data,
          /** @type {string} */
          event.route.id,
          options2.hooks.transport
        )
      });
    } else {
      return action_json({
        type: "success",
        status: data ? 200 : 204,
        // @ts-expect-error see comment above
        data: stringify_action_response(
          data,
          /** @type {string} */
          event.route.id,
          options2.hooks.transport
        )
      });
    }
  } catch (e3) {
    const err = normalize_error(e3);
    if (err instanceof Redirect) {
      return action_json_redirect(err);
    }
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(
          event,
          event_state,
          options2,
          check_incorrect_fail_use(err)
        )
      },
      {
        status: get_status(err)
      }
    );
  }
}
__name(handle_action_json_request, "handle_action_json_request");
__name2(handle_action_json_request, "handle_action_json_request");
function check_incorrect_fail_use(error222) {
  return error222 instanceof ActionFailure ? new Error('Cannot "throw fail()". Use "return fail()"') : error222;
}
__name(check_incorrect_fail_use, "check_incorrect_fail_use");
__name2(check_incorrect_fail_use, "check_incorrect_fail_use");
function action_json_redirect(redirect) {
  return action_json({
    type: "redirect",
    status: redirect.status,
    location: redirect.location
  });
}
__name(action_json_redirect, "action_json_redirect");
__name2(action_json_redirect, "action_json_redirect");
function action_json(data, init2) {
  return json(data, init2);
}
__name(action_json, "action_json");
__name2(action_json, "action_json");
function is_action_request(event) {
  return event.request.method === "POST";
}
__name(is_action_request, "is_action_request");
__name2(is_action_request, "is_action_request");
async function handle_action_request(event, event_state, server2) {
  const actions = server2?.actions;
  if (!actions) {
    event.setHeaders({
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: "GET"
    });
    return {
      type: "error",
      error: new SvelteKitError(
        405,
        "Method Not Allowed",
        `POST method not allowed. No form actions exist for ${"this page"}`
      )
    };
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, event_state, actions);
    if (BROWSER) ;
    if (data instanceof ActionFailure) {
      return {
        type: "failure",
        status: data.status,
        data: data.data
      };
    } else {
      return {
        type: "success",
        status: 200,
        // @ts-expect-error this will be removed upon serialization, so `undefined` is the same as omission
        data
      };
    }
  } catch (e3) {
    const err = normalize_error(e3);
    if (err instanceof Redirect) {
      return {
        type: "redirect",
        status: err.status,
        location: err.location
      };
    }
    return {
      type: "error",
      error: check_incorrect_fail_use(err)
    };
  }
}
__name(handle_action_request, "handle_action_request");
__name2(handle_action_request, "handle_action_request");
function check_named_default_separate(actions) {
  if (actions.default && Object.keys(actions).length > 1) {
    throw new Error(
      "When using named actions, the default action cannot be used. See the docs for more info: https://svelte.dev/docs/kit/form-actions#named-actions"
    );
  }
}
__name(check_named_default_separate, "check_named_default_separate");
__name2(check_named_default_separate, "check_named_default_separate");
async function call_action(event, event_state, actions) {
  const url = new URL(event.request.url);
  let name = "default";
  for (const param of url.searchParams) {
    if (param[0].startsWith("/")) {
      name = param[0].slice(1);
      if (name === "default") {
        throw new Error('Cannot use reserved action name "default"');
      }
      break;
    }
  }
  const action = actions[name];
  if (!action) {
    throw new SvelteKitError(404, "Not Found", `No action with name '${name}' found`);
  }
  if (!is_form_content_type(event.request)) {
    throw new SvelteKitError(
      415,
      "Unsupported Media Type",
      `Form actions expect form-encoded data \u2014 received ${event.request.headers.get(
        "content-type"
      )}`
    );
  }
  return record_span({
    name: "sveltekit.form_action",
    attributes: {
      "http.route": event.route.id || "unknown"
    },
    fn: /* @__PURE__ */ __name2(async (current) => {
      const traced_event = merge_tracing(event, current);
      const result = await with_request_store(
        { event: traced_event, state: event_state },
        () => action(traced_event)
      );
      if (result instanceof ActionFailure) {
        current.setAttributes({
          "sveltekit.form_action.result.type": "failure",
          "sveltekit.form_action.result.status": result.status
        });
      }
      return result;
    }, "fn")
  });
}
__name(call_action, "call_action");
__name2(call_action, "call_action");
function uneval_action_response(data, route_id, transport) {
  const replacer = /* @__PURE__ */ __name2((thing) => {
    for (const key2 in transport) {
      const encoded = transport[key2].encode(thing);
      if (encoded) {
        return `app.decode('${key2}', ${uneval(encoded, replacer)})`;
      }
    }
  }, "replacer");
  return try_serialize(data, (value) => uneval(value, replacer), route_id);
}
__name(uneval_action_response, "uneval_action_response");
__name2(uneval_action_response, "uneval_action_response");
function stringify_action_response(data, route_id, transport) {
  const encoders = Object.fromEntries(
    Object.entries(transport).map(([key2, value]) => [key2, value.encode])
  );
  return try_serialize(data, (value) => stringify(value, encoders), route_id);
}
__name(stringify_action_response, "stringify_action_response");
__name2(stringify_action_response, "stringify_action_response");
function try_serialize(data, fn, route_id) {
  try {
    return fn(data);
  } catch (e3) {
    const error222 = (
      /** @type {any} */
      e3
    );
    if (data instanceof Response) {
      throw new Error(
        `Data returned from action inside ${route_id} is not serializable. Form actions need to return plain objects or fail(). E.g. return { success: true } or return fail(400, { message: "invalid" });`
      );
    }
    if ("path" in error222) {
      let message = `Data returned from action inside ${route_id} is not serializable: ${error222.message}`;
      if (error222.path !== "") message += ` (data.${error222.path})`;
      throw new Error(message);
    }
    throw error222;
  }
}
__name(try_serialize, "try_serialize");
__name2(try_serialize, "try_serialize");
function defer() {
  let fulfil;
  let reject;
  const promise = new Promise((f, r3) => {
    fulfil = f;
    reject = r3;
  });
  return { promise, fulfil, reject };
}
__name(defer, "defer");
__name2(defer, "defer");
function create_async_iterator() {
  let count32 = 0;
  const deferred2 = [defer()];
  return {
    iterate: /* @__PURE__ */ __name2((transform = (x) => x) => {
      return {
        [Symbol.asyncIterator]() {
          return {
            next: /* @__PURE__ */ __name2(async () => {
              const next = await deferred2[0].promise;
              if (!next.done) {
                deferred2.shift();
                return { value: transform(next.value), done: false };
              }
              return next;
            }, "next")
          };
        }
      };
    }, "iterate"),
    add: /* @__PURE__ */ __name2((promise) => {
      count32 += 1;
      void promise.then((value) => {
        deferred2[deferred2.length - 1].fulfil({
          value,
          done: false
        });
        deferred2.push(defer());
        if (--count32 === 0) {
          deferred2[deferred2.length - 1].fulfil({ done: true });
        }
      });
    }, "add")
  };
}
__name(create_async_iterator, "create_async_iterator");
__name2(create_async_iterator, "create_async_iterator");
function server_data_serializer(event, event_state, options2) {
  let promise_id = 1;
  const iterator = create_async_iterator();
  const global = get_global_name(options2);
  function replacer(thing) {
    if (typeof thing?.then === "function") {
      const id = promise_id++;
      const promise = thing.then(
        /** @param {any} data */
        (data) => ({ data })
      ).catch(
        /** @param {any} error */
        async (error222) => ({
          error: await handle_error_and_jsonify(event, event_state, options2, error222)
        })
      ).then(
        /**
         * @param {{data: any; error: any}} result
         */
        async ({ data, error: error222 }) => {
          let str;
          try {
            str = uneval(error222 ? [, error222] : [data], replacer);
          } catch {
            error222 = await handle_error_and_jsonify(
              event,
              event_state,
              options2,
              new Error(`Failed to serialize promise while rendering ${event.route.id}`)
            );
            data = void 0;
            str = uneval([, error222], replacer);
          }
          return `${global}.resolve(${id}, ${str.includes("app.decode") ? `(app) => ${str}` : `() => ${str}`})`;
        }
      );
      iterator.add(promise);
      return `${global}.defer(${id})`;
    } else {
      for (const key2 in options2.hooks.transport) {
        const encoded = options2.hooks.transport[key2].encode(thing);
        if (encoded) {
          return `app.decode('${key2}', ${uneval(encoded, replacer)})`;
        }
      }
    }
  }
  __name(replacer, "replacer");
  __name2(replacer, "replacer");
  const strings = (
    /** @type {string[]} */
    []
  );
  return {
    add_node(i, node) {
      try {
        if (!node) {
          strings[i] = "null";
          return;
        }
        const payload = { type: "data", data: node.data, uses: serialize_uses(node) };
        if (node.slash) payload.slash = node.slash;
        strings[i] = uneval(payload, replacer);
      } catch (e3) {
        e3.path = e3.path.slice(1);
        throw new Error(clarify_devalue_error(
          event,
          /** @type {any} */
          e3
        ));
      }
    },
    get_data(csp) {
      const open = `<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>`;
      const close = `<\/script>
`;
      return {
        data: `[${strings.join(",")}]`,
        chunks: promise_id > 1 ? iterator.iterate((str) => open + str + close) : null
      };
    }
  };
}
__name(server_data_serializer, "server_data_serializer");
__name2(server_data_serializer, "server_data_serializer");
function server_data_serializer_json(event, event_state, options2) {
  let promise_id = 1;
  const iterator = create_async_iterator();
  const reducers = {
    ...Object.fromEntries(
      Object.entries(options2.hooks.transport).map(([key2, value]) => [key2, value.encode])
    ),
    /** @param {any} thing */
    Promise: /* @__PURE__ */ __name2((thing) => {
      if (typeof thing?.then !== "function") {
        return;
      }
      const id = promise_id++;
      let key2 = "data";
      const promise = thing.catch(
        /** @param {any} e */
        async (e3) => {
          key2 = "error";
          return handle_error_and_jsonify(
            event,
            event_state,
            options2,
            /** @type {any} */
            e3
          );
        }
      ).then(
        /** @param {any} value */
        async (value) => {
          let str;
          try {
            str = stringify(value, reducers);
          } catch {
            const error222 = await handle_error_and_jsonify(
              event,
              event_state,
              options2,
              new Error(`Failed to serialize promise while rendering ${event.route.id}`)
            );
            key2 = "error";
            str = stringify(error222, reducers);
          }
          return `{"type":"chunk","id":${id},"${key2}":${str}}
`;
        }
      );
      iterator.add(promise);
      return id;
    }, "Promise")
  };
  const strings = (
    /** @type {string[]} */
    []
  );
  return {
    add_node(i, node) {
      try {
        if (!node) {
          strings[i] = "null";
          return;
        }
        if (node.type === "error" || node.type === "skip") {
          strings[i] = JSON.stringify(node);
          return;
        }
        strings[i] = `{"type":"data","data":${stringify(node.data, reducers)},"uses":${JSON.stringify(
          serialize_uses(node)
        )}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
      } catch (e3) {
        e3.path = "data" + e3.path;
        throw new Error(clarify_devalue_error(
          event,
          /** @type {any} */
          e3
        ));
      }
    },
    get_data() {
      return {
        data: `{"type":"data","nodes":[${strings.join(",")}]}
`,
        chunks: promise_id > 1 ? iterator.iterate() : null
      };
    }
  };
}
__name(server_data_serializer_json, "server_data_serializer_json");
__name2(server_data_serializer_json, "server_data_serializer_json");
var NULL_BODY_STATUS = [101, 103, 204, 205, 304];
async function load_server_data({ event, event_state, state: state2, node, parent }) {
  if (!node?.server) return null;
  let is_tracking = true;
  const uses = {
    dependencies: /* @__PURE__ */ new Set(),
    params: /* @__PURE__ */ new Set(),
    parent: false,
    route: false,
    url: false,
    search_params: /* @__PURE__ */ new Set()
  };
  const load2 = node.server.load;
  const slash = node.server.trailingSlash;
  if (!load2) {
    return { type: "data", data: null, uses, slash };
  }
  const url = make_trackable(
    event.url,
    () => {
      if (is_tracking) {
        uses.url = true;
      }
    },
    (param) => {
      if (is_tracking) {
        uses.search_params.add(param);
      }
    }
  );
  if (state2.prerendering) {
    disable_search(url);
  }
  const result = await record_span({
    name: "sveltekit.load",
    attributes: {
      "sveltekit.load.node_id": node.server_id || "unknown",
      "sveltekit.load.node_type": get_node_type(node.server_id),
      "http.route": event.route.id || "unknown"
    },
    fn: /* @__PURE__ */ __name2(async (current) => {
      const traced_event = merge_tracing(event, current);
      const result2 = await with_request_store(
        { event: traced_event, state: event_state },
        () => load2.call(null, {
          ...traced_event,
          fetch: /* @__PURE__ */ __name2((info32, init2) => {
            new URL(info32 instanceof Request ? info32.url : info32, event.url);
            return event.fetch(info32, init2);
          }, "fetch"),
          /** @param {string[]} deps */
          depends: /* @__PURE__ */ __name2((...deps) => {
            for (const dep of deps) {
              const { href } = new URL(dep, event.url);
              uses.dependencies.add(href);
            }
          }, "depends"),
          params: new Proxy(event.params, {
            get: /* @__PURE__ */ __name2((target, key2) => {
              if (is_tracking) {
                uses.params.add(key2);
              }
              return target[
                /** @type {string} */
                key2
              ];
            }, "get")
          }),
          parent: /* @__PURE__ */ __name2(async () => {
            if (is_tracking) {
              uses.parent = true;
            }
            return parent();
          }, "parent"),
          route: new Proxy(event.route, {
            get: /* @__PURE__ */ __name2((target, key2) => {
              if (is_tracking) {
                uses.route = true;
              }
              return target[
                /** @type {'id'} */
                key2
              ];
            }, "get")
          }),
          url,
          untrack(fn) {
            is_tracking = false;
            try {
              return fn();
            } finally {
              is_tracking = true;
            }
          }
        })
      );
      return result2;
    }, "fn")
  });
  return {
    type: "data",
    data: result ?? null,
    uses,
    slash
  };
}
__name(load_server_data, "load_server_data");
__name2(load_server_data, "load_server_data");
async function load_data({
  event,
  event_state,
  fetched,
  node,
  parent,
  server_data_promise,
  state: state2,
  resolve_opts,
  csr
}) {
  const server_data_node = await server_data_promise;
  const load2 = node?.universal?.load;
  if (!load2) {
    return server_data_node?.data ?? null;
  }
  const result = await record_span({
    name: "sveltekit.load",
    attributes: {
      "sveltekit.load.node_id": node.universal_id || "unknown",
      "sveltekit.load.node_type": get_node_type(node.universal_id),
      "http.route": event.route.id || "unknown"
    },
    fn: /* @__PURE__ */ __name2(async (current) => {
      const traced_event = merge_tracing(event, current);
      return await with_request_store(
        { event: traced_event, state: event_state },
        () => load2.call(null, {
          url: event.url,
          params: event.params,
          data: server_data_node?.data ?? null,
          route: event.route,
          fetch: create_universal_fetch(event, state2, fetched, csr, resolve_opts),
          setHeaders: event.setHeaders,
          depends: /* @__PURE__ */ __name2(() => {
          }, "depends"),
          parent,
          untrack: /* @__PURE__ */ __name2((fn) => fn(), "untrack"),
          tracing: traced_event.tracing
        })
      );
    }, "fn")
  });
  return result ?? null;
}
__name(load_data, "load_data");
__name2(load_data, "load_data");
function create_universal_fetch(event, state2, fetched, csr, resolve_opts) {
  const universal_fetch = /* @__PURE__ */ __name2(async (input, init2) => {
    const cloned_body = input instanceof Request && input.body ? input.clone().body : null;
    const cloned_headers = input instanceof Request && [...input.headers].length ? new Headers(input.headers) : init2?.headers;
    let response = await event.fetch(input, init2);
    const url = new URL(input instanceof Request ? input.url : input, event.url);
    const same_origin = url.origin === event.url.origin;
    let dependency;
    if (same_origin) {
      if (state2.prerendering) {
        dependency = { response, body: null };
        state2.prerendering.dependencies.set(url.pathname, dependency);
      }
    } else if (url.protocol === "https:" || url.protocol === "http:") {
      const mode = input instanceof Request ? input.mode : init2?.mode ?? "cors";
      if (mode === "no-cors") {
        response = new Response("", {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } else {
        const acao = response.headers.get("access-control-allow-origin");
        if (!acao || acao !== event.url.origin && acao !== "*") {
          throw new Error(
            `CORS error: ${acao ? "Incorrect" : "No"} 'Access-Control-Allow-Origin' header is present on the requested resource`
          );
        }
      }
    }
    let teed_body;
    const proxy2 = new Proxy(response, {
      get(response2, key2, _receiver) {
        async function push_fetched(body2, is_b64) {
          const status_number = Number(response2.status);
          if (isNaN(status_number)) {
            throw new Error(
              `response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`
            );
          }
          fetched.push({
            url: same_origin ? url.href.slice(event.url.origin.length) : url.href,
            method: event.request.method,
            request_body: (
              /** @type {string | ArrayBufferView | undefined} */
              input instanceof Request && cloned_body ? await stream_to_string(cloned_body) : init2?.body
            ),
            request_headers: cloned_headers,
            response_body: body2,
            response: response2,
            is_b64
          });
        }
        __name(push_fetched, "push_fetched");
        __name2(push_fetched, "push_fetched");
        if (key2 === "body") {
          if (response2.body === null) {
            return null;
          }
          if (teed_body) {
            return teed_body;
          }
          const [a, b] = response2.body.tee();
          void (async () => {
            let result = new Uint8Array();
            for await (const chunk of a) {
              const combined = new Uint8Array(result.length + chunk.length);
              combined.set(result, 0);
              combined.set(chunk, result.length);
              result = combined;
            }
            if (dependency) {
              dependency.body = new Uint8Array(result);
            }
            void push_fetched(base64_encode(result), true);
          })();
          return teed_body = b;
        }
        if (key2 === "arrayBuffer") {
          return async () => {
            const buffer = await response2.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            if (dependency) {
              dependency.body = bytes;
            }
            if (buffer instanceof ArrayBuffer) {
              await push_fetched(base64_encode(bytes), true);
            }
            return buffer;
          };
        }
        async function text2() {
          const body2 = await response2.text();
          if (body2 === "" && NULL_BODY_STATUS.includes(response2.status)) {
            await push_fetched(void 0, false);
            return void 0;
          }
          if (!body2 || typeof body2 === "string") {
            await push_fetched(body2, false);
          }
          if (dependency) {
            dependency.body = body2;
          }
          return body2;
        }
        __name(text2, "text2");
        __name2(text2, "text2");
        if (key2 === "text") {
          return text2;
        }
        if (key2 === "json") {
          return async () => {
            const body2 = await text2();
            return body2 ? JSON.parse(body2) : void 0;
          };
        }
        return Reflect.get(response2, key2, response2);
      }
    });
    if (csr) {
      const get2 = response.headers.get;
      response.headers.get = (key2) => {
        const lower = key2.toLowerCase();
        const value = get2.call(response.headers, lower);
        if (value && !lower.startsWith("x-sveltekit-")) {
          const included = resolve_opts.filterSerializedResponseHeaders(lower, value);
          if (!included) {
            throw new Error(
              `Failed to get response header "${lower}" \u2014 it must be included by the \`filterSerializedResponseHeaders\` option: https://svelte.dev/docs/kit/hooks#Server-hooks-handle (at ${event.route.id})`
            );
          }
        }
        return value;
      };
    }
    return proxy2;
  }, "universal_fetch");
  return (input, init2) => {
    const response = universal_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
__name(create_universal_fetch, "create_universal_fetch");
__name2(create_universal_fetch, "create_universal_fetch");
async function stream_to_string(stream) {
  let result = "";
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result += text_decoder2.decode(value);
  }
  return result;
}
__name(stream_to_string, "stream_to_string");
__name2(stream_to_string, "stream_to_string");
function hash(...values) {
  let hash2 = 5381;
  for (const value of values) {
    if (typeof value === "string") {
      let i = value.length;
      while (i) hash2 = hash2 * 33 ^ value.charCodeAt(--i);
    } else if (ArrayBuffer.isView(value)) {
      const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      let i = buffer.length;
      while (i) hash2 = hash2 * 33 ^ buffer[--i];
    } else {
      throw new TypeError("value must be a string or TypedArray");
    }
  }
  return (hash2 >>> 0).toString(36);
}
__name(hash, "hash");
__name2(hash, "hash");
var replacements = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var pattern = new RegExp(`[${Object.keys(replacements).join("")}]`, "g");
function serialize_data(fetched, filter, prerendering = false) {
  const headers2 = {};
  let cache_control = null;
  let age = null;
  let varyAny = false;
  for (const [key2, value] of fetched.response.headers) {
    if (filter(key2, value)) {
      headers2[key2] = value;
    }
    if (key2 === "cache-control") cache_control = value;
    else if (key2 === "age") age = value;
    else if (key2 === "vary" && value.trim() === "*") varyAny = true;
  }
  const payload = {
    status: fetched.response.status,
    statusText: fetched.response.statusText,
    headers: headers2,
    body: fetched.response_body
  };
  const safe_payload = JSON.stringify(payload).replace(pattern, (match) => replacements[match]);
  const attrs = [
    'type="application/json"',
    "data-sveltekit-fetched",
    `data-url="${escape_html2(fetched.url, true)}"`
  ];
  if (fetched.is_b64) {
    attrs.push("data-b64");
  }
  if (fetched.request_headers || fetched.request_body) {
    const values = [];
    if (fetched.request_headers) {
      values.push([...new Headers(fetched.request_headers)].join(","));
    }
    if (fetched.request_body) {
      values.push(fetched.request_body);
    }
    attrs.push(`data-hash="${hash(...values)}"`);
  }
  if (!prerendering && fetched.method === "GET" && cache_control && !varyAny) {
    const match = /s-maxage=(\d+)/g.exec(cache_control) ?? /max-age=(\d+)/g.exec(cache_control);
    if (match) {
      const ttl = +match[1] - +(age ?? "0");
      attrs.push(`data-ttl="${ttl}"`);
    }
  }
  return `<script ${attrs.join(" ")}>${safe_payload}<\/script>`;
}
__name(serialize_data, "serialize_data");
__name2(serialize_data, "serialize_data");
var s = JSON.stringify;
function sha256(data) {
  if (!key[0]) precompute();
  const out = init.slice(0);
  const array2 = encode(data);
  for (let i = 0; i < array2.length; i += 16) {
    const w = array2.subarray(i, i + 16);
    let tmp;
    let a;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i2 = 0; i2 < 64; i2++) {
      if (i2 < 16) {
        tmp = w[i2];
      } else {
        a = w[i2 + 1 & 15];
        b = w[i2 + 14 & 15];
        tmp = w[i2 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i2 & 15] + w[i2 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i2];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return btoa(String.fromCharCode(...bytes));
}
__name(sha256, "sha256");
__name2(sha256, "sha256");
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x) {
    return (x - Math.floor(x)) * 4294967296;
  }
  __name(frac, "frac");
  __name2(frac, "frac");
  let prime = 2;
  for (let i = 0; i < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i < 8) {
        init[i] = frac(prime ** (1 / 2));
      }
      key[i] = frac(prime ** (1 / 3));
      i++;
    }
  }
}
__name(precompute, "precompute");
__name2(precompute, "precompute");
function reverse_endianness(bytes) {
  for (let i = 0; i < bytes.length; i += 4) {
    const a = bytes[i + 0];
    const b = bytes[i + 1];
    const c2 = bytes[i + 2];
    const d = bytes[i + 3];
    bytes[i + 0] = d;
    bytes[i + 1] = c2;
    bytes[i + 2] = b;
    bytes[i + 3] = a;
  }
}
__name(reverse_endianness, "reverse_endianness");
__name2(reverse_endianness, "reverse_endianness");
function encode(str) {
  const encoded = text_encoder2.encode(str);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
__name(encode, "encode");
__name2(encode, "encode");
var array = new Uint8Array(16);
function generate_nonce() {
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
__name(generate_nonce, "generate_nonce");
__name2(generate_nonce, "generate_nonce");
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample",
  "wasm-unsafe-eval",
  "script"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var BaseProvider = class {
  static {
    __name(this, "BaseProvider");
  }
  static {
    __name2(this, "BaseProvider");
  }
  /** @type {boolean} */
  #use_hashes;
  /** @type {boolean} */
  #script_needs_csp;
  /** @type {boolean} */
  #script_src_needs_csp;
  /** @type {boolean} */
  #script_src_elem_needs_csp;
  /** @type {boolean} */
  #style_needs_csp;
  /** @type {boolean} */
  #style_src_needs_csp;
  /** @type {boolean} */
  #style_src_attr_needs_csp;
  /** @type {boolean} */
  #style_src_elem_needs_csp;
  /** @type {import('types').CspDirectives} */
  #directives;
  /** @type {import('types').Csp.Source[]} */
  #script_src;
  /** @type {import('types').Csp.Source[]} */
  #script_src_elem;
  /** @type {import('types').Csp.Source[]} */
  #style_src;
  /** @type {import('types').Csp.Source[]} */
  #style_src_attr;
  /** @type {import('types').Csp.Source[]} */
  #style_src_elem;
  /** @type {string} */
  #nonce;
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    this.#use_hashes = use_hashes;
    this.#directives = directives;
    const d = this.#directives;
    this.#script_src = [];
    this.#script_src_elem = [];
    this.#style_src = [];
    this.#style_src_attr = [];
    this.#style_src_elem = [];
    const effective_script_src = d["script-src"] || d["default-src"];
    const script_src_elem = d["script-src-elem"];
    const effective_style_src = d["style-src"] || d["default-src"];
    const style_src_attr = d["style-src-attr"];
    const style_src_elem = d["style-src-elem"];
    const needs_csp = /* @__PURE__ */ __name2((directive) => !!directive && !directive.some((value) => value === "unsafe-inline"), "needs_csp");
    this.#script_src_needs_csp = needs_csp(effective_script_src);
    this.#script_src_elem_needs_csp = needs_csp(script_src_elem);
    this.#style_src_needs_csp = needs_csp(effective_style_src);
    this.#style_src_attr_needs_csp = needs_csp(style_src_attr);
    this.#style_src_elem_needs_csp = needs_csp(style_src_elem);
    this.#script_needs_csp = this.#script_src_needs_csp || this.#script_src_elem_needs_csp;
    this.#style_needs_csp = this.#style_src_needs_csp || this.#style_src_attr_needs_csp || this.#style_src_elem_needs_csp;
    this.script_needs_nonce = this.#script_needs_csp && !this.#use_hashes;
    this.style_needs_nonce = this.#style_needs_csp && !this.#use_hashes;
    this.#nonce = nonce;
  }
  /** @param {string} content */
  add_script(content) {
    if (!this.#script_needs_csp) return;
    const source2 = this.#use_hashes ? `sha256-${sha256(content)}` : `nonce-${this.#nonce}`;
    if (this.#script_src_needs_csp) {
      this.#script_src.push(source2);
    }
    if (this.#script_src_elem_needs_csp) {
      this.#script_src_elem.push(source2);
    }
  }
  /** @param {string} content */
  add_style(content) {
    if (!this.#style_needs_csp) return;
    const source2 = this.#use_hashes ? `sha256-${sha256(content)}` : `nonce-${this.#nonce}`;
    if (this.#style_src_needs_csp) {
      this.#style_src.push(source2);
    }
    if (this.#style_src_attr_needs_csp) {
      this.#style_src_attr.push(source2);
    }
    if (this.#style_src_elem_needs_csp) {
      const sha256_empty_comment_hash = "sha256-9OlNO0DNEeaVzHL4RZwCLsBHA8WBQ8toBp/4F5XV2nc=";
      const d = this.#directives;
      if (d["style-src-elem"] && !d["style-src-elem"].includes(sha256_empty_comment_hash) && !this.#style_src_elem.includes(sha256_empty_comment_hash)) {
        this.#style_src_elem.push(sha256_empty_comment_hash);
      }
      if (source2 !== sha256_empty_comment_hash) {
        this.#style_src_elem.push(source2);
      }
    }
  }
  /**
   * @param {boolean} [is_meta]
   */
  get_header(is_meta = false) {
    const header = [];
    const directives = { ...this.#directives };
    if (this.#style_src.length > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...this.#style_src
      ];
    }
    if (this.#style_src_attr.length > 0) {
      directives["style-src-attr"] = [
        ...directives["style-src-attr"] || [],
        ...this.#style_src_attr
      ];
    }
    if (this.#style_src_elem.length > 0) {
      directives["style-src-elem"] = [
        ...directives["style-src-elem"] || [],
        ...this.#style_src_elem
      ];
    }
    if (this.#script_src.length > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...this.#script_src
      ];
    }
    if (this.#script_src_elem.length > 0) {
      directives["script-src-elem"] = [
        ...directives["script-src-elem"] || [],
        ...this.#script_src_elem
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = (
        /** @type {string[] | true} */
        directives[key2]
      );
      if (!value) continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
};
var CspProvider = class extends BaseProvider {
  static {
    __name(this, "CspProvider");
  }
  static {
    __name2(this, "CspProvider");
  }
  get_meta() {
    const content = this.get_header(true);
    if (!content) {
      return;
    }
    return `<meta http-equiv="content-security-policy" content="${escape_html2(content, true)}">`;
  }
};
var CspReportOnlyProvider = class extends BaseProvider {
  static {
    __name(this, "CspReportOnlyProvider");
  }
  static {
    __name2(this, "CspReportOnlyProvider");
  }
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    super(use_hashes, directives, nonce);
    if (Object.values(directives).filter((v) => !!v).length > 0) {
      const has_report_to = directives["report-to"]?.length ?? 0 > 0;
      const has_report_uri = directives["report-uri"]?.length ?? 0 > 0;
      if (!has_report_to && !has_report_uri) {
        throw Error(
          "`content-security-policy-report-only` must be specified with either the `report-to` or `report-uri` directives, or both"
        );
      }
    }
  }
};
var Csp = class {
  static {
    __name(this, "Csp");
  }
  static {
    __name2(this, "Csp");
  }
  /** @readonly */
  nonce = generate_nonce();
  /** @type {CspProvider} */
  csp_provider;
  /** @type {CspReportOnlyProvider} */
  report_only_provider;
  /**
   * @param {import('./types.js').CspConfig} config
   * @param {import('./types.js').CspOpts} opts
   */
  constructor({ mode, directives, reportOnly }, { prerender }) {
    const use_hashes = mode === "hash" || mode === "auto" && prerender;
    this.csp_provider = new CspProvider(use_hashes, directives, this.nonce);
    this.report_only_provider = new CspReportOnlyProvider(use_hashes, reportOnly, this.nonce);
  }
  get script_needs_nonce() {
    return this.csp_provider.script_needs_nonce || this.report_only_provider.script_needs_nonce;
  }
  get style_needs_nonce() {
    return this.csp_provider.style_needs_nonce || this.report_only_provider.style_needs_nonce;
  }
  /** @param {string} content */
  add_script(content) {
    this.csp_provider.add_script(content);
    this.report_only_provider.add_script(content);
  }
  /** @param {string} content */
  add_style(content) {
    this.csp_provider.add_style(content);
    this.report_only_provider.add_style(content);
  }
};
function exec(match, params, matchers) {
  const result = {};
  const values = match.slice(1);
  const values_needing_match = values.filter((value) => value !== void 0);
  let buffered = 0;
  for (let i = 0; i < params.length; i += 1) {
    const param = params[i];
    let value = values[i - buffered];
    if (param.chained && param.rest && buffered) {
      value = values.slice(i - buffered, i + 1).filter((s22) => s22).join("/");
      buffered = 0;
    }
    if (value === void 0) {
      if (param.rest) result[param.name] = "";
      continue;
    }
    if (!param.matcher || matchers[param.matcher](value)) {
      result[param.name] = value;
      const next_param = params[i + 1];
      const next_value = values[i + 1];
      if (next_param && !next_param.rest && next_param.optional && next_value && param.chained) {
        buffered = 0;
      }
      if (!next_param && !next_value && Object.keys(result).length === values_needing_match.length) {
        buffered = 0;
      }
      continue;
    }
    if (param.optional && param.chained) {
      buffered++;
      continue;
    }
    return;
  }
  if (buffered) return;
  return result;
}
__name(exec, "exec");
__name2(exec, "exec");
function generate_route_object(route, url, manifest2) {
  const { errors, layouts, leaf } = route;
  const nodes = [...errors, ...layouts.map((l) => l?.[1]), leaf[1]].filter((n2) => typeof n2 === "number").map((n2) => `'${n2}': () => ${create_client_import(manifest2._.client.nodes?.[n2], url)}`).join(",\n		");
  return [
    `{
	id: ${s(route.id)}`,
    `errors: ${s(route.errors)}`,
    `layouts: ${s(route.layouts)}`,
    `leaf: ${s(route.leaf)}`,
    `nodes: {
		${nodes}
	}
}`
  ].join(",\n	");
}
__name(generate_route_object, "generate_route_object");
__name2(generate_route_object, "generate_route_object");
function create_client_import(import_path, url) {
  if (!import_path) return "Promise.resolve({})";
  if (import_path[0] === "/") {
    return `import('${import_path}')`;
  }
  if (assets !== "") {
    return `import('${assets}/${import_path}')`;
  }
  let path = get_relative_path(url.pathname, `${base}/${import_path}`);
  if (path[0] !== ".") path = `./${path}`;
  return `import('${path}')`;
}
__name(create_client_import, "create_client_import");
__name2(create_client_import, "create_client_import");
async function resolve_route(resolved_path, url, manifest2) {
  if (!manifest2._.client.routes) {
    return text("Server-side route resolution disabled", { status: 400 });
  }
  let route = null;
  let params = {};
  const matchers = await manifest2._.matchers();
  for (const candidate of manifest2._.client.routes) {
    const match = candidate.pattern.exec(resolved_path);
    if (!match) continue;
    const matched = exec(match, candidate.params, matchers);
    if (matched) {
      route = candidate;
      params = decode_params(matched);
      break;
    }
  }
  return create_server_routing_response(route, params, url, manifest2).response;
}
__name(resolve_route, "resolve_route");
__name2(resolve_route, "resolve_route");
function create_server_routing_response(route, params, url, manifest2) {
  const headers2 = new Headers({
    "content-type": "application/javascript; charset=utf-8"
  });
  if (route) {
    const csr_route = generate_route_object(route, url, manifest2);
    const body2 = `${create_css_import(route, url, manifest2)}
export const route = ${csr_route}; export const params = ${JSON.stringify(params)};`;
    return { response: text(body2, { headers: headers2 }), body: body2 };
  } else {
    return { response: text("", { headers: headers2 }), body: "" };
  }
}
__name(create_server_routing_response, "create_server_routing_response");
__name2(create_server_routing_response, "create_server_routing_response");
function create_css_import(route, url, manifest2) {
  const { errors, layouts, leaf } = route;
  let css = "";
  for (const node of [...errors, ...layouts.map((l) => l?.[1]), leaf[1]]) {
    if (typeof node !== "number") continue;
    const node_css = manifest2._.client.css?.[node];
    for (const css_path of node_css ?? []) {
      css += `'${assets || base}/${css_path}',`;
    }
  }
  if (!css) return "";
  return `${create_client_import(
    /** @type {string} */
    manifest2._.client.start,
    url
  )}.then(x => x.load_css([${css}]));`;
}
__name(create_css_import, "create_css_import");
__name2(create_css_import, "create_css_import");
var updated = {
  ...readable(false),
  check: /* @__PURE__ */ __name2(() => false, "check")
};
async function render_response({
  branch: branch2,
  fetched,
  options: options2,
  manifest: manifest2,
  state: state2,
  page_config,
  status,
  error: error222 = null,
  event,
  event_state,
  resolve_opts,
  action_result,
  data_serializer
}) {
  if (state2.prerendering) {
    if (options2.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options2.app_template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
    }
  }
  const { client } = manifest2._;
  const modulepreloads = new Set(client.imports);
  const stylesheets4 = new Set(client.stylesheets);
  const fonts4 = new Set(client.fonts);
  const link_headers = /* @__PURE__ */ new Set();
  const link_tags = /* @__PURE__ */ new Set();
  const inline_styles = /* @__PURE__ */ new Map();
  let rendered;
  const form_value = action_result?.type === "success" || action_result?.type === "failure" ? action_result.data ?? null : null;
  let base$1 = base;
  let assets$1 = assets;
  let base_expression = s(base);
  {
    if (!state2.prerendering?.fallback) {
      const segments = event.url.pathname.slice(base.length).split("/").slice(2);
      base$1 = segments.map(() => "..").join("/") || ".";
      base_expression = `new URL(${s(base$1)}, location).pathname.slice(0, -1)`;
      if (!assets || assets[0] === "/" && assets !== SVELTE_KIT_ASSETS) {
        assets$1 = base$1;
      }
    } else if (options2.hash_routing) {
      base_expression = "new URL('.', location).pathname.slice(0, -1)";
    }
  }
  if (page_config.ssr) {
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        updated
      },
      constructors: await Promise.all(
        branch2.map(({ node }) => {
          if (!node.component) {
            throw new Error(`Missing +page.svelte component for route ${event.route.id}`);
          }
          return node.component();
        })
      ),
      form: form_value
    };
    let data2 = {};
    for (let i = 0; i < branch2.length; i += 1) {
      data2 = { ...data2, ...branch2[i].data };
      props[`data_${i}`] = data2;
    }
    props.page = {
      error: error222,
      params: (
        /** @type {Record<string, any>} */
        event.params
      ),
      route: event.route,
      status,
      url: event.url,
      data: data2,
      form: form_value,
      state: {}
    };
    override({ base: base$1, assets: assets$1 });
    const render_opts = {
      context: /* @__PURE__ */ new Map([
        [
          "__request__",
          {
            page: props.page
          }
        ]
      ])
    };
    {
      try {
        rendered = with_request_store(
          { event, state: event_state },
          () => options2.root.render(props, render_opts)
        );
      } finally {
        reset();
      }
    }
    for (const { node } of branch2) {
      for (const url of node.imports) modulepreloads.add(url);
      for (const url of node.stylesheets) stylesheets4.add(url);
      for (const url of node.fonts) fonts4.add(url);
      if (node.inline_styles && !client.inline) {
        Object.entries(await node.inline_styles()).forEach(([k, v]) => inline_styles.set(k, v));
      }
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  let head = "";
  let body2 = rendered.html;
  const csp = new Csp(options2.csp, {
    prerender: !!state2.prerendering
  });
  const prefixed = /* @__PURE__ */ __name2((path) => {
    if (path.startsWith("/")) {
      return base + path;
    }
    return `${assets$1}/${path}`;
  }, "prefixed");
  const style = client.inline ? client.inline?.style : Array.from(inline_styles.values()).join("\n");
  if (style) {
    const attributes = [];
    if (csp.style_needs_nonce) attributes.push(` nonce="${csp.nonce}"`);
    csp.add_style(style);
    head += `
	<style${attributes.join("")}>${style}</style>`;
  }
  for (const dep of stylesheets4) {
    const path = prefixed(dep);
    const attributes = ['rel="stylesheet"'];
    if (inline_styles.has(dep)) {
      attributes.push("disabled", 'media="(max-width: 0)"');
    } else {
      if (resolve_opts.preload({ type: "css", path })) {
        link_headers.add(`<${encodeURI(path)}>; rel="preload"; as="style"; nopush`);
      }
    }
    head += `
		<link href="${path}" ${attributes.join(" ")}>`;
  }
  for (const dep of fonts4) {
    const path = prefixed(dep);
    if (resolve_opts.preload({ type: "font", path })) {
      const ext = dep.slice(dep.lastIndexOf(".") + 1);
      link_tags.add(`<link rel="preload" as="font" type="font/${ext}" href="${path}" crossorigin>`);
      link_headers.add(
        `<${encodeURI(path)}>; rel="preload"; as="font"; type="font/${ext}"; crossorigin; nopush`
      );
    }
  }
  const global = get_global_name(options2);
  const { data, chunks } = data_serializer.get_data(csp);
  if (page_config.ssr && page_config.csr) {
    body2 += `
			${fetched.map(
      (item) => serialize_data(item, resolve_opts.filterSerializedResponseHeaders, !!state2.prerendering)
    ).join("\n			")}`;
  }
  if (page_config.csr) {
    const route = manifest2._.client.routes?.find((r3) => r3.id === event.route.id) ?? null;
    if (client.uses_env_dynamic_public && state2.prerendering) {
      modulepreloads.add(`${app_dir}/env.js`);
    }
    if (!client.inline) {
      const included_modulepreloads = Array.from(modulepreloads, (dep) => prefixed(dep)).filter(
        (path) => resolve_opts.preload({ type: "js", path })
      );
      for (const path of included_modulepreloads) {
        link_headers.add(`<${encodeURI(path)}>; rel="modulepreload"; nopush`);
        if (options2.preload_strategy !== "modulepreload") {
          head += `
		<link rel="preload" as="script" crossorigin="anonymous" href="${path}">`;
        } else {
          link_tags.add(`<link rel="modulepreload" href="${path}">`);
        }
      }
    }
    if (state2.prerendering && link_tags.size > 0) {
      head += Array.from(link_tags).map((tag) => `
		${tag}`).join("");
    }
    if (manifest2._.client.routes && state2.prerendering && !state2.prerendering.fallback) {
      const pathname = add_resolution_suffix2(event.url.pathname);
      state2.prerendering.dependencies.set(
        pathname,
        create_server_routing_response(route, event.params, new URL(pathname, event.url), manifest2)
      );
    }
    const blocks = [];
    const load_env_eagerly = client.uses_env_dynamic_public && state2.prerendering;
    const properties = [`base: ${base_expression}`];
    if (assets) {
      properties.push(`assets: ${s(assets)}`);
    }
    if (client.uses_env_dynamic_public) {
      properties.push(`env: ${load_env_eagerly ? "null" : s(public_env)}`);
    }
    if (chunks) {
      blocks.push("const deferred = new Map();");
      properties.push(`defer: (id) => new Promise((fulfil, reject) => {
							deferred.set(id, { fulfil, reject });
						})`);
      let app_declaration = "";
      if (Object.keys(options2.hooks.transport).length > 0) {
        if (client.inline) {
          app_declaration = `const app = __sveltekit_${options2.version_hash}.app.app;`;
        } else if (client.app) {
          app_declaration = `const app = await import(${s(prefixed(client.app))});`;
        } else {
          app_declaration = `const { app } = await import(${s(prefixed(client.start))});`;
        }
      }
      const prelude = app_declaration ? `${app_declaration}
							const [data, error] = fn(app);` : `const [data, error] = fn();`;
      properties.push(`resolve: async (id, fn) => {
							${prelude}

							const try_to_resolve = () => {
								if (!deferred.has(id)) {
									setTimeout(try_to_resolve, 0);
									return;
								}
								const { fulfil, reject } = deferred.get(id);
								deferred.delete(id);
								if (error) reject(error);
								else fulfil(data);
							}
							try_to_resolve();
						}`);
    }
    const { remote_data } = event_state;
    if (remote_data) {
      const remote = {};
      for (const key2 in remote_data) {
        remote[key2] = await remote_data[key2];
      }
      const replacer = /* @__PURE__ */ __name2((thing) => {
        for (const key2 in options2.hooks.transport) {
          const encoded = options2.hooks.transport[key2].encode(thing);
          if (encoded) {
            return `app.decode('${key2}', ${uneval(encoded, replacer)})`;
          }
        }
      }, "replacer");
      properties.push(`data: ${uneval(remote, replacer)}`);
    }
    blocks.push(`${global} = {
						${properties.join(",\n						")}
					};`);
    const args = ["element"];
    blocks.push("const element = document.currentScript.parentElement;");
    if (page_config.ssr) {
      const serialized = { form: "null", error: "null" };
      if (form_value) {
        serialized.form = uneval_action_response(
          form_value,
          /** @type {string} */
          event.route.id,
          options2.hooks.transport
        );
      }
      if (error222) {
        serialized.error = uneval(error222);
      }
      const hydrate2 = [
        `node_ids: [${branch2.map(({ node }) => node.index).join(", ")}]`,
        `data: ${data}`,
        `form: ${serialized.form}`,
        `error: ${serialized.error}`
      ];
      if (status !== 200) {
        hydrate2.push(`status: ${status}`);
      }
      if (manifest2._.client.routes) {
        if (route) {
          const stringified = generate_route_object(route, event.url, manifest2).replaceAll(
            "\n",
            "\n							"
          );
          hydrate2.push(`params: ${uneval(event.params)}`, `server_route: ${stringified}`);
        }
      } else if (options2.embedded) {
        hydrate2.push(`params: ${uneval(event.params)}`, `route: ${s(event.route)}`);
      }
      const indent = "	".repeat(load_env_eagerly ? 7 : 6);
      args.push(`{
${indent}	${hydrate2.join(`,
${indent}	`)}
${indent}}`);
    }
    const boot = client.inline ? `${client.inline.script}

					__sveltekit_${options2.version_hash}.app.start(${args.join(", ")});` : client.app ? `Promise.all([
						import(${s(prefixed(client.start))}),
						import(${s(prefixed(client.app))})
					]).then(([kit, app]) => {
						kit.start(app, ${args.join(", ")});
					});` : `import(${s(prefixed(client.start))}).then((app) => {
						app.start(${args.join(", ")})
					});`;
    if (load_env_eagerly) {
      blocks.push(`import(${s(`${base$1}/${app_dir}/env.js`)}).then(({ env }) => {
						${global}.env = env;

						${boot.replace(/\n/g, "\n	")}
					});`);
    } else {
      blocks.push(boot);
    }
    if (options2.service_worker) {
      let opts = "";
      if (options2.service_worker_options != null) {
        const service_worker_options = { ...options2.service_worker_options };
        opts = `, ${s(service_worker_options)}`;
      }
      blocks.push(`if ('serviceWorker' in navigator) {
						addEventListener('load', function () {
							navigator.serviceWorker.register('${prefixed("service-worker.js")}'${opts});
						});
					}`);
    }
    const init_app = `
				{
					${blocks.join("\n\n					")}
				}
			`;
    csp.add_script(init_app);
    body2 += `
			<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_app}<\/script>
		`;
  }
  const headers2 = new Headers({
    "x-sveltekit-page": "true",
    "content-type": "text/html"
  });
  if (state2.prerendering) {
    const http_equiv = [];
    const csp_headers = csp.csp_provider.get_meta();
    if (csp_headers) {
      http_equiv.push(csp_headers);
    }
    if (state2.prerendering.cache) {
      http_equiv.push(`<meta http-equiv="cache-control" content="${state2.prerendering.cache}">`);
    }
    if (http_equiv.length > 0) {
      head = http_equiv.join("\n") + head;
    }
  } else {
    const csp_header = csp.csp_provider.get_header();
    if (csp_header) {
      headers2.set("content-security-policy", csp_header);
    }
    const report_only_header = csp.report_only_provider.get_header();
    if (report_only_header) {
      headers2.set("content-security-policy-report-only", report_only_header);
    }
    if (link_headers.size) {
      headers2.set("link", Array.from(link_headers).join(", "));
    }
  }
  head += rendered.head;
  const html = options2.templates.app({
    head,
    body: body2,
    assets: assets$1,
    nonce: (
      /** @type {string} */
      csp.nonce
    ),
    env: public_env
  });
  const transformed = await resolve_opts.transformPageChunk({
    html,
    done: true
  }) || "";
  if (!chunks) {
    headers2.set("etag", `"${hash(transformed)}"`);
  }
  return !chunks ? text(transformed, {
    status,
    headers: headers2
  }) : new Response(
    new ReadableStream({
      async start(controller2) {
        controller2.enqueue(text_encoder2.encode(transformed + "\n"));
        for await (const chunk of chunks) {
          controller2.enqueue(text_encoder2.encode(chunk));
        }
        controller2.close();
      },
      type: "bytes"
    }),
    {
      headers: headers2
    }
  );
}
__name(render_response, "render_response");
__name2(render_response, "render_response");
var PageNodes = class {
  static {
    __name(this, "PageNodes");
  }
  static {
    __name2(this, "PageNodes");
  }
  data;
  /**
   * @param {Array<import('types').SSRNode | undefined>} nodes
   */
  constructor(nodes) {
    this.data = nodes;
  }
  layouts() {
    return this.data.slice(0, -1);
  }
  page() {
    return this.data.at(-1);
  }
  validate() {
    for (const layout of this.layouts()) {
      if (layout) {
        validate_layout_server_exports(
          layout.server,
          /** @type {string} */
          layout.server_id
        );
        validate_layout_exports(
          layout.universal,
          /** @type {string} */
          layout.universal_id
        );
      }
    }
    const page2 = this.page();
    if (page2) {
      validate_page_server_exports(
        page2.server,
        /** @type {string} */
        page2.server_id
      );
      validate_page_exports(
        page2.universal,
        /** @type {string} */
        page2.universal_id
      );
    }
  }
  /**
   * @template {'prerender' | 'ssr' | 'csr' | 'trailingSlash'} Option
   * @param {Option} option
   * @returns {Value | undefined}
   */
  #get_option(option) {
    return this.data.reduce(
      (value, node) => {
        return node?.universal?.[option] ?? node?.server?.[option] ?? value;
      },
      /** @type {Value | undefined} */
      void 0
    );
  }
  csr() {
    return this.#get_option("csr") ?? true;
  }
  ssr() {
    return this.#get_option("ssr") ?? true;
  }
  prerender() {
    return this.#get_option("prerender") ?? false;
  }
  trailing_slash() {
    return this.#get_option("trailingSlash") ?? "never";
  }
  get_config() {
    let current = {};
    for (const node of this.data) {
      if (!node?.universal?.config && !node?.server?.config) continue;
      current = {
        ...current,
        // TODO: should we override the server config value with the universal value similar to other page options?
        ...node?.universal?.config,
        ...node?.server?.config
      };
    }
    return Object.keys(current).length ? current : void 0;
  }
  should_prerender_data() {
    return this.data.some(
      // prerender in case of trailingSlash because the client retrieves that value from the server
      (node) => node?.server?.load || node?.server?.trailingSlash !== void 0
    );
  }
};
async function respond_with_error({
  event,
  event_state,
  options: options2,
  manifest: manifest2,
  state: state2,
  status,
  error: error222,
  resolve_opts
}) {
  if (event.request.headers.get("x-sveltekit-error")) {
    return static_error_page(
      options2,
      status,
      /** @type {Error} */
      error222.message
    );
  }
  const fetched = [];
  try {
    const branch2 = [];
    const default_layout = await manifest2._.nodes[0]();
    const nodes = new PageNodes([default_layout]);
    const ssr = nodes.ssr();
    const csr = nodes.csr();
    const data_serializer = server_data_serializer(event, event_state, options2);
    if (ssr) {
      state2.error = true;
      const server_data_promise = load_server_data({
        event,
        event_state,
        state: state2,
        node: default_layout,
        // eslint-disable-next-line @typescript-eslint/require-await
        parent: /* @__PURE__ */ __name2(async () => ({}), "parent")
      });
      const server_data = await server_data_promise;
      data_serializer.add_node(0, server_data);
      const data = await load_data({
        event,
        event_state,
        fetched,
        node: default_layout,
        // eslint-disable-next-line @typescript-eslint/require-await
        parent: /* @__PURE__ */ __name2(async () => ({}), "parent"),
        resolve_opts,
        server_data_promise,
        state: state2,
        csr
      });
      branch2.push(
        {
          node: default_layout,
          server_data,
          data
        },
        {
          node: await manifest2._.nodes[1](),
          // 1 is always the root error
          data: null,
          server_data: null
        }
      );
    }
    return await render_response({
      options: options2,
      manifest: manifest2,
      state: state2,
      page_config: {
        ssr,
        csr
      },
      status,
      error: await handle_error_and_jsonify(event, event_state, options2, error222),
      branch: branch2,
      fetched,
      event,
      event_state,
      resolve_opts,
      data_serializer
    });
  } catch (e3) {
    if (e3 instanceof Redirect) {
      return redirect_response(e3.status, e3.location);
    }
    return static_error_page(
      options2,
      get_status(e3),
      (await handle_error_and_jsonify(event, event_state, options2, e3)).message
    );
  }
}
__name(respond_with_error, "respond_with_error");
__name2(respond_with_error, "respond_with_error");
async function handle_remote_call(event, state2, options2, manifest2, id) {
  return record_span({
    name: "sveltekit.remote.call",
    attributes: {},
    fn: /* @__PURE__ */ __name2((current) => {
      const traced_event = merge_tracing(event, current);
      return with_request_store(
        { event: traced_event, state: state2 },
        () => handle_remote_call_internal(traced_event, state2, options2, manifest2, id)
      );
    }, "fn")
  });
}
__name(handle_remote_call, "handle_remote_call");
__name2(handle_remote_call, "handle_remote_call");
async function handle_remote_call_internal(event, state2, options2, manifest2, id) {
  const [hash2, name, prerender_args] = id.split("/");
  const remotes = manifest2._.remotes;
  if (!remotes[hash2]) error32(404);
  const module = await remotes[hash2]();
  const fn = module[name];
  if (!fn) error32(404);
  const info32 = fn.__;
  const transport = options2.hooks.transport;
  event.tracing.current.setAttributes({
    "sveltekit.remote.call.type": info32.type,
    "sveltekit.remote.call.name": info32.name
  });
  let form_client_refreshes;
  try {
    if (info32.type === "query_batch") {
      if (event.request.method !== "POST") {
        throw new SvelteKitError(
          405,
          "Method Not Allowed",
          `\`query.batch\` functions must be invoked via POST request, not ${event.request.method}`
        );
      }
      const { payloads } = await event.request.json();
      const args = payloads.map((payload2) => parse_remote_arg(payload2, transport));
      const get_result = await with_request_store({ event, state: state2 }, () => info32.run(args));
      const results = await Promise.all(
        args.map(async (arg, i) => {
          try {
            return { type: "result", data: get_result(arg, i) };
          } catch (error222) {
            return {
              type: "error",
              error: await handle_error_and_jsonify(event, state2, options2, error222),
              status: error222 instanceof HttpError || error222 instanceof SvelteKitError ? error222.status : 500
            };
          }
        })
      );
      return json(
        /** @type {RemoteFunctionResponse} */
        {
          type: "result",
          result: stringify2(results, transport)
        }
      );
    }
    if (info32.type === "form") {
      if (event.request.method !== "POST") {
        throw new SvelteKitError(
          405,
          "Method Not Allowed",
          `\`form\` functions must be invoked via POST request, not ${event.request.method}`
        );
      }
      if (!is_form_content_type(event.request)) {
        throw new SvelteKitError(
          415,
          "Unsupported Media Type",
          `\`form\` functions expect form-encoded data \u2014 received ${event.request.headers.get(
            "content-type"
          )}`
        );
      }
      const form_data = await event.request.formData();
      form_client_refreshes = JSON.parse(
        /** @type {string} */
        form_data.get("sveltekit:remote_refreshes") ?? "[]"
      );
      form_data.delete("sveltekit:remote_refreshes");
      const fn2 = info32.fn;
      const data2 = await with_request_store({ event, state: state2 }, () => fn2(form_data));
      return json(
        /** @type {RemoteFunctionResponse} */
        {
          type: "result",
          result: stringify2(data2, transport),
          refreshes: await serialize_refreshes(
            /** @type {string[]} */
            form_client_refreshes
          )
        }
      );
    }
    if (info32.type === "command") {
      const { payload: payload2, refreshes } = await event.request.json();
      const arg = parse_remote_arg(payload2, transport);
      const data2 = await with_request_store({ event, state: state2 }, () => fn(arg));
      return json(
        /** @type {RemoteFunctionResponse} */
        {
          type: "result",
          result: stringify2(data2, transport),
          refreshes: await serialize_refreshes(refreshes)
        }
      );
    }
    const payload = info32.type === "prerender" ? prerender_args : (
      /** @type {string} */
      // new URL(...) necessary because we're hiding the URL from the user in the event object
      new URL(event.request.url).searchParams.get("payload")
    );
    const data = await with_request_store(
      { event, state: state2 },
      () => fn(parse_remote_arg(payload, transport))
    );
    return json(
      /** @type {RemoteFunctionResponse} */
      {
        type: "result",
        result: stringify2(data, transport)
      }
    );
  } catch (error222) {
    if (error222 instanceof Redirect) {
      return json({
        type: "redirect",
        location: error222.location,
        refreshes: await serialize_refreshes(form_client_refreshes ?? [])
      });
    }
    return json(
      /** @type {RemoteFunctionResponse} */
      {
        type: "error",
        error: await handle_error_and_jsonify(event, state2, options2, error222),
        status: error222 instanceof HttpError || error222 instanceof SvelteKitError ? error222.status : 500
      },
      {
        headers: {
          "cache-control": "private, no-store"
        }
      }
    );
  }
  async function serialize_refreshes(client_refreshes) {
    const refreshes = (
      /** @type {Record<string, Promise<any>>} */
      state2.refreshes
    );
    for (const key2 of client_refreshes) {
      if (refreshes[key2] !== void 0) continue;
      const [hash3, name2, payload] = key2.split("/");
      const loader = manifest2._.remotes[hash3];
      const fn2 = (await loader?.())?.[name2];
      if (!fn2) error32(400, "Bad Request");
      refreshes[key2] = with_request_store(
        { event, state: state2 },
        () => fn2(parse_remote_arg(payload, transport))
      );
    }
    if (Object.keys(refreshes).length === 0) {
      return void 0;
    }
    return stringify2(
      Object.fromEntries(
        await Promise.all(
          Object.entries(refreshes).map(async ([key2, promise]) => [key2, await promise])
        )
      ),
      transport
    );
  }
  __name(serialize_refreshes, "serialize_refreshes");
  __name2(serialize_refreshes, "serialize_refreshes");
}
__name(handle_remote_call_internal, "handle_remote_call_internal");
__name2(handle_remote_call_internal, "handle_remote_call_internal");
async function handle_remote_form_post(event, state2, manifest2, id) {
  return record_span({
    name: "sveltekit.remote.form.post",
    attributes: {},
    fn: /* @__PURE__ */ __name2((current) => {
      const traced_event = merge_tracing(event, current);
      return with_request_store(
        { event: traced_event, state: state2 },
        () => handle_remote_form_post_internal(traced_event, state2, manifest2, id)
      );
    }, "fn")
  });
}
__name(handle_remote_form_post, "handle_remote_form_post");
__name2(handle_remote_form_post, "handle_remote_form_post");
async function handle_remote_form_post_internal(event, state2, manifest2, id) {
  const [hash2, name, action_id] = id.split("/");
  const remotes = manifest2._.remotes;
  const module = await remotes[hash2]?.();
  let form = (
    /** @type {RemoteForm<any>} */
    module?.[name]
  );
  if (!form) {
    event.setHeaders({
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: "GET"
    });
    return {
      type: "error",
      error: new SvelteKitError(
        405,
        "Method Not Allowed",
        `POST method not allowed. No form actions exist for ${"this page"}`
      )
    };
  }
  if (action_id) {
    form = with_request_store({ event, state: state2 }, () => form.for(JSON.parse(action_id)));
  }
  try {
    const form_data = await event.request.formData();
    const fn = (
      /** @type {RemoteInfo & { type: 'form' }} */
      /** @type {any} */
      form.__.fn
    );
    await with_request_store({ event, state: state2 }, () => fn(form_data));
    return {
      type: "success",
      status: 200
    };
  } catch (e3) {
    const err = normalize_error(e3);
    if (err instanceof Redirect) {
      return {
        type: "redirect",
        status: err.status,
        location: err.location
      };
    }
    return {
      type: "error",
      error: check_incorrect_fail_use(err)
    };
  }
}
__name(handle_remote_form_post_internal, "handle_remote_form_post_internal");
__name2(handle_remote_form_post_internal, "handle_remote_form_post_internal");
function get_remote_id(url) {
  return url.pathname.startsWith(`${base}/${app_dir}/remote/`) && url.pathname.replace(`${base}/${app_dir}/remote/`, "");
}
__name(get_remote_id, "get_remote_id");
__name2(get_remote_id, "get_remote_id");
function get_remote_action(url) {
  return url.searchParams.get("/remote");
}
__name(get_remote_action, "get_remote_action");
__name2(get_remote_action, "get_remote_action");
var MAX_DEPTH = 10;
async function render_page(event, event_state, page2, options2, manifest2, state2, nodes, resolve_opts) {
  if (state2.depth > MAX_DEPTH) {
    return text(`Not found: ${event.url.pathname}`, {
      status: 404
      // TODO in some cases this should be 500. not sure how to differentiate
    });
  }
  if (is_action_json_request(event)) {
    const node = await manifest2._.nodes[page2.leaf]();
    return handle_action_json_request(event, event_state, options2, node?.server);
  }
  try {
    const leaf_node = (
      /** @type {import('types').SSRNode} */
      nodes.page()
    );
    let status = 200;
    let action_result = void 0;
    if (is_action_request(event)) {
      const remote_id = get_remote_action(event.url);
      if (remote_id) {
        action_result = await handle_remote_form_post(event, event_state, manifest2, remote_id);
      } else {
        action_result = await handle_action_request(event, event_state, leaf_node.server);
      }
      if (action_result?.type === "redirect") {
        return redirect_response(action_result.status, action_result.location);
      }
      if (action_result?.type === "error") {
        status = get_status(action_result.error);
      }
      if (action_result?.type === "failure") {
        status = action_result.status;
      }
    }
    const should_prerender = nodes.prerender();
    if (should_prerender) {
      const mod = leaf_node.server;
      if (mod?.actions) {
        throw new Error("Cannot prerender pages with actions");
      }
    } else if (state2.prerendering) {
      return new Response(void 0, {
        status: 204
      });
    }
    state2.prerender_default = should_prerender;
    const should_prerender_data = nodes.should_prerender_data();
    const data_pathname = add_data_suffix2(event.url.pathname);
    const fetched = [];
    const ssr = nodes.ssr();
    const csr = nodes.csr();
    if (ssr === false && !(state2.prerendering && should_prerender_data)) {
      if (BROWSER && action_result && !event.request.headers.has("x-sveltekit-action")) ;
      return await render_response({
        branch: [],
        fetched,
        page_config: {
          ssr: false,
          csr
        },
        status,
        error: null,
        event,
        event_state,
        options: options2,
        manifest: manifest2,
        state: state2,
        resolve_opts,
        data_serializer: server_data_serializer(event, event_state, options2)
      });
    }
    const branch2 = [];
    let load_error = null;
    const data_serializer = server_data_serializer(event, event_state, options2);
    const data_serializer_json = state2.prerendering && should_prerender_data ? server_data_serializer_json(event, event_state, options2) : null;
    const server_promises = nodes.data.map((node, i) => {
      if (load_error) {
        throw load_error;
      }
      return Promise.resolve().then(async () => {
        try {
          if (node === leaf_node && action_result?.type === "error") {
            throw action_result.error;
          }
          const server_data = await load_server_data({
            event,
            event_state,
            state: state2,
            node,
            parent: /* @__PURE__ */ __name2(async () => {
              const data = {};
              for (let j = 0; j < i; j += 1) {
                const parent = await server_promises[j];
                if (parent) Object.assign(data, parent.data);
              }
              return data;
            }, "parent")
          });
          data_serializer.add_node(i, server_data);
          data_serializer_json?.add_node(i, server_data);
          return server_data;
        } catch (e3) {
          load_error = /** @type {Error} */
          e3;
          throw load_error;
        }
      });
    });
    const load_promises = nodes.data.map((node, i) => {
      if (load_error) throw load_error;
      return Promise.resolve().then(async () => {
        try {
          return await load_data({
            event,
            event_state,
            fetched,
            node,
            parent: /* @__PURE__ */ __name2(async () => {
              const data = {};
              for (let j = 0; j < i; j += 1) {
                Object.assign(data, await load_promises[j]);
              }
              return data;
            }, "parent"),
            resolve_opts,
            server_data_promise: server_promises[i],
            state: state2,
            csr
          });
        } catch (e3) {
          load_error = /** @type {Error} */
          e3;
          throw load_error;
        }
      });
    });
    for (const p of server_promises) p.catch(() => {
    });
    for (const p of load_promises) p.catch(() => {
    });
    for (let i = 0; i < nodes.data.length; i += 1) {
      const node = nodes.data[i];
      if (node) {
        try {
          const server_data = await server_promises[i];
          const data = await load_promises[i];
          branch2.push({ node, server_data, data });
        } catch (e3) {
          const err = normalize_error(e3);
          if (err instanceof Redirect) {
            if (state2.prerendering && should_prerender_data) {
              const body2 = JSON.stringify({
                type: "redirect",
                location: err.location
              });
              state2.prerendering.dependencies.set(data_pathname, {
                response: text(body2),
                body: body2
              });
            }
            return redirect_response(err.status, err.location);
          }
          const status2 = get_status(err);
          const error222 = await handle_error_and_jsonify(event, event_state, options2, err);
          while (i--) {
            if (page2.errors[i]) {
              const index4 = (
                /** @type {number} */
                page2.errors[i]
              );
              const node2 = await manifest2._.nodes[index4]();
              let j = i;
              while (!branch2[j]) j -= 1;
              const layouts = compact(branch2.slice(0, j + 1));
              const nodes2 = new PageNodes(layouts.map((layout) => layout.node));
              return await render_response({
                event,
                event_state,
                options: options2,
                manifest: manifest2,
                state: state2,
                resolve_opts,
                page_config: {
                  ssr: nodes2.ssr(),
                  csr: nodes2.csr()
                },
                status: status2,
                error: error222,
                branch: layouts.concat({
                  node: node2,
                  data: null,
                  server_data: null
                }),
                fetched,
                data_serializer: server_data_serializer(event, event_state, options2)
              });
            }
          }
          return static_error_page(options2, status2, error222.message);
        }
      } else {
        branch2.push(null);
      }
    }
    if (state2.prerendering && data_serializer_json) {
      let { data, chunks } = data_serializer_json.get_data();
      if (chunks) {
        for await (const chunk of chunks) {
          data += chunk;
        }
      }
      state2.prerendering.dependencies.set(data_pathname, {
        response: text(data),
        body: data
      });
    }
    return await render_response({
      event,
      event_state,
      options: options2,
      manifest: manifest2,
      state: state2,
      resolve_opts,
      page_config: {
        csr,
        ssr
      },
      status,
      error: null,
      branch: ssr === false ? [] : compact(branch2),
      action_result,
      fetched,
      data_serializer
    });
  } catch (e3) {
    return await respond_with_error({
      event,
      event_state,
      options: options2,
      manifest: manifest2,
      state: state2,
      status: 500,
      error: e3,
      resolve_opts
    });
  }
}
__name(render_page, "render_page");
__name2(render_page, "render_page");
function once22(fn) {
  let done = false;
  let result;
  return () => {
    if (done) return result;
    done = true;
    return result = fn();
  };
}
__name(once22, "once2");
__name2(once22, "once");
async function render_data(event, event_state, route, options2, manifest2, state2, invalidated_data_nodes, trailing_slash) {
  if (!route.page) {
    return new Response(void 0, {
      status: 404
    });
  }
  try {
    const node_ids = [...route.page.layouts, route.page.leaf];
    const invalidated = invalidated_data_nodes ?? node_ids.map(() => true);
    let aborted = false;
    const url = new URL(event.url);
    url.pathname = normalize_path(url.pathname, trailing_slash);
    const new_event = { ...event, url };
    const functions = node_ids.map((n2, i) => {
      return once22(async () => {
        try {
          if (aborted) {
            return (
              /** @type {import('types').ServerDataSkippedNode} */
              {
                type: "skip"
              }
            );
          }
          const node = n2 == void 0 ? n2 : await manifest2._.nodes[n2]();
          return load_server_data({
            event: new_event,
            event_state,
            state: state2,
            node,
            parent: /* @__PURE__ */ __name2(async () => {
              const data2 = {};
              for (let j = 0; j < i; j += 1) {
                const parent = (
                  /** @type {import('types').ServerDataNode | null} */
                  await functions[j]()
                );
                if (parent) {
                  Object.assign(data2, parent.data);
                }
              }
              return data2;
            }, "parent")
          });
        } catch (e3) {
          aborted = true;
          throw e3;
        }
      });
    });
    const promises = functions.map(async (fn, i) => {
      if (!invalidated[i]) {
        return (
          /** @type {import('types').ServerDataSkippedNode} */
          {
            type: "skip"
          }
        );
      }
      return fn();
    });
    let length = promises.length;
    const nodes = await Promise.all(
      promises.map(
        (p, i) => p.catch(async (error222) => {
          if (error222 instanceof Redirect) {
            throw error222;
          }
          length = Math.min(length, i + 1);
          return (
            /** @type {import('types').ServerErrorNode} */
            {
              type: "error",
              error: await handle_error_and_jsonify(event, event_state, options2, error222),
              status: error222 instanceof HttpError || error222 instanceof SvelteKitError ? error222.status : void 0
            }
          );
        })
      )
    );
    const data_serializer = server_data_serializer_json(event, event_state, options2);
    for (let i = 0; i < nodes.length; i++) data_serializer.add_node(i, nodes[i]);
    const { data, chunks } = data_serializer.get_data();
    if (!chunks) {
      return json_response(data);
    }
    return new Response(
      new ReadableStream({
        async start(controller2) {
          controller2.enqueue(text_encoder2.encode(data));
          for await (const chunk of chunks) {
            controller2.enqueue(text_encoder2.encode(chunk));
          }
          controller2.close();
        },
        type: "bytes"
      }),
      {
        headers: {
          // we use a proprietary content type to prevent buffering.
          // the `text` prefix makes it inspectable
          "content-type": "text/sveltekit-data",
          "cache-control": "private, no-store"
        }
      }
    );
  } catch (e3) {
    const error222 = normalize_error(e3);
    if (error222 instanceof Redirect) {
      return redirect_json_response(error222);
    } else {
      return json_response(await handle_error_and_jsonify(event, event_state, options2, error222), 500);
    }
  }
}
__name(render_data, "render_data");
__name2(render_data, "render_data");
function json_response(json2, status = 200) {
  return text(typeof json2 === "string" ? json2 : JSON.stringify(json2), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "private, no-store"
    }
  });
}
__name(json_response, "json_response");
__name2(json_response, "json_response");
function redirect_json_response(redirect) {
  return json_response(
    /** @type {import('types').ServerRedirectNode} */
    {
      type: "redirect",
      location: redirect.location
    }
  );
}
__name(redirect_json_response, "redirect_json_response");
__name2(redirect_json_response, "redirect_json_response");
var INVALID_COOKIE_CHARACTER_REGEX = /[\x00-\x1F\x7F()<>@,;:"/[\]?={} \t]/;
function validate_options(options2) {
  if (options2?.path === void 0) {
    throw new Error("You must specify a `path` when setting, deleting or serializing cookies");
  }
}
__name(validate_options, "validate_options");
__name2(validate_options, "validate_options");
function generate_cookie_key(domain22, path, name) {
  return `${domain22 || ""}${path}?${encodeURIComponent(name)}`;
}
__name(generate_cookie_key, "generate_cookie_key");
__name2(generate_cookie_key, "generate_cookie_key");
function get_cookies(request, url) {
  const header = request.headers.get("cookie") ?? "";
  const initial_cookies = (0, import_cookie.parse)(header, { decode: /* @__PURE__ */ __name2((value) => value, "decode") });
  let normalized_url;
  const new_cookies = /* @__PURE__ */ new Map();
  const defaults = {
    httpOnly: true,
    sameSite: "lax",
    secure: url.hostname === "localhost" && url.protocol === "http:" ? false : true
  };
  const cookies = {
    // The JSDoc param annotations appearing below for get, set and delete
    // are necessary to expose the `cookie` library types to
    // typescript users. `@type {import('@sveltejs/kit').Cookies}` above is not
    // sufficient to do so.
    /**
     * @param {string} name
     * @param {import('cookie').CookieParseOptions} [opts]
     */
    get(name, opts) {
      const best_match = Array.from(new_cookies.values()).filter((c2) => {
        return c2.name === name && domain_matches(url.hostname, c2.options.domain) && path_matches(url.pathname, c2.options.path);
      }).sort((a, b) => b.options.path.length - a.options.path.length)[0];
      if (best_match) {
        return best_match.options.maxAge === 0 ? void 0 : best_match.value;
      }
      const req_cookies = (0, import_cookie.parse)(header, { decode: opts?.decode });
      const cookie = req_cookies[name];
      return cookie;
    },
    /**
     * @param {import('cookie').CookieParseOptions} [opts]
     */
    getAll(opts) {
      const cookies2 = (0, import_cookie.parse)(header, { decode: opts?.decode });
      const lookup = /* @__PURE__ */ new Map();
      for (const c2 of new_cookies.values()) {
        if (domain_matches(url.hostname, c2.options.domain) && path_matches(url.pathname, c2.options.path)) {
          const existing = lookup.get(c2.name);
          if (!existing || c2.options.path.length > existing.options.path.length) {
            lookup.set(c2.name, c2);
          }
        }
      }
      for (const c2 of lookup.values()) {
        cookies2[c2.name] = c2.value;
      }
      return Object.entries(cookies2).map(([name, value]) => ({ name, value }));
    },
    /**
     * @param {string} name
     * @param {string} value
     * @param {import('./page/types.js').Cookie['options']} options
     */
    set(name, value, options2) {
      const illegal_characters = name.match(INVALID_COOKIE_CHARACTER_REGEX);
      if (illegal_characters) {
        console.warn(
          `The cookie name "${name}" will be invalid in SvelteKit 3.0 as it contains ${illegal_characters.join(
            " and "
          )}. See RFC 2616 for more details https://datatracker.ietf.org/doc/html/rfc2616#section-2.2`
        );
      }
      validate_options(options2);
      set_internal(name, value, { ...defaults, ...options2 });
    },
    /**
     * @param {string} name
     *  @param {import('./page/types.js').Cookie['options']} options
     */
    delete(name, options2) {
      validate_options(options2);
      cookies.set(name, "", { ...options2, maxAge: 0 });
    },
    /**
     * @param {string} name
     * @param {string} value
     *  @param {import('./page/types.js').Cookie['options']} options
     */
    serialize(name, value, options2) {
      validate_options(options2);
      let path = options2.path;
      if (!options2.domain || options2.domain === url.hostname) {
        if (!normalized_url) {
          throw new Error("Cannot serialize cookies until after the route is determined");
        }
        path = resolve(normalized_url, path);
      }
      return (0, import_cookie.serialize)(name, value, { ...defaults, ...options2, path });
    }
  };
  function get_cookie_header(destination, header2) {
    const combined_cookies = {
      // cookies sent by the user agent have lowest precedence
      ...initial_cookies
    };
    for (const cookie of new_cookies.values()) {
      if (!domain_matches(destination.hostname, cookie.options.domain)) continue;
      if (!path_matches(destination.pathname, cookie.options.path)) continue;
      const encoder = cookie.options.encode || encodeURIComponent;
      combined_cookies[cookie.name] = encoder(cookie.value);
    }
    if (header2) {
      const parsed = (0, import_cookie.parse)(header2, { decode: /* @__PURE__ */ __name2((value) => value, "decode") });
      for (const name in parsed) {
        combined_cookies[name] = parsed[name];
      }
    }
    return Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
  }
  __name(get_cookie_header, "get_cookie_header");
  __name2(get_cookie_header, "get_cookie_header");
  const internal_queue = [];
  function set_internal(name, value, options2) {
    if (!normalized_url) {
      internal_queue.push(() => set_internal(name, value, options2));
      return;
    }
    let path = options2.path;
    if (!options2.domain || options2.domain === url.hostname) {
      path = resolve(normalized_url, path);
    }
    const cookie_key = generate_cookie_key(options2.domain, path, name);
    const cookie = { name, value, options: { ...options2, path } };
    new_cookies.set(cookie_key, cookie);
  }
  __name(set_internal, "set_internal");
  __name2(set_internal, "set_internal");
  function set_trailing_slash(trailing_slash) {
    normalized_url = normalize_path(url.pathname, trailing_slash);
    internal_queue.forEach((fn) => fn());
  }
  __name(set_trailing_slash, "set_trailing_slash");
  __name2(set_trailing_slash, "set_trailing_slash");
  return { cookies, new_cookies, get_cookie_header, set_internal, set_trailing_slash };
}
__name(get_cookies, "get_cookies");
__name2(get_cookies, "get_cookies");
function domain_matches(hostname, constraint) {
  if (!constraint) return true;
  const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
  if (hostname === normalized) return true;
  return hostname.endsWith("." + normalized);
}
__name(domain_matches, "domain_matches");
__name2(domain_matches, "domain_matches");
function path_matches(path, constraint) {
  if (!constraint) return true;
  const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
  if (path === normalized) return true;
  return path.startsWith(normalized + "/");
}
__name(path_matches, "path_matches");
__name2(path_matches, "path_matches");
function add_cookies_to_headers(headers2, cookies) {
  for (const new_cookie of cookies) {
    const { name, value, options: options2 } = new_cookie;
    headers2.append("set-cookie", (0, import_cookie.serialize)(name, value, options2));
    if (options2.path.endsWith(".html")) {
      const path = add_data_suffix2(options2.path);
      headers2.append("set-cookie", (0, import_cookie.serialize)(name, value, { ...options2, path }));
    }
  }
}
__name(add_cookies_to_headers, "add_cookies_to_headers");
__name2(add_cookies_to_headers, "add_cookies_to_headers");
function create_fetch({ event, options: options2, manifest: manifest2, state: state2, get_cookie_header, set_internal }) {
  const server_fetch = /* @__PURE__ */ __name2(async (info32, init2) => {
    const original_request = normalize_fetch_input(info32, init2, event.url);
    let mode = (info32 instanceof Request ? info32.mode : init2?.mode) ?? "cors";
    let credentials = (info32 instanceof Request ? info32.credentials : init2?.credentials) ?? "same-origin";
    return options2.hooks.handleFetch({
      event,
      request: original_request,
      fetch: /* @__PURE__ */ __name2(async (info222, init3) => {
        const request = normalize_fetch_input(info222, init3, event.url);
        const url = new URL(request.url);
        if (!request.headers.has("origin")) {
          request.headers.set("origin", event.url.origin);
        }
        if (info222 !== original_request) {
          mode = (info222 instanceof Request ? info222.mode : init3?.mode) ?? "cors";
          credentials = (info222 instanceof Request ? info222.credentials : init3?.credentials) ?? "same-origin";
        }
        if ((request.method === "GET" || request.method === "HEAD") && (mode === "no-cors" && url.origin !== event.url.origin || url.origin === event.url.origin)) {
          request.headers.delete("origin");
        }
        if (url.origin !== event.url.origin) {
          if (`.${url.hostname}`.endsWith(`.${event.url.hostname}`) && credentials !== "omit") {
            const cookie = get_cookie_header(url, request.headers.get("cookie"));
            if (cookie) request.headers.set("cookie", cookie);
          }
          return fetch(request);
        }
        const prefix = assets || base;
        const decoded = decodeURIComponent(url.pathname);
        const filename = (decoded.startsWith(prefix) ? decoded.slice(prefix.length) : decoded).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = manifest2.assets.has(filename) || filename in manifest2._.server_assets;
        const is_asset_html = manifest2.assets.has(filename_html) || filename_html in manifest2._.server_assets;
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (state2.read) {
            const type = is_asset ? manifest2.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            return new Response(state2.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          } else if (read_implementation && file in manifest2._.server_assets) {
            const length = manifest2._.server_assets[file];
            const type = manifest2.mimeTypes[file.slice(file.lastIndexOf("."))];
            return new Response(read_implementation(file), {
              headers: {
                "Content-Length": "" + length,
                "Content-Type": type
              }
            });
          }
          return await fetch(request);
        }
        if (has_prerendered_path(manifest2, base + decoded)) {
          return await fetch(request);
        }
        if (credentials !== "omit") {
          const cookie = get_cookie_header(url, request.headers.get("cookie"));
          if (cookie) {
            request.headers.set("cookie", cookie);
          }
          const authorization = event.request.headers.get("authorization");
          if (authorization && !request.headers.has("authorization")) {
            request.headers.set("authorization", authorization);
          }
        }
        if (!request.headers.has("accept")) {
          request.headers.set("accept", "*/*");
        }
        if (!request.headers.has("accept-language")) {
          request.headers.set(
            "accept-language",
            /** @type {string} */
            event.request.headers.get("accept-language")
          );
        }
        const response = await internal_fetch(request, options2, manifest2, state2);
        const set_cookie = response.headers.get("set-cookie");
        if (set_cookie) {
          for (const str of set_cookie_parser.splitCookiesString(set_cookie)) {
            const { name, value, ...options3 } = set_cookie_parser.parseString(str, {
              decodeValues: false
            });
            const path = options3.path ?? (url.pathname.split("/").slice(0, -1).join("/") || "/");
            set_internal(name, value, {
              path,
              encode: /* @__PURE__ */ __name2((value2) => value2, "encode"),
              .../** @type {import('cookie').CookieSerializeOptions} */
              options3
            });
          }
        }
        return response;
      }, "fetch")
    });
  }, "server_fetch");
  return (input, init2) => {
    const response = server_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
__name(create_fetch, "create_fetch");
__name2(create_fetch, "create_fetch");
function normalize_fetch_input(info32, init2, url) {
  if (info32 instanceof Request) {
    return info32;
  }
  return new Request(typeof info32 === "string" ? new URL(info32, url) : info32, init2);
}
__name(normalize_fetch_input, "normalize_fetch_input");
__name2(normalize_fetch_input, "normalize_fetch_input");
async function internal_fetch(request, options2, manifest2, state2) {
  if (request.signal) {
    if (request.signal.aborted) {
      throw new DOMException("The operation was aborted.", "AbortError");
    }
    let remove_abort_listener = /* @__PURE__ */ __name2(() => {
    }, "remove_abort_listener");
    const abort_promise = new Promise((_, reject) => {
      const on_abort = /* @__PURE__ */ __name2(() => {
        reject(new DOMException("The operation was aborted.", "AbortError"));
      }, "on_abort");
      request.signal.addEventListener("abort", on_abort, { once: true });
      remove_abort_listener = /* @__PURE__ */ __name2(() => request.signal.removeEventListener("abort", on_abort), "remove_abort_listener");
    });
    const result = await Promise.race([
      respond(request, options2, manifest2, {
        ...state2,
        depth: state2.depth + 1
      }),
      abort_promise
    ]);
    remove_abort_listener();
    return result;
  } else {
    return await respond(request, options2, manifest2, {
      ...state2,
      depth: state2.depth + 1
    });
  }
}
__name(internal_fetch, "internal_fetch");
__name2(internal_fetch, "internal_fetch");
var body;
var etag;
var headers;
function get_public_env(request) {
  body ??= `export const env=${JSON.stringify(public_env)}`;
  etag ??= `W/${Date.now()}`;
  headers ??= new Headers({
    "content-type": "application/javascript; charset=utf-8",
    etag
  });
  if (request.headers.get("if-none-match") === etag) {
    return new Response(void 0, { status: 304, headers });
  }
  return new Response(body, { headers });
}
__name(get_public_env, "get_public_env");
__name2(get_public_env, "get_public_env");
var default_transform = /* @__PURE__ */ __name2(({ html }) => html, "default_transform");
var default_filter = /* @__PURE__ */ __name2(() => false, "default_filter");
var default_preload = /* @__PURE__ */ __name2(({ type }) => type === "js" || type === "css", "default_preload");
var page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "POST"]);
var allowed_page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "OPTIONS"]);
var respond = propagate_context(internal_respond);
async function internal_respond(request, options2, manifest2, state2) {
  const url = new URL(request.url);
  const is_route_resolution_request = has_resolution_suffix2(url.pathname);
  const is_data_request = has_data_suffix2(url.pathname);
  const remote_id = get_remote_id(url);
  {
    const request_origin = request.headers.get("origin");
    if (remote_id) {
      if (request.method !== "GET" && request_origin !== url.origin) {
        const message = "Cross-site remote requests are forbidden";
        return json({ message }, { status: 403 });
      }
    } else if (options2.csrf_check_origin) {
      const forbidden = is_form_content_type(request) && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH" || request.method === "DELETE") && request_origin !== url.origin && (!request_origin || !options2.csrf_trusted_origins.includes(request_origin));
      if (forbidden) {
        const message = `Cross-site ${request.method} form submissions are forbidden`;
        const opts = { status: 403 };
        if (request.headers.get("accept") === "application/json") {
          return json({ message }, opts);
        }
        return text(message, opts);
      }
    }
  }
  if (options2.hash_routing && url.pathname !== base + "/" && url.pathname !== "/[fallback]") {
    return text("Not found", { status: 404 });
  }
  let invalidated_data_nodes;
  if (is_route_resolution_request) {
    url.pathname = strip_resolution_suffix2(url.pathname);
  } else if (is_data_request) {
    url.pathname = strip_data_suffix2(url.pathname) + (url.searchParams.get(TRAILING_SLASH_PARAM) === "1" ? "/" : "") || "/";
    url.searchParams.delete(TRAILING_SLASH_PARAM);
    invalidated_data_nodes = url.searchParams.get(INVALIDATED_PARAM)?.split("").map((node) => node === "1");
    url.searchParams.delete(INVALIDATED_PARAM);
  } else if (remote_id) {
    url.pathname = base;
    url.search = "";
  }
  const headers2 = {};
  const { cookies, new_cookies, get_cookie_header, set_internal, set_trailing_slash } = get_cookies(
    request,
    url
  );
  const event_state = {
    prerendering: state2.prerendering,
    transport: options2.hooks.transport,
    handleValidationError: options2.hooks.handleValidationError,
    tracing: {
      record_span
    }
  };
  const event = {
    cookies,
    // @ts-expect-error `fetch` needs to be created after the `event` itself
    fetch: null,
    getClientAddress: state2.getClientAddress || (() => {
      throw new Error(
        `${"@sveltejs/adapter-cloudflare"} does not specify getClientAddress. Please raise an issue`
      );
    }),
    locals: {},
    params: {},
    platform: state2.platform,
    request,
    route: { id: null },
    setHeaders: /* @__PURE__ */ __name2((new_headers) => {
      for (const key2 in new_headers) {
        const lower = key2.toLowerCase();
        const value = new_headers[key2];
        if (lower === "set-cookie") {
          throw new Error(
            "Use `event.cookies.set(name, value, options)` instead of `event.setHeaders` to set cookies"
          );
        } else if (lower in headers2) {
          throw new Error(`"${key2}" header is already set`);
        } else {
          headers2[lower] = value;
          if (state2.prerendering && lower === "cache-control") {
            state2.prerendering.cache = /** @type {string} */
            value;
          }
        }
      }
    }, "setHeaders"),
    url,
    isDataRequest: is_data_request,
    isSubRequest: state2.depth > 0,
    isRemoteRequest: !!remote_id
  };
  event.fetch = create_fetch({
    event,
    options: options2,
    manifest: manifest2,
    state: state2,
    get_cookie_header,
    set_internal
  });
  if (state2.emulator?.platform) {
    event.platform = await state2.emulator.platform({
      config: {},
      prerender: !!state2.prerendering?.fallback
    });
  }
  let resolved_path = url.pathname;
  if (!remote_id) {
    const prerendering_reroute_state = state2.prerendering?.inside_reroute;
    try {
      if (state2.prerendering) state2.prerendering.inside_reroute = true;
      resolved_path = await options2.hooks.reroute({ url: new URL(url), fetch: event.fetch }) ?? url.pathname;
    } catch {
      return text("Internal Server Error", {
        status: 500
      });
    } finally {
      if (state2.prerendering) state2.prerendering.inside_reroute = prerendering_reroute_state;
    }
  }
  try {
    resolved_path = decode_pathname(resolved_path);
  } catch {
    return text("Malformed URI", { status: 400 });
  }
  if (resolved_path !== url.pathname && !state2.prerendering?.fallback && has_prerendered_path(manifest2, resolved_path)) {
    const url2 = new URL(request.url);
    url2.pathname = is_data_request ? add_data_suffix2(resolved_path) : is_route_resolution_request ? add_resolution_suffix2(resolved_path) : resolved_path;
    const response = await fetch(url2, request);
    const headers22 = new Headers(response.headers);
    if (headers22.has("content-encoding")) {
      headers22.delete("content-encoding");
      headers22.delete("content-length");
    }
    return new Response(response.body, {
      headers: headers22,
      status: response.status,
      statusText: response.statusText
    });
  }
  let route = null;
  if (base && !state2.prerendering?.fallback) {
    if (!resolved_path.startsWith(base)) {
      return text("Not found", { status: 404 });
    }
    resolved_path = resolved_path.slice(base.length) || "/";
  }
  if (is_route_resolution_request) {
    return resolve_route(resolved_path, new URL(request.url), manifest2);
  }
  if (resolved_path === `/${app_dir}/env.js`) {
    return get_public_env(request);
  }
  if (!remote_id && resolved_path.startsWith(`/${app_dir}`)) {
    const headers22 = new Headers();
    headers22.set("cache-control", "public, max-age=0, must-revalidate");
    return text("Not found", { status: 404, headers: headers22 });
  }
  if (!state2.prerendering?.fallback && !remote_id) {
    const matchers = await manifest2._.matchers();
    for (const candidate of manifest2._.routes) {
      const match = candidate.pattern.exec(resolved_path);
      if (!match) continue;
      const matched = exec(match, candidate.params, matchers);
      if (matched) {
        route = candidate;
        event.route = { id: route.id };
        event.params = decode_params(matched);
        break;
      }
    }
  }
  let resolve_opts = {
    transformPageChunk: default_transform,
    filterSerializedResponseHeaders: default_filter,
    preload: default_preload
  };
  let trailing_slash = "never";
  try {
    const page_nodes = route?.page ? new PageNodes(await load_page_nodes(route.page, manifest2)) : void 0;
    if (route) {
      if (url.pathname === base || url.pathname === base + "/") {
        trailing_slash = "always";
      } else if (page_nodes) {
        if (BROWSER) ;
        trailing_slash = page_nodes.trailing_slash();
      } else if (route.endpoint) {
        const node = await route.endpoint();
        trailing_slash = node.trailingSlash ?? "never";
        if (BROWSER) ;
      }
      if (!is_data_request) {
        const normalized = normalize_path(url.pathname, trailing_slash);
        if (normalized !== url.pathname && !state2.prerendering?.fallback) {
          return new Response(void 0, {
            status: 308,
            headers: {
              "x-sveltekit-normalize": "1",
              location: (
                // ensure paths starting with '//' are not treated as protocol-relative
                (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
              )
            }
          });
        }
      }
      if (state2.before_handle || state2.emulator?.platform) {
        let config22 = {};
        let prerender = false;
        if (route.endpoint) {
          const node = await route.endpoint();
          config22 = node.config ?? config22;
          prerender = node.prerender ?? prerender;
        } else if (page_nodes) {
          config22 = page_nodes.get_config() ?? config22;
          prerender = page_nodes.prerender();
        }
        if (state2.before_handle) {
          state2.before_handle(event, config22, prerender);
        }
        if (state2.emulator?.platform) {
          event.platform = await state2.emulator.platform({ config: config22, prerender });
        }
      }
    }
    set_trailing_slash(trailing_slash);
    if (state2.prerendering && !state2.prerendering.fallback && !state2.prerendering.inside_reroute) {
      disable_search(url);
    }
    const response = await record_span({
      name: "sveltekit.handle.root",
      attributes: {
        "http.route": event.route.id || "unknown",
        "http.method": event.request.method,
        "http.url": event.url.href,
        "sveltekit.is_data_request": is_data_request,
        "sveltekit.is_sub_request": event.isSubRequest
      },
      fn: /* @__PURE__ */ __name2(async (root_span) => {
        const traced_event = {
          ...event,
          tracing: {
            enabled: false,
            root: root_span,
            current: root_span
          }
        };
        return await with_request_store(
          { event: traced_event, state: event_state },
          () => options2.hooks.handle({
            event: traced_event,
            resolve: /* @__PURE__ */ __name2((event2, opts) => {
              return record_span({
                name: "sveltekit.resolve",
                attributes: {
                  "http.route": event2.route.id || "unknown"
                },
                fn: /* @__PURE__ */ __name2((resolve_span) => {
                  return with_request_store(
                    null,
                    () => resolve2(merge_tracing(event2, resolve_span), page_nodes, opts).then(
                      (response2) => {
                        for (const key2 in headers2) {
                          const value = headers2[key2];
                          response2.headers.set(
                            key2,
                            /** @type {string} */
                            value
                          );
                        }
                        add_cookies_to_headers(response2.headers, new_cookies.values());
                        if (state2.prerendering && event2.route.id !== null) {
                          response2.headers.set("x-sveltekit-routeid", encodeURI(event2.route.id));
                        }
                        resolve_span.setAttributes({
                          "http.response.status_code": response2.status,
                          "http.response.body.size": response2.headers.get("content-length") || "unknown"
                        });
                        return response2;
                      }
                    )
                  );
                }, "fn")
              });
            }, "resolve")
          })
        );
      }, "fn")
    });
    if (response.status === 200 && response.headers.has("etag")) {
      let if_none_match_value = request.headers.get("if-none-match");
      if (if_none_match_value?.startsWith('W/"')) {
        if_none_match_value = if_none_match_value.substring(2);
      }
      const etag2 = (
        /** @type {string} */
        response.headers.get("etag")
      );
      if (if_none_match_value === etag2) {
        const headers22 = new Headers({ etag: etag2 });
        for (const key2 of [
          "cache-control",
          "content-location",
          "date",
          "expires",
          "vary",
          "set-cookie"
        ]) {
          const value = response.headers.get(key2);
          if (value) headers22.set(key2, value);
        }
        return new Response(void 0, {
          status: 304,
          headers: headers22
        });
      }
    }
    if (is_data_request && response.status >= 300 && response.status <= 308) {
      const location = response.headers.get("location");
      if (location) {
        return redirect_json_response(new Redirect(
          /** @type {any} */
          response.status,
          location
        ));
      }
    }
    return response;
  } catch (e3) {
    if (e3 instanceof Redirect) {
      const response = is_data_request ? redirect_json_response(e3) : route?.page && is_action_json_request(event) ? action_json_redirect(e3) : redirect_response(e3.status, e3.location);
      add_cookies_to_headers(response.headers, new_cookies.values());
      return response;
    }
    return await handle_fatal_error(event, event_state, options2, e3);
  }
  async function resolve2(event2, page_nodes, opts) {
    try {
      if (opts) {
        resolve_opts = {
          transformPageChunk: opts.transformPageChunk || default_transform,
          filterSerializedResponseHeaders: opts.filterSerializedResponseHeaders || default_filter,
          preload: opts.preload || default_preload
        };
      }
      if (options2.hash_routing || state2.prerendering?.fallback) {
        return await render_response({
          event: event2,
          event_state,
          options: options2,
          manifest: manifest2,
          state: state2,
          page_config: { ssr: false, csr: true },
          status: 200,
          error: null,
          branch: [],
          fetched: [],
          resolve_opts,
          data_serializer: server_data_serializer(event2, event_state, options2)
        });
      }
      if (remote_id) {
        return await handle_remote_call(event2, event_state, options2, manifest2, remote_id);
      }
      if (route) {
        const method = (
          /** @type {import('types').HttpMethod} */
          event2.request.method
        );
        let response2;
        if (is_data_request) {
          response2 = await render_data(
            event2,
            event_state,
            route,
            options2,
            manifest2,
            state2,
            invalidated_data_nodes,
            trailing_slash
          );
        } else if (route.endpoint && (!route.page || is_endpoint_request(event2))) {
          response2 = await render_endpoint(event2, event_state, await route.endpoint(), state2);
        } else if (route.page) {
          if (!page_nodes) {
            throw new Error("page_nodes not found. This should never happen");
          } else if (page_methods.has(method)) {
            response2 = await render_page(
              event2,
              event_state,
              route.page,
              options2,
              manifest2,
              state2,
              page_nodes,
              resolve_opts
            );
          } else {
            const allowed_methods2 = new Set(allowed_page_methods);
            const node = await manifest2._.nodes[route.page.leaf]();
            if (node?.server?.actions) {
              allowed_methods2.add("POST");
            }
            if (method === "OPTIONS") {
              response2 = new Response(null, {
                status: 204,
                headers: {
                  allow: Array.from(allowed_methods2.values()).join(", ")
                }
              });
            } else {
              const mod = [...allowed_methods2].reduce(
                (acc, curr) => {
                  acc[curr] = true;
                  return acc;
                },
                /** @type {Record<string, any>} */
                {}
              );
              response2 = method_not_allowed(mod, method);
            }
          }
        } else {
          throw new Error("Route is neither page nor endpoint. This should never happen");
        }
        if (request.method === "GET" && route.page && route.endpoint) {
          const vary = response2.headers.get("vary")?.split(",")?.map((v) => v.trim().toLowerCase());
          if (!(vary?.includes("accept") || vary?.includes("*"))) {
            response2 = new Response(response2.body, {
              status: response2.status,
              statusText: response2.statusText,
              headers: new Headers(response2.headers)
            });
            response2.headers.append("Vary", "Accept");
          }
        }
        return response2;
      }
      if (state2.error && event2.isSubRequest) {
        const headers22 = new Headers(request.headers);
        headers22.set("x-sveltekit-error", "true");
        return await fetch(request, { headers: headers22 });
      }
      if (state2.error) {
        return text("Internal Server Error", {
          status: 500
        });
      }
      if (state2.depth === 0) {
        if (BROWSER && event2.url.pathname === "/.well-known/appspecific/com.chrome.devtools.json") ;
        return await respond_with_error({
          event: event2,
          event_state,
          options: options2,
          manifest: manifest2,
          state: state2,
          status: 404,
          error: new SvelteKitError(404, "Not Found", `Not found: ${event2.url.pathname}`),
          resolve_opts
        });
      }
      if (state2.prerendering) {
        return text("not found", { status: 404 });
      }
      const response = await fetch(request);
      return new Response(response.body, response);
    } catch (e3) {
      return await handle_fatal_error(event2, event_state, options2, e3);
    } finally {
      event2.cookies.set = () => {
        throw new Error("Cannot use `cookies.set(...)` after the response has been generated");
      };
      event2.setHeaders = () => {
        throw new Error("Cannot use `setHeaders(...)` after the response has been generated");
      };
    }
  }
  __name(resolve2, "resolve2");
  __name2(resolve2, "resolve2");
}
__name(internal_respond, "internal_respond");
__name2(internal_respond, "internal_respond");
function load_page_nodes(page2, manifest2) {
  return Promise.all([
    // we use == here rather than === because [undefined] serializes as "[null]"
    ...page2.layouts.map((n2) => n2 == void 0 ? n2 : manifest2._.nodes[n2]()),
    manifest2._.nodes[page2.leaf]()
  ]);
}
__name(load_page_nodes, "load_page_nodes");
__name2(load_page_nodes, "load_page_nodes");
function propagate_context(fn) {
  return async (req, ...rest) => {
    {
      return fn(req, ...rest);
    }
  };
}
__name(propagate_context, "propagate_context");
__name2(propagate_context, "propagate_context");
function filter_env(env32, allowed, disallowed) {
  return Object.fromEntries(
    Object.entries(env32).filter(
      ([k]) => k.startsWith(allowed) && (disallowed === "" || !k.startsWith(disallowed))
    )
  );
}
__name(filter_env, "filter_env");
__name2(filter_env, "filter_env");
function set_app(value) {
}
__name(set_app, "set_app");
__name2(set_app, "set_app");
var init_promise;
var Server = class {
  static {
    __name(this, "Server");
  }
  static {
    __name2(this, "Server");
  }
  /** @type {import('types').SSROptions} */
  #options;
  /** @type {import('@sveltejs/kit').SSRManifest} */
  #manifest;
  /** @param {import('@sveltejs/kit').SSRManifest} manifest */
  constructor(manifest2) {
    this.#options = options;
    this.#manifest = manifest2;
  }
  /**
   * @param {import('@sveltejs/kit').ServerInitOptions} opts
   */
  async init({ env: env32, read }) {
    const { env_public_prefix, env_private_prefix } = this.#options;
    set_private_env(filter_env(env32, env_private_prefix, env_public_prefix));
    set_public_env(filter_env(env32, env_public_prefix, env_private_prefix));
    if (read) {
      const wrapped_read = /* @__PURE__ */ __name2((file) => {
        const result = read(file);
        if (result instanceof ReadableStream) {
          return result;
        } else {
          return new ReadableStream({
            async start(controller2) {
              try {
                const stream = await Promise.resolve(result);
                if (!stream) {
                  controller2.close();
                  return;
                }
                const reader = stream.getReader();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  controller2.enqueue(value);
                }
                controller2.close();
              } catch (error222) {
                controller2.error(error222);
              }
            }
          });
        }
      }, "wrapped_read");
      set_read_implementation(wrapped_read);
    }
    await (init_promise ??= (async () => {
      try {
        const module = await get_hooks();
        this.#options.hooks = {
          handle: module.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
          handleError: module.handleError || (({ status, error: error222, event }) => {
            const error_message = format_server_error(
              status,
              /** @type {Error} */
              error222,
              event
            );
            console.error(error_message);
          }),
          handleFetch: module.handleFetch || (({ request, fetch: fetch2 }) => fetch2(request)),
          handleValidationError: module.handleValidationError || (({ issues }) => {
            console.error("Remote function schema validation failed:", issues);
            return { message: "Bad Request" };
          }),
          reroute: module.reroute || (() => {
          }),
          transport: module.transport || {}
        };
        set_app({
          decoders: module.transport ? Object.fromEntries(Object.entries(module.transport).map(([k, v]) => [k, v.decode])) : {}
        });
        if (module.init) {
          await module.init();
        }
      } catch (e3) {
        {
          throw e3;
        }
      }
    })());
  }
  /**
   * @param {Request} request
   * @param {import('types').RequestOptions} options
   */
  async respond(request, options2) {
    return respond(request, this.#options, this.#manifest, {
      ...options2,
      error: false,
      depth: 0
    });
  }
};
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var manifest = (() => {
  function __memo(fn) {
    let value;
    return () => value ??= value = fn();
  }
  __name(__memo, "__memo");
  __name2(__memo, "__memo");
  return {
    appDir: "_app",
    appPath: "_app",
    assets: /* @__PURE__ */ new Set([]),
    mimeTypes: {},
    _: {
      client: { start: "_app/immutable/entry/start.-Ti0pwin.js", app: "_app/immutable/entry/app.952MQrS5.js", imports: ["_app/immutable/entry/start.-Ti0pwin.js", "_app/immutable/chunks/CDd9afVY.js", "_app/immutable/chunks/BEwx_mex.js", "_app/immutable/chunks/DqNh6aJv.js", "_app/immutable/chunks/Dm3dlnA8.js", "_app/immutable/entry/app.952MQrS5.js", "_app/immutable/chunks/D9Z9MdNV.js", "_app/immutable/chunks/DqNh6aJv.js", "_app/immutable/chunks/Dm3dlnA8.js", "_app/immutable/chunks/DsnmJJEf.js", "_app/immutable/chunks/BEwx_mex.js", "_app/immutable/chunks/C0ocGBUW.js", "_app/immutable/chunks/BMaqqeRe.js", "_app/immutable/chunks/CVgM_pso.js"], stylesheets: [], fonts: [], uses_env_dynamic_public: false },
      nodes: [
        __memo(() => Promise.resolve().then(() => (init__(), __exports))),
        __memo(() => Promise.resolve().then(() => (init__2(), __exports2))),
        __memo(() => Promise.resolve().then(() => (init__3(), __exports3)))
      ],
      remotes: {},
      routes: [
        {
          id: "/admin",
          pattern: /^\/admin\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 2 },
          endpoint: null
        },
        {
          id: "/api/debug",
          pattern: /^\/api\/debug\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server(), server_exports)))
        },
        {
          id: "/api/model",
          pattern: /^\/api\/model\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server2(), server_exports2)))
        },
        {
          id: "/api/upload",
          pattern: /^\/api\/upload\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server_ts(), server_ts_exports)))
        }
      ],
      prerendered_routes: /* @__PURE__ */ new Set(["/", "/labels"]),
      matchers: /* @__PURE__ */ __name2(async () => {
        return {};
      }, "matchers"),
      server_assets: {}
    }
  };
})();
var prerendered = /* @__PURE__ */ new Set(["/", "/labels"]);
var base_path = "";
async function e(e3, t2) {
  let n2 = "string" != typeof t2 && "HEAD" === t2.method;
  n2 && (t2 = new Request(t2, { method: "GET" }));
  let r3 = await e3.match(t2);
  return n2 && r3 && (r3 = new Response(null, r3)), r3;
}
__name(e, "e");
__name2(e, "e");
function t(e3, t2, n2, o2) {
  return ("string" == typeof t2 || "GET" === t2.method) && r(n2) && (n2.headers.has("Set-Cookie") && (n2 = new Response(n2.body, n2)).headers.append("Cache-Control", "private=Set-Cookie"), o2.waitUntil(e3.put(t2, n2.clone()))), n2;
}
__name(t, "t");
__name2(t, "t");
var n = /* @__PURE__ */ new Set([200, 203, 204, 300, 301, 404, 405, 410, 414, 501]);
function r(e3) {
  if (!n.has(e3.status)) return false;
  if (~(e3.headers.get("Vary") || "").indexOf("*")) return false;
  let t2 = e3.headers.get("Cache-Control") || "";
  return !/(private|no-cache|no-store)/i.test(t2);
}
__name(r, "r");
__name2(r, "r");
function o(n2) {
  return async function(r3, o2) {
    let a = await e(n2, r3);
    if (a) return a;
    o2.defer((e3) => {
      t(n2, r3, e3, o2);
    });
  };
}
__name(o, "o");
__name2(o, "o");
var s2 = caches.default;
var c = t.bind(0, s2);
var r2 = e.bind(0, s2);
var e2 = o.bind(0, s2);
var server = new Server(manifest);
var app_path = `/${manifest.appPath}`;
var immutable = `${app_path}/immutable/`;
var version_file = `${app_path}/version.json`;
var origin;
var initialized = server.init({
  // @ts-expect-error env contains environment variables and bindings
  env: env2,
  read: /* @__PURE__ */ __name2(async (file) => {
    const url = `${origin}/${file}`;
    const response = await /** @type {{ ASSETS: { fetch: typeof fetch } }} */
    env2.ASSETS.fetch(
      url
    );
    if (!response.ok) {
      throw new Error(
        `read(...) failed: could not fetch ${url} (${response.status} ${response.statusText})`
      );
    }
    return response.body;
  }, "read")
});
var worker_default = {
  /**
   * @param {Request} req
   * @param {{ ASSETS: { fetch: typeof fetch } }} env
   * @param {ExecutionContext} ctx
   * @returns {Promise<Response>}
   */
  async fetch(req, env22, ctx) {
    if (!origin) {
      origin = new URL(req.url).origin;
      await initialized;
    }
    let pragma = req.headers.get("cache-control") || "";
    let res = !pragma.includes("no-cache") && await r2(req);
    if (res) return res;
    let { pathname, search } = new URL(req.url);
    try {
      pathname = decodeURIComponent(pathname);
    } catch {
    }
    const stripped_pathname = pathname.replace(/\/$/, "");
    let is_static_asset = false;
    const filename = stripped_pathname.slice(base_path.length + 1);
    if (filename) {
      is_static_asset = manifest.assets.has(filename) || manifest.assets.has(filename + "/index.html") || filename in manifest._.server_assets || filename + "/index.html" in manifest._.server_assets;
    }
    let location = pathname.at(-1) === "/" ? stripped_pathname : pathname + "/";
    if (is_static_asset || prerendered.has(pathname) || pathname === version_file || pathname.startsWith(immutable)) {
      res = await env22.ASSETS.fetch(req);
    } else if (location && prerendered.has(location)) {
      if (search) location += search;
      res = new Response("", {
        status: 308,
        headers: {
          location
        }
      });
    } else {
      res = await server.respond(req, {
        platform: {
          env: env22,
          ctx,
          context: ctx,
          // deprecated in favor of ctx
          // @ts-expect-error webworker types from worktop are not compatible with Cloudflare Workers types
          caches,
          // @ts-expect-error the type is correct but ts is confused because platform.cf uses the type from index.ts while req.cf uses the type from index.d.ts
          cf: req.cf
        },
        getClientAddress() {
          return (
            /** @type {string} */
            req.headers.get("cf-connecting-ip")
          );
        }
      });
    }
    pragma = res.headers.get("cache-control") || "";
    return pragma && res.status < 400 ? c(req, res, ctx) : res;
  }
};
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name2(async (request, env32, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env32);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e3) {
      console.error("Failed to drain the unused request body.", e3);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e3) {
  return {
    name: e3?.name,
    message: e3?.message ?? String(e3),
    stack: e3?.stack,
    cause: e3?.cause === void 0 ? void 0 : reduceError(e3.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env32, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env32);
  } catch (e3) {
    const error4 = reduceError(e3);
    return Response.json(error4, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env32, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env32, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env32, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env32, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env32, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env32, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env32, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller2 = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller2, env32, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env32, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env32, ctx) => {
      this.env = env32;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller2 = new __Facade_ScheduledController__(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller2);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// node_modules/wrangler/templates/pages-dev-util.ts
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
__name(isRoutingRuleMatch, "isRoutingRuleMatch");
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}
__name(transformRoutingRuleToRegExp, "transformRoutingRuleToRegExp");

// .wrangler/tmp/pages-dsDAQZ/nogxmax1so.js
var define_ROUTES_default = {
  version: 1,
  description: "Generated by @sveltejs/adapter-cloudflare",
  include: [
    "/*"
  ],
  exclude: [
    "/_app/immutable/*",
    "/_app/version.json",
    "/",
    "/labels"
  ]
};
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env4, context3) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env4.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = middleware_loader_entry_default;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env4, context3);
      }
    }
    return env4.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env4, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env4);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e3) {
      console.error("Failed to drain the unused request body.", e3);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e3) {
  return {
    name: e3?.name,
    message: e3?.message ?? String(e3),
    stack: e3?.stack,
    cause: e3?.cause === void 0 ? void 0 : reduceError2(e3.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env4, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env4);
  } catch (e3) {
    const error4 = reduceError2(e3);
    return Response.json(error4, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-vxuAFS/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = pages_dev_pipeline_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env4, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env4, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env4, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env4, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-vxuAFS/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env4, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env4, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env4, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller2 = new __Facade_ScheduledController__2(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller2, env4, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env4, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env4, ctx) => {
      this.env = env4;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller2 = new __Facade_ScheduledController__2(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller2);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=nogxmax1so.js.map
