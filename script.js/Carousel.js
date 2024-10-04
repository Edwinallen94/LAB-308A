const carouselInner = document.getElementById("carouselInner");

// Function to clear the carousel items
export function clear() {
  carouselInner.innerHTML = "";
}

// Function to add a new item to the carousel
export function addItem(imageUrl) {
  const template = document.getElementById("carouselItemTemplate");
  const clone = template.content.cloneNode(true);
  clone.querySelector("img").src = imageUrl;
  carouselInner.appendChild(clone);
}
