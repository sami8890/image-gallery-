// script.js
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const items = document.querySelectorAll(".item");
    const loadingSpinner = document.getElementById('loading-spinner');

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");

            items.forEach(item => {
                if (filter === "all" || item.classList.contains(filter)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });

            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });

    // Trigger the "All" filter by default
    document.querySelector('.filter-btn[data-filter="all"]').click();

    // Handle file input change
    document.getElementById('file-input').addEventListener('change', (e) => {
        const files = e.target.files;
        const previewContainer = document.querySelector('.upload-preview');
        const errorElement = document.getElementById('upload-error');
        const descriptionInput = document.getElementById('image-description');

        previewContainer.innerHTML = '';  // Clear previous previews
        errorElement.textContent = '';     // Clear previous errors

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                errorElement.textContent = 'Please upload only image files.';
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // Limit file size to 5MB
                errorElement.textContent = 'Please upload files smaller than 5MB.';
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(event) {
                const imgElement = document.createElement('img');
                imgElement.src = event.target.result;

                const previewItem = document.createElement('div');
                previewItem.classList.add('preview-item');
                previewItem.appendChild(imgElement);

                previewContainer.appendChild(previewItem);
            };

            reader.readAsDataURL(file);
        });
    });

    // Handle submit button click
    document.querySelector('.upload-submit-btn').addEventListener('click', () => {
        const files = document.getElementById('file-input').files;
        const description = document.getElementById('image-description').value;
        const errorElement = document.getElementById('upload-error');
        const gallery = document.querySelector('.gallery');

        if (files.length === 0) {
            errorElement.textContent = 'Please select at least one image.';
            return;
        }

        if (!description.trim()) {
            errorElement.textContent = 'Please enter a description for the image.';
            return;
        }

        // Show loading spinner
        loadingSpinner.style.display = 'block';

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const imgElement = document.createElement('img');
                imgElement.src = event.target.result;

                const newItem = document.createElement('div');
                newItem.classList.add('item', 'custom');
                newItem.innerHTML = `
                    <img src="${event.target.result}" alt="${description}">
                    <div class="overlay-text">
                        <span class="text">${description}</span>
                        <span class="close-btn">&times;</span>
                    </div>
                `;
                
                gallery.appendChild(newItem);

                // Display the new item
                filterButtons.forEach(button => {
                    const filter = button.getAttribute("data-filter");
                    if (filter === "all" || newItem.classList.contains(filter)) {
                        newItem.style.display = "block";
                    }
                });
            };

            reader.readAsDataURL(file);
        });

        // Hide loading spinner and clear input and preview
        loadingSpinner.style.display = 'none';
        document.getElementById('file-input').value = '';
        document.querySelector('.upload-preview').innerHTML = '';
        document.getElementById('image-description').value = '';
    });

    // Remove image from gallery
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn')) {
            e.target.closest('.item').remove();
        }
    });
});
