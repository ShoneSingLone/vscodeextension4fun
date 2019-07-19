"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
/**
 * get Local Resource
 *
 * @export
 * @param {string} pathname
 * @returns 'vscode-resource:'schema
 */
function getLR(pathname) {
    return 'vscode-resource:' + path_1.resolve(__dirname, `./${pathname}`);
}
exports.getLR = getLR;
//# sourceMappingURL=utils.js.map