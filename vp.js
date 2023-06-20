function highlightLargestElements() {
    var allElements = document.getElementsByTagName('*'); // get all elements
    var largestElements = []; // array to store the largest elements
    var maxArea = 0; // to keep track of the maximum area

    // iterate over all elements
    for (var i = 0; i < allElements.length; i++) {
        var element = allElements[i];
        var rect = element.getBoundingClientRect(); // get element size and position
        var area = rect.width * rect.height; // calculate area

        if (area > maxArea) {
            largestElements = [element]; // new largest element(s)
            maxArea = area; // update maximum area
        } else if (area === maxArea) {
            largestElements.push(element); // multiple largest elements
        }
    }

    // highlight largest elements
    for (var i = 0; i < largestElements.length; i++) {
        largestElements[i].style.outline = '3px solid red'; // adjust as needed
    }
}

highlightLargestElements(); // call the function
