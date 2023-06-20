const SCREEN_AREA_THRESHOLD = window.innerWidth * window.innerHeight * 0.5;
const MIN_SIZE = 30 * 30;

let index = 1;

function highlightLargestElementIn(parentElement, depth = 1, parentArea = Infinity) {
  const allElements = [...parentElement.querySelectorAll('*')];
  const largestElement = allElements.reduce((acc, el) => {
    const rect = el.getBoundingClientRect();
    const computedStyle = getComputedStyle(el);
    const totalWidth = rect.width + parseInt(computedStyle.marginLeft) + parseInt(computedStyle.marginRight);
    const totalHeight = rect.height + parseInt(computedStyle.marginTop) + parseInt(computedStyle.marginBottom);
    const area = totalWidth * totalHeight;
    const isInViewport = rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;

    if (isInViewport && area < SCREEN_AREA_THRESHOLD && area > MIN_SIZE && area < 0.8 * parentArea && (!acc.area || area > acc.area)) {
      return { element: el, area };
    }

    return acc;
  }, {element: null, area: 0});

  if (largestElement.element) {
    largestElement.element.style.outline = `3px solid rgb(${Math.min(255, 50 * depth)}, ${200 - Math.min(190, 10 * depth)}, ${200 - Math.min(190, 10 * depth)})`;
    const indexElement = document.createElement('span');
    indexElement.textContent = index++;
    indexElement.style.color = 'white';
    indexElement.style.backgroundColor = 'black';
    indexElement.style.position = 'absolute';
    largestElement.element.prepend(indexElement);
    highlightLargestElementIn(largestElement.element, depth + 1, largestElement.area);
  } else {
    parentElement.style.outline = '3px solid rgb(255, 0, 0)';
    parentElement.style.backgroundColor = 'yellow';
  }
}

highlightLargestElementIn(document.body);
