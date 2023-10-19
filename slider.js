const track = document.getElementById("image-track");
const clickedImg = document.getElementById("clicked-img");

// Flag to track whether the slider is enabled or disabled
let sliderEnabled = true;

// Function to handle image click in the .image-track slider
const handleImageClick = (e) => {
  const image = e.target;

  // Clone the original image element from the source in the .image-track
  const originalImage = track.querySelector(`[src="${image.src}"]`).cloneNode();
  originalImage.classList.remove("image-mini"); // Remove the .image-mini class
  clickedImg.innerHTML = "";
  clickedImg.appendChild(originalImage);

  // Show the .clicked-img container
  clickedImg.style.display = "block";

  // Add the class .image-mini to all images in the #image-track
  const images = track.getElementsByClassName("image");
  for (const img of images) {
    img.classList.add("image-mini");
  }

  // Add the class .image-track-mini to the #image-track container
  track.classList.add("image-track-mini");

  // Disable the slider
  sliderEnabled = false;
};

// Add click event listeners to all images in the .image-track slider
const images = track.getElementsByClassName("image");
for (const image of images) {
  image.addEventListener("click", handleImageClick);
}

// Function to close the .clicked-img container and reset the changes
function closeClickedImage() {
  clickedImg.style.display = "none";

  // Remove the class .image-mini from all images in the #image-track
  const images = track.getElementsByClassName("image");
  for (const img of images) {
    img.classList.remove("image-mini");
  }

  // Remove the class .image-track-mini from the #image-track container
  track.classList.remove("image-track-mini");

  // Enable the slider
  sliderEnabled = true;
}

// Add a click event listener to the .clicked-img container to close it and reset
clickedImg.addEventListener("click", closeClickedImage);

const handleOnDown = (e) => (track.dataset.mouseDownAt = e.clientX);

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
};

const handleOnMove = (e) => {
  if (track.dataset.mouseDownAt === "0" || !sliderEnabled) return;

  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
    maxDelta = window.innerWidth / 2;

  const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  track.dataset.percentage = nextPercentage;

  track.animate(
    {
      transform: `translate(${nextPercentage}%, -50%)`,
    },
    { duration: 1200, fill: "forwards" }
  );

  for (const image of track.getElementsByClassName("image")) {
    image.animate(
      {
        objectPosition: `${100 + nextPercentage}% center`,
      },
      { duration: 1200, fill: "forwards" }
    );
  }
}

/* -- Had to add extra lines for touch events -- */

window.onmousedown = (e) => handleOnDown(e);

window.ontouchstart = (e) => handleOnDown(e.touches[0]);

window.onmouseup = (e) => handleOnUp(e);

window.ontouchend = (e) => handleOnUp(e.touches[0]);

window.onmousemove = (e) => handleOnMove(e);

window.ontouchmove = (e) => handleOnMove(e.touches[0]);
