package com.example.springbootthymeleafcrud.controller;

import com.example.springbootthymeleafcrud.model.User;
import com.example.springbootthymeleafcrud.model.UserPage;
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
    public UserPage getPaginatedUsersJson(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String name) {
        return userService.getPaginatedAndSortedUsers(page, size, sortBy, sortDirection, name);
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
