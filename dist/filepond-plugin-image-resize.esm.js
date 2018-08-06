/*
 * FilePondPluginImageResize 2.0.0
 * Licensed under MIT, https://opensource.org/licenses/MIT
 * Please visit https://pqina.nl/filepond for details.
 */
// test if file is of type image
const isImage = file => /^image/.test(file.type);

const getImageSize = (url, cb) => {
  let image = new Image();
  image.onload = () => {
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    image = null;
    cb(width, height);
  };
  image.src = url;
};

/**
 * Image Auto Resize Plugin
 */
var plugin$1 = _ => {
  const { addFilter, utils } = _;
  const { Type } = utils;

  // subscribe to file load and append required transformations
  addFilter(
    'DID_LOAD_ITEM',
    (item, { query }) =>
      new Promise((resolve, reject) => {
        // get file reference
        const file = item.file;

        // if this is not an image we do not have any business cropping it
        if (!isImage(file) || !query('GET_ALLOW_IMAGE_RESIZE')) {
          // continue with the unaltered dataset
          return resolve(item);
        }

        const mode = query('GET_IMAGE_RESIZE_MODE');
        const width = query('GET_IMAGE_RESIZE_TARGET_WIDTH');
        const height = query('GET_IMAGE_RESIZE_TARGET_HEIGHT');
        const upscale = query('GET_IMAGE_RESIZE_UPSCALE');

        // no resizing to be done
        if (width === null && height === null) {
          return resolve(item);
        }

        // if should not upscale, we need to determine the size of the file
        const fileURL = URL.createObjectURL(file);
        getImageSize(fileURL, (imageWidth, imageHeight) => {
          URL.revokeObjectURL(fileURL);

          // image is already perfect size, no transformations required
          if (imageWidth === width && imageHeight === height) {
            return resolve(item);
          }

          // image is smaller than target size but no upscaling is allowed
          if (imageWidth <= width && imageHeight <= height && !upscale) {
            return resolve(item);
          }

          // the image needs to be resized
          item.setMetadata('resize', {
            mode,
            upscale,
            size: {
              width,
              height
            }
          });

          resolve(item);
        });
      })
  );

  // Expose plugin options
  return {
    options: {
      // Enable or disable image resizing
      allowImageResize: [true, Type.BOOLEAN],

      // the method of rescaling
      // - force => force set size
      // - cover => pick biggest dimension
      // - contain => pick smaller dimension
      imageResizeMode: ['cover', Type.STRING],

      // set to false to disable upscaling of image smaller than the target width / height
      imageResizeUpscale: [true, Type.BOOLEAN],

      // target width
      imageResizeTargetWidth: [null, Type.INT],

      // target height
      imageResizeTargetHeight: [null, Type.INT]
    }
  };
};

if (typeof navigator !== 'undefined' && document) {
  // plugin has loaded
  document.dispatchEvent(
    new CustomEvent('FilePond:pluginloaded', { detail: plugin$1 })
  );
}

export default plugin$1;
