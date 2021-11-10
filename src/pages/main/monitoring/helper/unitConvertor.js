
export const UNIT_BYTES = 1
export const UNIT_PERCENTAGE = 2
export const UNIT_FLOOR = 3
export const UNIT_MB = 4
export const UNIT_GB = 5
export const UNIT_TB = 7
export const UNIT_KB = 6

const STORAGE_MARKER = 1024
const storageUnits = [UNIT_BYTES, UNIT_KB, UNIT_MB, UNIT_GB, UNIT_TB]

const convertStorage = (unit, value) => {
    if (value < STORAGE_MARKER || unit === UNIT_TB) {
        return { unit, value }
    }
    else {
        let index = storageUnits.indexOf(unit) + 1
        return convertStorage(storageUnits[index], value / STORAGE_MARKER)
    }
}

const unitScale = (unit) => {
    let scale = ''
    switch (unit) {
        case UNIT_BYTES:
            scale = 'Bytes'
            break;
        case UNIT_KB:
            scale = 'KB'
            break;
        case UNIT_MB:
            scale = 'MB'
            break;
        case UNIT_GB:
            scale = 'GB'
            break;
        case UNIT_TB:
            scale = 'TB'
            break;
    }
    return scale
}

const calculateStorage = (oldUnit, oldValue, decimal) => {
    const { unit, value } = convertStorage(oldUnit, oldValue, decimal)
    let scale = unitScale(unit)
    if(Number.isInteger(value))
    {
        return `${value} ${scale}` 
    }
    else
    {
        return `${value.toFixed(decimal ? 3 : 0)} ${scale}`
    }
}

export const convertUnit = (unit, value, decimal) => {
    // value = parseFloat(value)
    if (value >= 0) {
        switch (unit) {
            case UNIT_PERCENTAGE:
                return (Number.isInteger(value) ? value : value.toFixed(3))
            case UNIT_FLOOR:
                return Math.floor(value)
            case UNIT_BYTES:
            case UNIT_KB:
            case UNIT_MB:
            case UNIT_GB:
                return calculateStorage(unit, value,decimal)
            default:
                return value
        }
    }
}

export const scaleMarker = (unit, maxUnit) => {
    let pow = storageUnits.indexOf(maxUnit) - storageUnits.indexOf(unit)
    return 2 * Math.pow(STORAGE_MARKER, pow)
}

export const calculateRange = (unit, min, max) => {
    if (unit === UNIT_BYTES || unit === UNIT_KB || unit === UNIT_MB || unit === UNIT_GB || unit === UNIT_TB) {
        
        let minStorage = unit ? convertStorage(unit, min) : { unit, min }
        let maxStorage = unit ? convertStorage(unit, max) : { unit, min }
        
        minStorage.value = parseInt(minStorage.value)
        maxStorage.value = parseInt(maxStorage.value)
        if (minStorage.value === maxStorage.value || maxStorage.value - minStorage.value < 2) {
            let maxRange = scaleMarker(unit, minStorage.unit)
            let minRange = scaleMarker(unit, maxStorage.unit)
            min = min - minRange
            max = max + maxRange
            return { min, max }
        }

    }
}

