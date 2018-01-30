/*
 * FilePondPluginImageResize 1.0.0
 * Licensed under MIT, https://opensource.org/licenses/MIT
 * Please visit https://pqina.nl/filepond for details.
 */
// test if file is of type image
const isImage = file => /^image/.test(file.type);

/**
 * Image Auto Resize Plugin
 */
var plugin$1 = _ => {
  const { addFilter, utils } = _;
  const { Type, loadImage } = utils;

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

        // no resizing to be done
        if (width === null && height === null) {
          return resolve(item);
        }

        // store crop rectangle with item
        item.setMetadata('resize', {
          mode,
          size: {
            width,
            height
          }
        });

        return resolve(item);
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

      // target width
      imageResizeTargetWidth: [null, Type.INT],

      // target height
      imageResizeTargetHeight: [null, Type.INT]
    }
  };
};

if (document) {
  // plugin has loaded
  document.dispatchEvent(
    new CustomEvent('FilePond:pluginloaded', { detail: plugin$1 })
  );
}

export default plugin$1;
