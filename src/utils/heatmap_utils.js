export const severityHexColors = [
    "#7FFF91",
    "#84FF7F",
    "#9BFF7F",
    "#B1FF7F",
    "#C8FF7F",
    "#DFFF7F",
    "#F6FF7F",
    "#FFF17F",
    "#FFDA7F",
    "#FFC47F",
    "#FFAD7F",
    "#FF967F",
    "#FF7F7F"
];

export const colors = severityHexColors.map((hex, i, arr) => [(i / arr.length) * 100, hex])


/***
 * Generate color based on 
 */
export const generateColor = (value) => {
    const length = colors.length - 1
    let color = colors[length][1]
    for (let i = 0; i < colors.length; i++) {
        const current = colors[i][0]
        if(i < length)
        {
            const next = colors[i+1][0]
            if(value >= current && value < next)
            {
                color = colors[i][1]
            }
        }
    }
    return color
}