package com.example.springbootthymeleafcrud.service;

import com.example.springbootthymeleafcrud.model.User;
import com.example.springbootthymeleafcrud.model.UserPage;
import com.example.springbootthymeleafcrud.repository.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    public List<User> getAllUsers() {
        return userMapper.findAll();
    }

    public User getUserById(Long id) {
        return userMapper.findById(id);
    }

    public User createUser(User user) {
        userMapper.insert(user);
        return user;
    }

    public User updateUser(User user) {
        userMapper.update(user);
        return user;
    }

    public void deleteUser(Long id) {
        userMapper.deleteById(id);
    }

    public List<User> searchUsersByName(String name) {
        return userMapper.findByNameContaining(name);
    }

    @Transactional(readOnly = true)
    public UserPage getPaginatedAndSortedUsers(int pageNumber, int pageSize, String sortBy, String sortDirection, String name) {
        int offset = pageNumber * pageSize;
        List<User> users;
        long totalElements;

        if (name != null && !name.trim().isEmpty()) {
            users = userMapper.findPaginatedAndSortedByName(name, sortBy, sortDirection, pageSize, offset);
            totalElements = userMapper.countByName(name);
        } else {
            users = userMapper.findPaginatedAndSortedAll(sortBy, sortDirection, pageSize, offset);
            totalElements = userMapper.countAll();
        }

        return new UserPage(users, totalElements, pageNumber, pageSize);
    }
}
