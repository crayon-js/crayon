"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var chalk = require("chalk");
var ansiColors = require("ansi-colors");
var kleur = require("kleur");
var crayon = require("crayon.js");
var benchSettings = {
    iterations: 1000,
    repeats: 100
};
var Bench = /** @class */ (function () {
    function Bench(id, funcs) {
        this.id = id;
        this.funcs = funcs;
    }
    Bench.compare = function () {
        var benches = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            benches[_i] = arguments[_i];
        }
        var fastest = {};
        benches.forEach(function (bench) {
            bench.funcs.forEach(function (func) {
                var _a;
                fastest[_a = func.id] || (fastest[_a] = { f: func, b: bench });
                fastest[func.id] =
                    fastest[func.id].f.time > func.time
                        ? { f: func, b: bench }
                        : fastest[func.id];
            });
        });
        var _loop_2 = function (fast) {
            var fastero = fastest[fast];
            var string = "\u26A1 " + (crayon.yellow.bold(fastero.b.id) +
                crayon.green(" was the fastest in " + fastero.f.id + " test\n"));
            var tempBenches = Array.from(benches);
            tempBenches.splice(tempBenches.indexOf(fastero.b), 1);
            tempBenches.forEach(function (bench) {
                var time = bench.funcs.filter(function (o) {
                    if (o.id == fast)
                        return o;
                })[0].time;
                string += "\t" + crayon.cyan('➜') + " Faster than " + crayon.yellow.bold(bench.id) + " by " + crayon.bold((100 - (fastero.f.time / time) * 100).toFixed(2) + "%\n");
            });
            console.log(string);
        };
        for (var fast in fastest) {
            _loop_2(fast);
        }
    };
    Bench.prototype.run = function () {
        var _this = this;
        return new Promise(function (resolve) {
            console.log(crayon.blue("\u23F1  Starting benchmark of ") + crayon.yellow.bold(_this.id));
            var check = function (index) { return __awaiter(_this, void 0, void 0, function () {
                var func, start, end;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (index >= this.funcs.length) {
                                resolve(true);
                                return [2 /*return*/];
                            }
                            func = this.funcs[index];
                            start = Date.now();
                            return [4 /*yield*/, func()];
                        case 1:
                            _a = _b.sent(), end = _a[0], func.fluctuation = _a[1];
                            func.time = end - start;
                            console.log("\r\t" + crayon.bold.green('✓') + " Finished " + func.id + " task in " + crayon.bold(func.time + 'ms') + " \u00B1 " + ((func.fluctuation / func.time) * 100).toFixed(2) + "% | " + crayon.bold(String(Math.round((benchSettings.iterations * benchSettings.repeats) / (func.time / 1000)))) + "ops/s");
                            check(++index);
                            return [2 /*return*/];
                    }
                });
            }); };
            check(0);
        });
    };
    return Bench;
}());
var sleep = function (time) {
    return new Promise(function (resolve) { return setTimeout(resolve, time); });
};
var generateTest = function () {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    var funcs = [];
    var _loop_3 = function (object) {
        var benchFunc = function () { return __awaiter(void 0, void 0, void 0, function () {
            var min, max, r, start, i, fluctuation;
            return __generator(this, function (_a) {
                min = Date.now() * 100, max = 0;
                for (r = 0; r < benchSettings.repeats; ++r) {
                    start = Date.now();
                    for (i = 0; i < benchSettings.iterations; ++i)
                        object.func(i);
                    min = Math.min(Date.now() - start, min);
                    max = Math.max(Date.now() - start, max);
                }
                if (typeof object.endFunc === 'function')
                    object.endFunc();
                fluctuation = Math.abs(max - min);
                return [2 /*return*/, [Date.now(), fluctuation]];
            });
        }); };
        benchFunc.id = object.id;
        funcs.push(benchFunc);
    };
    for (var _a = 0, objects_1 = objects; _a < objects_1.length; _a++) {
        var object = objects_1[_a];
        _loop_3(object);
    }
    return funcs;
};
var crayonFuncTests = generateTest({
    id: 'access time',
    func: function (i) {
        return crayon.keyword('bgBlue').keyword('underline').keyword('bold').red(i);
    }
}, {
    id: 'render',
    func: function (i) {
        return process.stdout.write("\r" + crayon.keyword('bgBlue').keyword('underline').keyword('bold').red(i));
    },
    endFunc: function () {
        return process.stdout.write('\r' + ' '.repeat(String(benchSettings.iterations).length));
    }
});
var kleurTests = generateTest({
    id: 'access time',
    func: function (i) { return kleur.red().bgBlue().underline().bold(i); }
}, {
    id: 'render',
    func: function (i) {
        return process.stdout.write("\r" + kleur.red().bgBlue().underline().bold(i));
    },
    endFunc: function () {
        return process.stdout.write('\r' + ' '.repeat(String(benchSettings.iterations).length));
    }
});
var kleurBench = new Bench('kleur', kleurTests);
var crayonFuncBench = new Bench('crayon (func)', crayonFuncTests);
var testLibs = { chalk: chalk, crayon: crayon, ansiColors: ansiColors }; //libs with compatible API
var libBenches = [];
var _loop_1 = function (name_1) {
    var lib = testLibs[name_1];
    libBenches.push(new Bench(name_1, generateTest({
        id: 'access time',
        func: function (i) { return lib.red.bgBlue.underline.bold(i); }
    }, {
        id: 'render',
        func: function (i) {
            return process.stdout.write("\r" + lib.red.bgBlue.underline.bold(i));
        },
        endFunc: function () {
            return process.stdout.write('\r' + ' '.repeat(String(benchSettings.iterations).length));
        }
    })));
    var cached = (lib == crayon ? lib() : lib).red.bgBlue.underline.bold;
    libBenches.push(new Bench(name_1 + " (cached)", generateTest({
        id: 'access time',
        func: function (i) { return cached(i); }
    }, {
        id: 'render',
        func: function (i) { return process.stdout.write("\r" + cached(i)); },
        endFunc: function () {
            return process.stdout.write('\r' + ' '.repeat(String(benchSettings.iterations).length));
        }
    })));
};
for (var name_1 in testLibs) {
    _loop_1(name_1);
}
Promise.resolve().then(function () { return __awaiter(void 0, void 0, void 0, function () {
    var benches, benches_1, benches_1_1, bench, e_1_1;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                benches = __spreadArray(__spreadArray([], libBenches), [kleurBench, crayonFuncBench]);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 12]);
                benches_1 = __asyncValues(benches);
                _b.label = 2;
            case 2: return [4 /*yield*/, benches_1.next()];
            case 3:
                if (!(benches_1_1 = _b.sent(), !benches_1_1.done)) return [3 /*break*/, 5];
                bench = benches_1_1.value;
                bench.run();
                _b.label = 4;
            case 4: return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 7:
                _b.trys.push([7, , 10, 11]);
                if (!(benches_1_1 && !benches_1_1.done && (_a = benches_1["return"]))) return [3 /*break*/, 9];
                return [4 /*yield*/, _a.call(benches_1)];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12:
                Bench.compare.apply(Bench, benches);
                return [2 /*return*/];
        }
    });
}); });
