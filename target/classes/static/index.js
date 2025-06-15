function showAddForm() {
    document.getElementById('userId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('age').value = '';
    new bootstrap.Modal(document.getElementById('formModal')).show();
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
            new bootstrap.Modal(document.getElementById('formModal')).show();
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
        location.reload();
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
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete user');
        });
    }
} 