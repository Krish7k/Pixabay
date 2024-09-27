const apiKey = '46221053-ad6614825479169b50039a460'; 
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImage');
const captionText = document.getElementById('caption');
const closeModal = document.querySelector('.close');
const downloadBtn = document.getElementById('downloadBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const shareBtn = document.getElementById('shareBtn');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


async function fetchImages(query = 'beautiful landscape') {
  try {
    const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&per_page=12`);
    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      displayImages(data.hits);
    } else {
      gallery.innerHTML = '<p>No images found.</p>';
    }
  } catch (error) {
    gallery.innerHTML = '<p>Failed to fetch images. Please try again later.</p>';
  }
}


function displayImages(images) {
  gallery.innerHTML = images.map(image => `
    <div>
      <img src="${image.webformatURL}" alt="${image.tags}" data-large="${image.largeImageURL}" data-author="${image.user}">
    </div>
  `).join('');
}


gallery.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    modal.style.display = 'flex';
    modalImg.src = e.target.dataset.large;
    captionText.innerHTML = `Image by: ${e.target.dataset.author}`;

   
    downloadBtn.href = e.target.dataset.large;

 
    favoriteBtn.onclick = () => {
      const imageUrl = e.target.dataset.large;
      if (!favorites.includes(imageUrl)) {
        favorites.push(imageUrl);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Image added to favorites!');
      } else {
        alert('Image already in favorites!');
      }
    };
    
    if (navigator.share) {
      shareBtn.onclick = () => {
        navigator.share({
          title: 'Check out this image!',
          url: e.target.dataset.large
        }).catch(error => console.log('Error sharing image', error));
      };
    } else {
      shareBtn.style.display = 'none'; 
    }
  }
});


closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});


document.getElementById('searchBtn').addEventListener('click', () => {
  const searchQuery = document.getElementById('searchInput').value;
  if (searchQuery) {
    fetchImages(searchQuery);
  }
});


document.getElementById('viewFavoritesBtn').addEventListener('click', () => {
  if (favorites.length > 0) {
    gallery.innerHTML = favorites.map(url => `
      <div>
        <img src="${url}" alt="Favorite Image">
      </div>
    `).join('');
  } else {
    gallery.innerHTML = '<p>No favorite images saved.</p>';
  }
});

fetchImages();
