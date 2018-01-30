/*
 * FilePondPluginImageResize 1.0.0
 * Licensed under MIT, https://opensource.org/licenses/MIT
 * Please visit https://pqina.nl/filepond for details.
 */
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
      ? define(factory)
      : (global.FilePondPluginImageResize = factory());
})(this, function() {
  'use strict';

  // test if file is of type image
  var isImage = function isImage(file) {
    return /^image/.test(file.type);
  };

  /**
   * Image Auto Resize Plugin
   */
  var plugin$1 = function(_) {
    var addFilter = _.addFilter,
      utils = _.utils;
    var Type = utils.Type;

    // subscribe to file load and append required transformations

    addFilter('DID_LOAD_ITEM', function(item, _ref) {
      var query = _ref.query;
      return new Promise(function(resolve, reject) {
        // get file reference
        var file = item.file;

        // if this is not an image we do not have any business cropping it
        if (!isImage(file) || !query('GET_ALLOW_IMAGE_RESIZE')) {
          // continue with the unaltered dataset
          return resolve(item);
        }

        var mode = query('GET_IMAGE_RESIZE_MODE');
        var width = query('GET_IMAGE_RESIZE_TARGET_WIDTH');
        var height = query('GET_IMAGE_RESIZE_TARGET_HEIGHT');

        // no resizing to be done
        if (width === null && height === null) {
          return resolve(item);
        }

        // store crop rectangle with item
        item.setMetadata('resize', {
          mode: mode,
          size: {
            width: width,
            height: height
          }
        });

        return resolve(item);
      });
    });

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

  return plugin$1;
});
