const API = 'http://localhost:3000/electronics';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('electronics-container');
    const modal = document.getElementById('modal');
    const form = document.getElementById('electronics-form');
    const modalTitle = document.getElementById('modal-title');
    const submitButton = document.getElementById('submit-btn');
    const closeModal = document.querySelector('.close-modal');
    const addElectronicBtn = document.querySelector('.add-electronics-btn');

    // Fetch and render electronics
    const fetchElectronics = async () => {
        try {
            const response = await fetch(API);
            const data = await response.json();

            container.innerHTML = '<div class="electronics-list"></div>';
            const list = container.querySelector('.electronics-list');

            data.forEach(electronic => {
                const div = document.createElement('div');
                div.className = 'electronic';
                div.innerHTML = `
                    <img src="${electronic.image}" alt="${electronic.name}">
                    <div class="electronic-content">
                        <h3>${electronic.name}</h3>
                        <p>${electronic.description}</p>
                        <p><strong>Price:</strong> $${electronic.price}</p>
                        <div class="electronic-actions">
                            <button class="edit-btn" data-id="${electronic.id}">Edit</button>
                            <button class="delete-btn" data-id="${electronic.id}">Delete</button>
                        </div>
                    </div>
                `;
                list.appendChild(div);
            });

            // Attach edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => openEditModal(btn.dataset.id));
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteElectronic(btn.dataset.id));
            });

        } catch (error) {
            console.error('Failed to fetch electronics:', error);
        }
    };

    // Open modal to add new item
    addElectronicBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add New Electronic';
        submitButton.textContent = 'Add';
        form.reset();
        document.getElementById('electronic-id').value = '';
        modal.classList.remove('hidden');
    });

    // Open modal to edit existing item
    const openEditModal = async (id) => {
        try {
            const response = await fetch(`${API}/${id}`);
            const electronic = await response.json();

            modalTitle.textContent = 'Update Electronic';
            submitButton.textContent = 'Update';
            document.getElementById('electronic-id').value = electronic.id;
            document.getElementById('electronic-name').value = electronic.name;
            document.getElementById('electronic-description').value = electronic.description;
            document.getElementById('electronic-price').value = electronic.price;
            document.getElementById('electronic-image').value = electronic.image;
            modal.classList.remove('hidden');
        } catch (error) {
            console.error('Failed to open edit modal:', error);
        }
    };

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Handle add/edit submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('electronic-id').value;
        const electronic = {
            name: document.getElementById('electronic-name').value,
            description: document.getElementById('electronic-description').value,
            price: parseFloat(document.getElementById('electronic-price').value),
            image: document.getElementById('electronic-image').value
        };

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${API}/${id}` : API;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(electronic)
            });

            if (response.ok) {
                modal.classList.add('hidden');
                fetchElectronics();
            } else {
                console.error('Failed to save electronic:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving electronic:', error);
        }
    });

    // Delete electronic item
    const deleteElectronic = async (id) => {
        if (!confirm('Are you sure you want to delete this electronic item?')) return;

        try {
            const response = await fetch(`${API}/${id}`, { method: 'DELETE' });

            if (response.ok) {
                fetchElectronics();
            } else {
                console.error('Failed to delete:', response.statusText);
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    // Initial load
    fetchElectronics();
});
