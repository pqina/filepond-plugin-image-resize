// @ts-ignore
import { FilePondOptions } from 'filepond';

declare module 'filepond' {
    export interface FilePondOptions {
        /** Enable or disable image resizing */
        allowImageResize?: boolean;

        /** The output width in pixels, if null will use value of imageResizeTargetHeight */
        imageResizeTargetWidth?: number;

        /** The output height in pixels, if null will use value of imageResizeTargetWidth */
        imageResizeTargetHeight?: number;

        /** The method in which the images are resized. Choose between 'force', 'cover', or 'contain'.
         * Force will ignore the image aspect ratio. Cover will respect the aspect ratio and will scale to fill the target dimensions.
         * Contain also respects the aspect ratio and will fit the image inside the set dimensions.
         * All three settings will upscale images when there are smaller then the given target dimensions. */
        imageResizeMode?: 'force' | 'cover' | 'contain';

        /** Set to false to prevent upscaling of images smaller than the target size. */
        imageResizeUpscale?: boolean;
    }
}
