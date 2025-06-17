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

    @Select("SELECT * FROM users WHERE name LIKE CONCAT('%', #{name}, '%')")
    List<User> findByNameContaining(String name);

    @Select("SELECT * FROM users WHERE name LIKE CONCAT('%', #{name}, '%') ORDER BY ${sortBy} ${sortDirection} LIMIT #{pageSize} OFFSET #{offset}")
    List<User> findPaginatedAndSortedByName(@Param("name") String name, @Param("sortBy") String sortBy, @Param("sortDirection") String sortDirection, @Param("pageSize") int pageSize, @Param("offset") int offset);

    @Select("SELECT COUNT(*) FROM users WHERE name LIKE CONCAT('%', #{name}, '%')")
    long countByName(@Param("name") String name);

    @Select("SELECT * FROM users ORDER BY ${sortBy} ${sortDirection} LIMIT #{pageSize} OFFSET #{offset}")
    List<User> findPaginatedAndSortedAll(@Param("sortBy") String sortBy, @Param("sortDirection") String sortDirection, @Param("pageSize") int pageSize, @Param("offset") int offset);

    @Select("SELECT COUNT(*) FROM users")
    long countAll();
}
