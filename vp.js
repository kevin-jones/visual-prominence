const SCREEN_AREA_THRESHOLD = window.innerWidth * window.innerHeight * 0.5;
const MIN_SIZE = 30 * 30;

let config = {
  SIZE_WEIGHT: 100,
  FOREGROUND_CONTRAST_WEIGHT: 1,
  BACKGROUND_CONTRAST_WEIGHT: 1,
};

let index = 1;

function getRGB(colorStr) {
  if (colorStr.includes('rgba')) {
    return colorStr.match(/\d+.?\d*/g).map(Number); // handles rgba colors with alpha
  } else {
    return colorStr.match(/\d+/g).map(Number); // handles rgb colors
  }
}

function getContrast(rgb1, rgb2) {
  return Math.abs(rgb1[0] - rgb2[0]) + Math.abs(rgb1[1] - rgb2[1]) + Math.abs(rgb1[2] - rgb2[2]);
}

function getParentBackground(el) {
  while (el) {
    let bg = getRGB(getComputedStyle(el).backgroundColor);
    if (bg[3] !== 0) {
      return bg;
    }
    el = el.parentElement;
  }
  return [255, 255, 255, 1]; // default to white if no parent background found
}

function highlightLargestElementIn(parentElement, depth = 1, parentArea = Infinity) {
  const allElements = [...parentElement.querySelectorAll('*')];
  const largestElement = allElements.reduce((acc, el) => {
    const rect = el.getBoundingClientRect();
    const computedStyle = getComputedStyle(el);
    const totalWidth = rect.width + parseInt(computedStyle.marginLeft) + parseInt(computedStyle.marginRight);
    const totalHeight = rect.height + parseInt(computedStyle.marginTop) + parseInt(computedStyle.marginBottom);
    const area = totalWidth * totalHeight;
    const isInViewport = rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;

    const parentBg = getParentBackground(el);
    const elColor = getRGB(computedStyle.color);
    const bgColor = getRGB(computedStyle.backgroundColor);
    const fgContrast = getContrast(elColor, parentBg);
    const bgContrast = getContrast(bgColor, parentBg);
    const score = area / config.SIZE_WEIGHT + fgContrast * config.FOREGROUND_CONTRAST_WEIGHT + bgContrast * config.BACKGROUND_CONTRAST_WEIGHT;

    if (isInViewport && area < SCREEN_AREA_THRESHOLD && area > MIN_SIZE && area < 0.8 * parentArea && (!acc.area || score > acc.score)) {
      return { element: el, area, score };
    }

    return acc;
  }, {element: null, area: 0, score: 0});

  if (largestElement.element) {
    largestElement.element.style.outline = `3px solid rgb(${Math.min(255, 50 * depth)}, ${200 - Math.min(190, 10 * depth)}, ${200 - Math.min(190, 10 * depth)})`;
    const indexElement = document.createElement('span');
    indexElement.textContent = index++;
    indexElement.style.color = 'white';
    indexElement.style.backgroundColor = 'black';
    indexElement.style.position = 'absolute';
    largestElement.element.prepend(indexElement);
    const bgColor = getRGB(getComputedStyle(largestElement.element).backgroundColor);
    highlightLargestElementIn(largestElement.element, depth + 1, largestElement.area, bgColor);
  } else {
    parentElement.style.outline = '3px solid rgb(255, 0, 0)';
    parentElement.style.backgroundColor = 'yellow';
  }
}

highlightLargestElementIn(document.body);
