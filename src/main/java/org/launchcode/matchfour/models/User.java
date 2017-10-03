package org.launchcode.matchfour.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


public class User {

    @NotNull
    @Size(min=3, max=15)
    private String name;

    public User(String name) {
        this.name = name;
    }

    public User() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

