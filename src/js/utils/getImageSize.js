export const getImageSize = (url, cb) => {
    let image = new Image();
    image.onload = () => {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        image = null;
        cb({ width, height });
    };
    image.onerror = () => cb(null);
    image.src = url;
};