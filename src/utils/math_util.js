export const roundOff = (value) => (
    Math.round(value)
)

export const convertByteToMegaGigaByte = (bytes) => {
    let marker = 1024; // Change to 1000 if required
    let decimal = 1; // Change as required
    let kiloBytes = marker; // One Kilobyte is 1024 bytes
    let megaBytes = Math.pow(marker, 2); // One MB is 1024 KB
    let gigaBytes = Math.pow(marker, 3); // One GB is 1024 MB
    if (bytes < kiloBytes) return bytes + " Bytes";
    else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
    else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
    else return (bytes / gigaBytes).toFixed(decimal) + " GB";
}

export const convertKBtoMB = (data) => {
    let marker = 1024
    let decimal  = 1;
    let mb = marker 
    return data < mb ? data + ' KB' :  (data/mb).toFixed(decimal) + ' MB'
}

export const convertMBToGB = (mb) => {
    let marker = 1024; // Change to 1000 if required
    let decimal = 1; // Change as required
    let gigaBytes = marker; // One GB is 1024 MB
    let teraBytes = Math.pow(marker, 2); // One TB is 1024 GB
    if(mb < gigaBytes) return mb + ' MB'
    else if(mb< teraBytes) return (mb/gigaBytes).toFixed(decimal) + ' GB'
    else return (mb/teraBytes).toFixed(decimal) + ' TB' 
}

export const convertGBtoTB = (data) => {
    let marker = 1024
    let decimal  = 1;
    let tb = marker 
    return data < tb ? data + ' GB' :  (data/tb).toFixed(decimal) + ' TB'
}

export const unit = (type, value) => {
    if (value >= 0) {
        switch (type) {
            case 1:
                return convertByteToMegaGigaByte(value > 0 ? value.toFixed(1) : value)
            case 2:
                return (value > 0 ? value.toFixed(3) : value) + " %"
            case 3:
                return Math.floor(value)
            case 4:
                return convertMBToGB(value)
            case 5:
                return convertGBtoTB(value)
            case 6:
                return convertKBtoMB(value)
            default:
                return value
        }
    }
}

