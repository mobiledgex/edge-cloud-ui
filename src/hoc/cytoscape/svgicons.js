export const ICON_LOCK = 'lock'
export const ICON_UNLOCK = 'unlock'
export const ICON_DOCKER = 'docker'
export const ICON_KUBERNETES = 'kubernetes'

const getIcon = (id) => {
    switch (id) {
        case ICON_LOCK:
            return 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z'
        case ICON_UNLOCK:
            return 'M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17S8 16.11 8 15 8.9 13 10 13M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H16C17.1 22 18 21.1 18 20V10C18 8.9 17.1 8 16 8H15V6C15 4.34 16.34 3 18 3S21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M16 10V20H4V10H16Z'
        case ICON_DOCKER:
        case ICON_DOCKER:

    }
}

export const renderNode = (type, padding) => {
    // Icon path is assumed to be of 32x32 in this example. You may auto calculate this if you wish.
    const iconPath = getIcon(type);
    const iconColor = '#000';
    const size = 32; // may need to calculate this yourself
    const iconResize = padding ? padding : 1; // adjust this for more "padding" (bigger number = more smaller icon)

    const width = size;
    const height = size;
    const scale = (size - iconResize) / size;
    const iconTranslate = iconResize / 2 / scale;
    const backgroundColor = 'transparent';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect x="0" y="0" width="${width}" height="${height}" fill="${backgroundColor}"></rect>
        <path d="${iconPath}" fill="${iconColor}" transform="scale(${scale}) translate(${iconTranslate}, ${iconTranslate}) "></path>
      </svg>`;
    return {
        svg: 'data:image/svg+xml;base64,' + btoa(svg),
        width,
        height,
    };
}

