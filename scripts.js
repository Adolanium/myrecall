document.addEventListener('DOMContentLoaded', function () {
    fetch('/timestamps').then(response => response.json()).then(timestamps => {
        const slider = document.getElementById('discreteSlider');
        const sliderValue = document.getElementById('sliderValue');
        const imageContainer = document.getElementById('imageContainer');
        const modalImage = document.getElementById('modalImage');
        const searchResults = document.getElementById('searchResults');
        const backButton = document.createElement('button');

        backButton.className = 'btn btn-outline-secondary my-2';
        backButton.innerText = 'Back';
        backButton.style.display = 'none';
        document.querySelector('.container').appendChild(backButton);

        slider.max = timestamps.length - 1;
        slider.value = timestamps.length - 1;
        sliderValue.textContent = formatTimestamp(timestamps[0]);

        function formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            const dateString = date.toLocaleDateString('en-GB');
            const timeString = date.toLocaleTimeString('en-GB');
            return `${dateString} ${timeString}`;
        }

        function updateImages(timestamp) {
            fetch('/images/' + timestamp).then(response => response.json()).then(files => {
                imageContainer.innerHTML = files.map(file => `<img src="/static/${file}" alt="Image for timestamp ${timestamp}" class="screenshot" data-toggle="modal" data-target="#imageModal">`).join('');
            });
        }

        function displaySearchResults(results) {
            searchResults.innerHTML = results.map(result => {
                const fileName = result.filePath.split('\\').pop();
                return `
                    <div class="search-result">
                        <h5>${formatTimestamp(result.timestamp)}</h5>
                        <img src="/static/${fileName}" alt="Image for timestamp ${result.timestamp}" class="screenshot" data-toggle="modal" data-target="#imageModal">
                    </div>
                `;
            }).join('');
            imageContainer.style.display = 'none';
            slider.style.display = 'none';
            sliderValue.style.display = 'none';
            searchResults.style.display = 'block';
            backButton.style.display = 'block';
        }

        function showSlider() {
            imageContainer.style.display = 'flex';
            slider.style.display = 'block';
            sliderValue.style.display = 'block';
            searchResults.style.display = 'none';
            backButton.style.display = 'none';
            updateImages(timestamps[slider.max - slider.value]);
        }

        updateImages(timestamps[0]);

        slider.addEventListener('input', function () {
            const reversedIndex = timestamps.length - 1 - slider.value;
            const timestamp = timestamps[reversedIndex];
            sliderValue.textContent = formatTimestamp(timestamp);
            updateImages(timestamp);
        });

        imageContainer.addEventListener('click', function (event) {
            if (event.target.tagName === 'IMG') {
                modalImage.src = event.target.src;
            }
        });

        searchResults.addEventListener('click', function (event) {
            if (event.target.tagName === 'IMG') {
                modalImage.src = event.target.src;
            }
        });

        document.querySelector('form').addEventListener('submit', function (event) {
            event.preventDefault();
            const query = document.querySelector('input[name="q"]').value;
            fetch('/search?q=' + query).then(response => response.json()).then(results => {
                displaySearchResults(results);
            });
        });

        backButton.addEventListener('click', showSlider);

        slider.value = timestamps.length - 1;
        sliderValue.textContent = formatTimestamp(timestamps[0]);
    });
});
