package com.example.springbootthymeleafcrud.controller;

import com.example.springbootthymeleafcrud.model.User;
import com.example.springbootthymeleafcrud.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String showUsers(Model model) {
        // The initial page load will not fetch data here.
        // Data will be fetched by JavaScript after the page loads.
        return "index";
    }

    @GetMapping("/users")
    @ResponseBody
    public List<User> getAllUsersJson() {
        return userService.getAllUsers();
    }

    @PostMapping("/users/search")
    @ResponseBody
    public List<User> searchUsers(@RequestBody User searchUser) {
        // Assuming searchUser only contains the 'name' property for searching
        return userService.searchUsersByName(searchUser.getName());
    }

    @PostMapping("/users")
    @ResponseBody
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/users/{id}")
    @ResponseBody
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/users/{id}")
    @ResponseBody
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        userDetails.setId(id);
        return userService.updateUser(userDetails);
    }

    @DeleteMapping("/users/{id}")
    @ResponseBody
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
