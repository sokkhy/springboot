# Spring Boot + MyBatis + Thymeleaf Integration Guide

## Project Structure

```
project/
├── pom.xml
├── src/main/java/
│   └── com/example/springbootthymeleafcrud/
│       ├── SpringBootThymeleafCrudApplication.java
│       ├── controller/
│       │   └── UserController.java
│       ├── model/
│       │   └── User.java
│       ├── repository/
│       │   └── UserMapper.java
│       └── service/
│           └── UserService.java
├── src/main/resources/
│   ├── application.properties
│   ├── mapper/
│   │   └── UserMapper.xml
│   ├── schema.sql
│   └── templates/
│       └── index.html
└── pom.xml
```

## Key Dependencies

```xml
<!-- MyBatis -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.4</version>
</dependency>

<!-- Spring Boot Web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Thymeleaf -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<!-- Database -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Connection Pool -->
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
</dependency>
```

## Configuration (application.properties)

```properties
# Database Configuration
spring.datasource.url=jdbc:h2:mem:springbootthymeleafcrud
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# MyBatis Configuration
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.type-aliases-package=com.example.springbootthymeleafcrud.model

# Thymeleaf Configuration
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML
spring.thymeleaf.encoding=UTF-8

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

## Entity Class

```java
package com.example.springbootthymeleafcrud.model;

public class User {
    private Long id;
    private String name;
    private String email;
    private Integer age;
    
    // Getters and Setters
}
```

## Mapper Interface

```java
package com.example.springbootthymeleafcrud.repository;

import com.example.springbootthymeleafcrud.model.User;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM users")
    List<User> findAll();

    @Select("SELECT * FROM users WHERE id = #{id}")
    User findById(Long id);

    @Insert("INSERT INTO users (name, email, age) VALUES (#{name}, #{email}, #{age})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(User user);

    @Update("UPDATE users SET name = #{name}, email = #{email}, age = #{age} WHERE id = #{id}")
    void update(User user);

    @Delete("DELETE FROM users WHERE id = #{id}")
    void deleteById(Long id);
}
```

## Service Layer

```java
package com.example.springbootthymeleafcrud.service;

import com.example.springbootthymeleafcrud.model.User;
import com.example.springbootthymeleafcrud.repository.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserMapper mapper;

    public List<User> getAllUsers() {
        return mapper.findAll();
    }

    public User getUserById(Long id) {
        return mapper.findById(id);
    }

    public User createUser(User user) {
        mapper.insert(user);
        return user;
    }

    public User updateUser(User user) {
        mapper.update(user);
        return user;
    }

    public void deleteUser(Long id) {
        mapper.deleteById(id);
    }
}
```

## Controller

```java
package com.example.springbootthymeleafcrud.controller;

