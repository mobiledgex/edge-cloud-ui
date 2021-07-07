import randomColor from 'randomcolor'


export const darkColor = () => {
    return randomColor({ count: 1, luminosity: 'dark' })[0]
}

export const darkColors = (count) => {
    return randomColor({
        count,
        hue: 'random'
    })
}