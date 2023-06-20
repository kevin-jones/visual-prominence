const SCREEN_AREA_THRESHOLD = window.innerWidth * window.innerHeight * 0.5;
const MIN_SIZE = 30 * 30;

function highlightLargestElementIn(parentElement, depth = 1) {
  const allElements = [...parentElement.querySelectorAll('*')];
  const largestElement = allElements.reduce((acc, el) => {
    const rect = el.getBoundingClientRect();
    const computedStyle = getComputedStyle(el);
    const totalWidth = rect.width + parseInt(computedStyle.marginLeft) + parseInt(computedStyle.marginRight);
    const totalHeight = rect.height + parseInt(computedStyle.marginTop) + parseInt(computedStyle.marginBottom);
    const area = totalWidth * totalHeight;

    const isInViewport = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );

    if (isInViewport && area < SCREEN_AREA_THRESHOLD && area > MIN_SIZE && (!acc.area || area > acc.area)) {
      return { element: el, area };
    }

    return acc;
  }, {element: null, area: 0});

  if (largestElement.element) {
    console.log(`Total area (including margin): ${largestElement.area}px`);
    console.log(`Element: ${largestElement.element.tagName}, ID: ${largestElement.element.id}, Class(es): ${largestElement.element.className}`);
    largestElement.element.style.outline = `3px solid rgb(${Math.min(255, 50 * depth)}, 200, 200)`;
    highlightLargestElementIn(largestElement.element, depth + 1);
  }
}

highlightLargestElementIn(document.body);
