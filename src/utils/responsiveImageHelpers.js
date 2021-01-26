const sizes = [500, 900, 1200, 1600];
function getImages(originalLink, sizes) {
  // generate 4 images of different sizes with a webP and jpeg version 4x2 = 8 images + 1 blurry placeholder image
  const placeholderSize = 50;

  const JPEGImages = [];
  const webPImages = [];
  let placeholder = null;

  sizes.forEach((size) => {
    JPEGImages.push(originalLink.replace(/a.storyblok.com/, `img2.storyblok.com/${size}x0`));
    webPImages.push(originalLink.replace(/a.storyblok.com/, `img2.storyblok.com/${size}x0/filters:format(webp)`));
  });
  placeholder = originalLink.replace(/a.storyblok.com/, `img2.storyblok.com/${placeholderSize}x0`);
  return {
    JPEGImages,
    webPImages,
    placeholder,
  };
}

function getWebPSrcset(webPImages, sizes) {
  const imgResolutions = webPImages.map((img, index) => {
    return `${img} ${sizes[index]}w`;
  });

  return imgResolutions.join(', ');
}

function getJPEGSrcset(JPEGImages, sizes) {
  const imgResolutions = JPEGImages.map((img, index) => {
    return `${img} ${sizes[index]}w`;
  });

  return imgResolutions.join(', ');
}

function getDimensions(src) {
  const matches = src.match(/f\/\d+\/(\d+x\d+)/);

  const dimensions = matches[1].split('x');

  // dimensions = ["1920", "1080"]
  return dimensions;
}

function getPaddingBottomValue(dimensions) {
  const [width, height] = dimensions;

  return `${Math.floor((parseInt(height) / parseInt(width)) * 100)}%`;
}

module.exports = {
  sizes,
  getImages,
  getWebPSrcset,
  getJPEGSrcset,
  getDimensions,
  getPaddingBottomValue,
};
