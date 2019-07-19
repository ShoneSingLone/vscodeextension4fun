import { resolve } from 'path';

/**
 * get Local Resource
 * 
 * @export
 * @param {string} pathname 
 * @returns 'vscode-resource:'schema
 */
export function getLR(pathname: string) {
    return 'vscode-resource:' + resolve(__dirname, `./${pathname}`);
}
