package com.example.springbootthymeleafcrud.model;

import java.util.List;

public class UserPage {
    private List<User> users;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;

    public UserPage(List<User> users, long totalElements, int currentPage, int pageSize) {
        this.users = users;
        this.totalElements = totalElements;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = (int) Math.ceil((double) totalElements / pageSize);
    }

    // Getters
    public List<User> getUsers() {
        return users;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }
} 