export const mapLegendColor = ["#D32F2F", "#388E3C", "#FFA000", "#616161"]

const gradientFilter = (key) => {
    return `<defs><filter id="inner${key}" x0="-25%" y0="-25%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur><feOffset dy="2" dx="3"></feOffset><feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite><feFlood flood-color="${mapLegendColor[key]}" flood-opacity="1"></feFlood><feComposite in2="shadowDiff" operator="in"></feComposite><feComposite in2="SourceGraphic" operator="over" result="firstfilter"></feComposite><feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2"></feGaussianBlur><feOffset dy="-2" dx="-3"></feOffset><feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite><feFlood flood-color="${mapLegendColor[key]}" flood-opacity="1"></feFlood><feComposite in2="shadowDiff" operator="in"></feComposite><feComposite in2="firstfilter" operator="over"></feComposite></filter></defs>`
}

export const renderSVG = (colorKey, cost) => {
    let path = `<path filter="url(#inner${colorKey})" d="M 19.35 10.04 C 18.67 6.59 15.64 4 12 4 C 9.11 4 6.6 5.64 5.35 8.04 C 2.34 8.36 0 10.91 0 14 c 0 3.31 2.69 6 6 6 h 13 c 2.76 0 5 -2.24 5 -5 c 0 -2.64 -2.05 -4.78 -4.65 -4.96 Z"></path>`
    let gradient = gradientFilter(colorKey);
    if (cost && cost > 0) {
        return `<svg viewBox="0 0 24 24"><g fill=rgba(10,10,10,.7) stroke="#fff" stroke-width="0"> ${gradient} ${path} </g><p style="position:absolute; top: 0; width: 28px; line-height: 28px; text-align: center;">${cost}</p></svg>`
    }
    else {
        return `<svg viewBox="0 0 24 24"><g fill=rgba(10,10,10,.7) stroke="#fff" stroke-width="0"> ${gradient} ${path} </g></svg>`
    }
}