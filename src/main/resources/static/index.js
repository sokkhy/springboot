function showAddForm() {
    document.getElementById('userId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('age').value = '';
    // Using Tailwind to show modal
    document.getElementById('formModal').classList.remove('hidden');
}

// Function to close modal using Tailwind classes
function closeModal() {
    document.getElementById('formModal').classList.add('hidden');
}

function fetchUsers(searchName) {
    console.log('fetchUsers called on DOMContentLoaded');
    // Ensure searchName is a string, defaulting to empty if null or undefined
    searchName = searchName === null || searchName === undefined ? '' : String(searchName);
    console.log('Search Name (after processing):', searchName);

    let url = '/users/search';
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: searchName })
    };

    if (searchName === '' || searchName.trim() === '') {
        url = '/users'; // Endpoint to get all users
        options.method = 'GET';
        delete options.body; // No body for GET request
    }

    console.log('Fetching from URL:', url, 'with method:', options.method);

    fetch(url, options)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return response.json();
    })
    .then(users => {
        const usersTable = document.getElementById('usersTable');
        usersTable.innerHTML = ''; // Clear existing rows
        users.forEach(user => {
            const row = `
                <tr class="hover:bg-gray-50 transition duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${user.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${user.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${user.age}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-indigo-600 hover:text-indigo-900 mr-3" onclick="editUser(${user.id})">
                            <i class="fas fa-edit mr-1"></i> Edit
                        </button>
                        <button class="text-red-600 hover:text-red-900" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash-alt mr-1"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
            usersTable.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error fetching users:', error);
        alert('Failed to load users. Please try again.');
    });
}

function editUser(userId) {
    userId = parseInt(userId);
    fetch(`/users/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(user => {
            document.getElementById('userId').value = user.id;
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('age').value = user.age;
            // Using Tailwind to show modal
            document.getElementById('formModal').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch user data. Please try again.');
        });
}

function saveUser() {
    const userId = document.getElementById('userId').value;
    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value)
    };

    const url = userId ? `/users/${userId}` : '/users';
    const method = userId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(() => {
        closeModal(); // Close modal after saving
        fetchUsers(); // Refresh table
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to save user');
    });
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/users/${userId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .then(() => {
            fetchUsers(); // Refresh table after deletion
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete user');
        });
    }
}

function searchUsers() {
    const searchName = document.getElementById('searchName').value;
    fetchUsers(searchName);
}

// Initial load of users when the page loads
document.addEventListener('DOMContentLoaded', () => fetchUsers(null)); 