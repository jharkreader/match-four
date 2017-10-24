package org.launchcode.matchfour.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


public class User {

    @NotNull
    @Size(min=3, max=15,  message = "Please enter a username with at least 3 characters")
    private String name;

    public User(String name) {
        this.name = name;
    }

    @NotNull
    @Size(min=8, max=8,  message = "Please enter a password with at least 8 characters")
    private String password;

    public User() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

