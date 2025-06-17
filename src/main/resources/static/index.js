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

function fetchUsers(searchName, page = 0, size = 10, sortBy = 'id', sortDirection = 'asc') {
    console.log(`fetchUsers called with searchName: ${searchName}, page: ${page}, size: ${size}, sortBy: ${sortBy}, sortDirection: ${sortDirection}`);
    searchName = searchName === null || searchName === undefined ? '' : String(searchName);

    let url = `/users?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    if (searchName.trim() !== '') {
        url += `&name=${encodeURIComponent(searchName)}`;
    }

    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    console.log('Fetching from URL:', url, 'with method:', options.method);

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(userPage => {
            const usersTable = document.getElementById('usersTable');
            usersTable.innerHTML = ''; // Clear existing rows
            userPage.users.forEach(user => {
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
            updatePaginationControls(userPage);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            alert('Failed to load users. Please try again.');
        });
}

function updatePaginationControls(userPage) {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';

    const currentPage = userPage.currentPage;
    const totalPages = userPage.totalPages;
    const pageSize = userPage.pageSize;
    const searchName = document.getElementById('searchName').value;

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = `relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 0 ? 'cursor-not-allowed opacity-50' : ''}`;
    prevButton.innerHTML = `<span class="sr-only">Previous</span><svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 010 1.06L9.56 10l3.23 3.71a.75.75 0 11-1.06 1.06l-3.75-4.3a.75.75 0 010-1.06l3.75-4.3a.75.75 0 011.06 0z" clip-rule="evenodd" /></svg>`;
    prevButton.disabled = currentPage === 0;
    prevButton.onclick = () => fetchUsers(searchName, currentPage - 1, pageSize, currentSortBy, currentSortDirection);
    paginationControls.appendChild(prevButton);

    // Page numbers
    for (let i = 0; i < totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `relative inline-flex items-center px-4 py-2 text-sm font-semibold ${i === currentPage ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`;
        pageButton.innerText = i + 1;
        pageButton.onclick = () => fetchUsers(searchName, i, pageSize, currentSortBy, currentSortDirection);
        paginationControls.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = `relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages - 1 ? 'cursor-not-allowed opacity-50' : ''}`;
    nextButton.innerHTML = `<span class="sr-only">Next</span><svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 010-1.06L10.44 10 7.21 6.29a.75.75 0 111.06-1.06l3.75 4.3a.75.75 0 010 1.06l-3.75 4.3a.75.75 0 01-1.06 0z" clip-rule="evenodd" /></svg>`;
    nextButton.disabled = currentPage === totalPages - 1;
    nextButton.onclick = () => fetchUsers(searchName, currentPage + 1, pageSize, currentSortBy, currentSortDirection);
    paginationControls.appendChild(nextButton);
}

// Global variables to maintain sort state
let currentSortBy = 'id';
let currentSortDirection = 'asc';

function sortUsers(sortBy) {
    if (currentSortBy === sortBy) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortBy = sortBy;
        currentSortDirection = 'asc';
    }
    const searchName = document.getElementById('searchName').value;
    fetchUsers(searchName, 0, 10, currentSortBy, currentSortDirection);
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
        closeModal();
        const searchName = document.getElementById('searchName').value;
        fetchUsers(searchName, 0, 10, currentSortBy, currentSortDirection); // Refresh table, reset to first page
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
            const searchName = document.getElementById('searchName').value;
            fetchUsers(searchName, 0, 10, currentSortBy, currentSortDirection); // Refresh table, reset to first page
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
document.addEventListener('DOMContentLoaded', () => fetchUsers(null, 0, 10, currentSortBy, currentSortDirection)); 