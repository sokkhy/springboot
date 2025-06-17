package com.example.springbootthymeleafcrud.service;

import com.example.springbootthymeleafcrud.model.User;
import com.example.springbootthymeleafcrud.repository.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
}
