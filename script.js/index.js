import axios from "axios";
import * as Carousel from "./Carousel.js"; // Assuming Carousel.js handles carousel-specific logic

// DOM Elements
const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// API Key (make sure to keep it secure in actual apps)
const API_KEY =
  "live_abPUxVEGISnXPZV8RjMH8b8CUtKACZJQ4H8EwYx93MPCSLoOWnd94um01p50XnIo";

// Set up Axios defaults
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

// Axios Interceptors for logging request/response times and progress
axios.interceptors.request.use((config) => {
  console.log("Request started:", config.url);
  document.body.style.cursor = "progress"; // Set cursor to progress during the request
  progressBar.style.width = "0%"; // Reset progress bar
  return config;
});

axios.interceptors.response.use((response) => {
  console.log("Request completed:", response.config.url);
  document.body.style.cursor = "default"; // Reset cursor
  progressBar.style.width = "100%"; // Set progress bar to full when done
  return response;
});

/**
 * Function to update progress during download
 * Axios supports onDownloadProgress for progress tracking
 */
function updateProgress(progressEvent) {
  const percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  progressBar.style.width = `${percentCompleted}%`;
}

/**
 * 1. Initial Load Function:
 * - Fetches the list of breeds and populates the breed selection dropdown.
 */
async function initialLoad() {
  try {
    const response = await axios.get("/breeds");
    const breeds = response.data;

    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Load the images and information for the first breed by default
    loadBreedImages(breeds[0].id);
  } catch (error) {
    console.error("Error fetching breeds:", error);
  }
}

/**
 * 2. Load images and breed information when a new breed is selected.
 */
async function loadBreedImages(breedId) {
  try {
    // Fetch the images for the selected breed
    const response = await axios.get(`/images/search`, {
      params: { breed_id: breedId, limit: 5 },
      onDownloadProgress: updateProgress,
    });

    // Clear the existing carousel and information
    Carousel.clear(); // Assuming clear() is in Carousel.js to handle clearing items
    infoDump.innerHTML = "";

    response.data.forEach((image) => {
      // Add images to the carousel
      Carousel.addItem(image.url);

      // Add breed info (be creative with this!)
      const breedInfo = document.createElement("div");
      breedInfo.innerHTML = `<h3>${image.breeds[0].name}</h3><p>${image.breeds[0].description}</p>`;
      infoDump.appendChild(breedInfo);
    });
  } catch (error) {
    console.error("Error fetching breed images:", error);
  }
}

/**
 * 3. Event listener for breed selection
 */
breedSelect.addEventListener("change", (event) => {
  const selectedBreedId = event.target.value;
  loadBreedImages(selectedBreedId);
});

/**
 * 4. Favourite/Unfavourite Image (POST and DELETE requests)
 */
export async function favourite(imgId) {
  try {
    // Toggle favourite logic - First check if the image is already favourited
    const favResponse = await axios.get("/favourites");
    const favList = favResponse.data;
    const isFavourited = favList.some((fav) => fav.image_id === imgId);

    if (isFavourited) {
      // If already favourited, delete the favourite
      const favToRemove = favList.find((fav) => fav.image_id === imgId);
      await axios.delete(`/favourites/${favToRemove.id}`);
      console.log(`Removed image ${imgId} from favourites`);
    } else {
      // If not favourited, add it
      await axios.post("/favourites", { image_id: imgId });
      console.log(`Added image ${imgId} to favourites`);
    }
  } catch (error) {
    console.error("Error toggling favourite:", error);
  }
}

/**
 * 5. Get Favourites - Retrieve and display the user's favourite images
 */
async function getFavourites() {
  try {
    const response = await axios.get("/favourites");
    const favourites = response.data;

    // Clear the carousel and info section
    Carousel.clear();
    infoDump.innerHTML = "";

    favourites.forEach((fav) => {
      // Add the favourite images to the carousel
      Carousel.addItem(fav.image.url);
    });
  } catch (error) {
    console.error("Error fetching favourites:", error);
  }
}

// Add event listener to the "Get Favourites" button
getFavouritesBtn.addEventListener("click", getFavourites);

// Call initial load when the page is loaded
initialLoad();

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
