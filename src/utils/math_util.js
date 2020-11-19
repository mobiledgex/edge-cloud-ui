export const roundOff = (value) => (
    Math.round(value)
)

export const convertByteToMegaGigaByte = (bytes) => {
    let marker = 1024; // Change to 1000 if required
    let decimal = 0; // Change as required
    let kiloBytes = marker; // One Kilobyte is 1024 bytes
    let megaBytes = marker * marker; // One MB is 1024 KB
    let gigaBytes = marker * marker * marker; // One GB is 1024 MB
    let teraBytes = marker * marker * marker * marker; // One TB is 1024 GB
    // return bytes if less than a KB
    if (bytes < kiloBytes) return bytes + " Bytes";
    // return KB if less than a MB
    else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
    // return MB if less than a GB
    else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
    // return GB if less than a TB
    else return (bytes / gigaBytes).toFixed(decimal) + " GB";
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
            default:
                return value
        }
    }
}

