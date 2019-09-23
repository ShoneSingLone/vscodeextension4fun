import { ParsedElement, ParsedPresentationAttr } from "../isomorphism/svgParser";
import { construct } from "./svgConstructor";
import { embeddingForm } from "../isomorphism/xpath";
import memoize from "fast-memoize";
import { SVG_NS } from "../isomorphism/constants";

/**
 * Get valid attributes by inserting invisible elements into body temporarily.
 */
function measureStyleByInsertingTemporarily(root: ParsedElement, xpath: string) {
    const xmlComponent = construct(root);
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.style.position = "absolute";
    svg.style.zIndex = "-2147483648";
    svg.style.left = "0";
    svg.style.top = "0";
    svg.style.visibility = "hidden";
    svg.appendChild(xmlComponent.toDom());
    document.body.appendChild(svg);

    const specified = <Element>document.evaluate(embeddingForm(xpath), svg, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
    const computed = getComputedStyle(specified);
    const ret = {
        fill: computed.fill,
        stroke: computed.stroke,
        font: computed.font,
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontStyle: computed.fontStyle,
        fontWeight: computed.fontWeight
    }

    document.body.removeChild(svg);
    return ret;
}

export const measureStyle = memoize(measureStyleByInsertingTemporarily);

