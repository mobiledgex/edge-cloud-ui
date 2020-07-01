export const convertMegaToGiGa = (value) => {
    if (value > 1000) {
        return value / 1000
    } else {
        return value;
    }
}



console.log(`sdlkflskdfkl====>`, convertMegaToGiGa(231425).toFixed(0))