import com.example.springbootthymeleafcrud.model.User;
import com.example.springbootthymeleafcrud.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping("/")
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @PostMapping("/")
    public User createUser(@RequestBody User user) {
        return service.createUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return service.updateUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
    }
}
```

## Thymeleaf Template

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Spring Boot Thymeleaf CRUD</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h2>Users</h2>
        
        <button class="btn btn-primary mb-3" onclick="showAddForm()">Add New</button>
        
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr th:each="item : ${users}">
                    <td th:text="${item.id}"></td>
                    <td th:text="${item.name}"></td>
                    <td th:text="${item.email}"></td>
                    <td th:text="${item.age}"></td>
                    <td>
                        <button class="btn btn-sm btn-warning" th:onclick="'editItem(' + ${item.id} + ')'">Edit</button>
                        <button class="btn btn-sm btn-danger" th:onclick="'deleteItem(' + ${item.id} + ')'">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="formModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add/Edit User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="userForm">
                        <input type="hidden" id="userId">
                        <div class="mb-3">
                            <label>Name</label>
                            <input type="text" id="name" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label>Email</label>
                            <input type="email" id="email" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label>Age</label>
                            <input type="number" id="age" class="form-control">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="saveItem()">Save</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function showAddForm() {
            document.getElementById('userId').value = '';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('age').value = '';
            new bootstrap.Modal(document.getElementById('formModal')).show();
        }

        function editItem(userId) {
            fetch(`/api/${userId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch user');
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
                    alert('Failed to fetch user');
                });
        }

        function saveItem() {
            const userId = document.getElementById('userId').value;
            const user = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                age: parseInt(document.getElementById('age').value)
            };

            const method = userId ? 'PUT' : 'POST';
            const url = userId ? `/api/${userId}` : '/api';

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
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

        function deleteItem(userId) {
            if (confirm('Are you sure you want to delete this user?')) {
                fetch(`/api/${userId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
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
    </script>
</body>
</html>
```

## Best Practices

1. **MyBatis Mapping**:
   - Use `@Mapper` annotation on mapper interfaces
   - Use proper MyBatis annotations (@Select, @Insert, @Update, @Delete)
   - Use `@Options(useGeneratedKeys = true)` for auto-generated IDs
   - Keep SQL simple in annotations, use XML mappers for complex queries

2. **Service Layer**:
   - Keep business logic in service layer
   - Use @Transactional for database operations
   - Handle exceptions properly
   - Use DTOs for complex operations

3. **Controller Layer**:
   - Use RESTful URL patterns
   - Handle HTTP methods properly (GET, POST, PUT, DELETE)
   - Use @RestController for JSON responses
   - Use @RequestMapping for URL mapping

4. **Thymeleaf**:
   - Use proper Thymeleaf syntax for expressions
   - Use Bootstrap for styling
   - Keep JavaScript in separate files for complex logic
   - Use proper event handling with Thymeleaf

5. **Database**:
   - Use proper database schema design
   - Use proper data types
   - Add proper constraints
   - Use proper indexing

6. **Error Handling**:
   - Use proper exception handling
   - Return proper HTTP status codes
   - Provide meaningful error messages
   - Log errors properly

7. **Security**:
   - Use proper input validation
   - Use CSRF protection
   - Use proper authentication/authorization
   - Sanitize user inputs

8. **Performance**:
   - Use proper caching
   - Optimize database queries
   - Use proper connection pooling
   - Use proper pagination

## Common Issues and Solutions

1. **MyBatis Mapping Issues**:
   - Solution: Use proper type aliases and result maps
   - Solution: Use XML mappers for complex queries

2. **Thymeleaf Syntax Errors**:
   - Solution: Use proper Thymeleaf syntax
   - Solution: Use th:onclick instead of onclick for Thymeleaf expressions

3. **Database Connection Issues**:
   - Solution: Check database configuration
   - Solution: Use proper connection pooling
   - Solution: Add proper error handling

4. **Performance Issues**:
   - Solution: Use proper caching
   - Solution: Optimize database queries
   - Solution: Use proper pagination

## Testing

1. **Unit Tests**:
   - Test service layer methods
   - Test mapper interfaces
   - Test entity classes

2. **Integration Tests**:
   - Test database operations
   - Test controller endpoints
   - Test complete flow

3. **UI Tests**:
   - Test form submissions
   - Test CRUD operations
   - Test error handling

## Deployment

1. **Build**:
   - Use Maven to build the project
   - Use proper build profiles
   - Package as JAR/WAR

2. **Deployment**:
   - Use proper deployment configuration
   - Use proper environment variables
   - Use proper logging configuration

3. **Monitoring**:
   - Use proper logging
   - Use proper error tracking
   - Use proper performance monitoring

## Maintenance

1. **Code Updates**:
   - Follow proper version control
   - Use proper branching strategy
   - Use proper code review

2. **Database Updates**:
   - Use proper migration scripts
   - Test database changes
   - Backup before updates

3. **Security Updates**:
   - Keep dependencies updated
   - Follow security best practices
   - Regular security audits
