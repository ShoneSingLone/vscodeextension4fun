import { textToXml, XmlElement } from "../../src/isomorphism/xmlParser";
import * as assert from 'assert';

describe("xmlParser", () => {
    it("attributes, self-closing", () => {
        const xml = textToXml('<books><book title="Twilight"/><book title="Twister"/></books>');
        const book1: XmlElement = {
            type: "element",
            tag: "book",
            attrs: {
                title: "Twilight"
            },
            children: [],
            positions: {
                interval: {start: 7, end: 31},
                openElement: {start: 7, end: 31},
                closeElement: null,
                startTag: {start: 8, end: 12},
                endTag: null,
                attrs: {
                    title: {name: {start: 13, end: 18}, value: {start: 20, end: 28}}
                }
            }
        };
        const book2: XmlElement = {
            type: "element",
            tag: "book",
            attrs: {
                title: "Twister"
            },
            children: [],
            positions: {
                interval: {start: 7 + 24, end: 54},
                openElement: {start: 7 + 24, end: 54},
                closeElement: null,
                startTag: {start: 8 + 24, end: 12 + 24},
                endTag: null,
                attrs: {
                    title: {name: {start: 37, end: 42}, value: {start: 20 + 24, end: 51}}
                }
            }
        }
        const books: XmlElement = {
            type: "element",
            tag: "books",
            attrs: {},
            children: [book1, book2],
            positions: {
                interval: {start: 0, end: 62},
                openElement: {start: 0, end: 7},
                closeElement: {start: 54, end: 62},
                startTag: {start: 1, end: 6},
                endTag: {start: 56, end: 61},
                attrs: {}
            }
        }
        assert.deepStrictEqual(xml, books);
    });

    it("cdata", () => {
        const xml = textToXml("<hello><![CDATA[<world>]]></hello>");
        const hello: XmlElement = {
            type: "element",
            tag: "hello",
            attrs: {},
            children: [{
                type: "cdata",
                tag: "cdata()",
                text: "<world>",
                interval: {start: 7, end: 26}
            }],
            positions: {
                interval: {start: 0, end: 34},
                openElement: {start: 0, end: 7},
                closeElement: {start: 26, end: 34},
                startTag: {start: 1, end: 6},
                endTag: {start: 28, end: 33},
                attrs: {}
            }
        };
        assert.deepStrictEqual(xml, hello);
    });

    it("comment, separate texts", () => {
        const xml = textToXml("<hello>(<!-- World --><!-- World -->)</hello>");
        const hello: XmlElement = {
            type: "element",
            tag: "hello",
            attrs: {},
            children: [{
                type: "text",
                tag: "text()",
                text: "(",
                interval: {start: 7, end: 8}
            }, {
                type: "comment",
                tag: "comment()",
                text: " World ",
                interval: {start: 8, end: 22}
            }, {
                type: "comment",
                tag: "comment()",
                text: " World ",
                interval: {start: 22, end: 36}
            }, {
                type: "text",
                tag: "text()",
                text: ")",
                interval: {start: 36, end: 37}
            }],
            positions: {
                interval: {start: 0, end: 45},
                openElement: {start: 0, end: 7},
                closeElement: {start: 37, end: 45},
                startTag: {start: 1, end: 6},
                endTag: {start: 39, end: 44},
                attrs: {}
            }
        };
        assert.deepStrictEqual(xml, hello);
    });

    it("text before/after root node", () => {
        const xml = textToXml("\n\n<hello>*</hello>\n\n");
        const hello: XmlElement = {
            type: "element",
            tag: "hello",
            attrs: {},
            children: [{
                type: "text",
                tag: "text()",
                text: "*",
                interval: {start: 9, end: 10}
            }],
            positions: {
                interval: {start: 2, end: 18},
                openElement: {start: 2, end: 9},
                closeElement: {start: 10, end: 18},
                startTag: {start: 3, end: 8},
                endTag: {start: 12, end: 17},
                attrs: {}
            }
        };
        assert.deepStrictEqual(xml, hello);
    });

    it("comment before/after root node", () => {
        const xml = textToXml("<!-- xml --><hello>*</hello><!-- xml -->");
        const hello: XmlElement = {
            type: "element",
            tag: "hello",
            attrs: {},
            children: [{
                type: "text",
                tag: "text()",
                text: "*",
                interval: {start: 19, end: 20}
            }],
            positions: {
                interval: {start: 12, end: 28},
                openElement: {start: 12, end: 19},
                closeElement: {start: 20, end: 28},
                startTag: {start: 13, end: 18},
                endTag: {start: 22, end: 27},
                attrs: {}
            }
        };
        assert.deepStrictEqual(xml, hello);
    });

    it("doctype, xml declaration", () => {
        const xml = textToXml('<?xml version="1.0"?><!DOCTYPE HelloWorld><hello>*</hello>');
        const hello: XmlElement = {
            type: "element",
            tag: "hello",
            attrs: {},
            children: [{
                type: "text",
                tag: "text()",
                text: "*",
                interval: {start: 49, end: 50}
            }],
            positions: {
                interval: {start: 42, end: 58},
                openElement: {start: 42, end: 49},
                closeElement: {start: 50, end: 58},
                startTag: {start: 43, end: 48},
                endTag: {start: 52, end: 57},
                attrs: {}
            }
        };
        assert.deepStrictEqual(xml, hello);
    });

    it("separate texts by child node", () => {
        const xml = textToXml("<hello>hello< br />world</hello>");
        const br: XmlElement = {
            type: "element",
            tag: "br",
            attrs: {},
            children: [],
            positions: {
                interval: {start: 12, end: 19},
                openElement: {start: 12, end: 19},
                closeElement: null,
                startTag: {start: 14, end: 16},
                endTag: null,
                attrs: {}
            }
        };
        const hello: XmlElement = {
            type: "element",
            tag: "hello",
            attrs: {},
            children: [{
                type: "text",
                tag: "text()",
                text: "hello",
                interval: {start: 7, end: 12}
            }, br, {
                type: "text",
                tag: "text()",
                text: "world",
                interval: {start: 19, end: 24}
            }],
            positions: {
                interval: {start: 0, end: 32},
                openElement: {start: 0, end: 7},
                closeElement: {start: 24, end: 32},
                startTag: {start: 1, end: 6},
                endTag: {start: 26, end: 31},
                attrs: {}
            }
        };
        assert.deepStrictEqual(xml, hello);
    });

    it("escaped characters", () => {
        const xml = textToXml("<hello>&lt; &gt;</hello>");
        const hello: XmlElement = {
            type: "element",
            tag: "hello",
            attrs: {},
            children: [{
                type: "text",
                tag: "text()",
                text: "&lt; &gt;",
                interval: {start: 7, end: 16}
            }],
            positions: {
                interval: {start: 0, end: 24},
                openElement: {start: 0, end: 7},
                closeElement: {start: 16, end: 24},
                startTag: {start: 1, end: 6},
                endTag: {start: 18, end: 23},
                attrs: {}
            }
        };
        assert.deepStrictEqual(xml, hello);
    });

    it("escaped chars in attributes", () => {
        const xml = textToXml('<hello title="&lt; &gt;" />');
        const hello: XmlElement = {
            type: "element",
            tag: "hello",
            attrs: {
                title: "&lt; &gt;"
            },
            children: [],
            positions: {
                interval: {start: 0, end: 27},
                openElement: {start: 0, end: 27},
                closeElement: null,
                startTag: {start: 1, end: 6},
                endTag: null,
                attrs: {
                    title: {name: {start: 7, end: 12}, value: {start: 14, end: 23}}
                }
            }
        };
        assert.deepStrictEqual(xml, hello);
    });
});