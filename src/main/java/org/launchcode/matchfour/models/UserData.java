package org.launchcode.matchfour.models;

import org.launchcode.matchfour.models.data.UserDao;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;

public class UserData {

    @Autowired
    private UserDao userDao;
    private ArrayList<User> userList = new ArrayList<>();

    public void generateUserList() {

        for (User eachUser : userDao.findAll()) {
            userList.add(eachUser);
        }
    }

    public void saveNewUser(User user) {
        userDao.save(user);
    }

    public boolean checkUserExists(User user) {

        boolean userExists = false;
        for (User eachUser : userList) {
            if (user.getName().equals(eachUser.getName())) {
                userExists = true;
            }
        }
        return userExists;
    }

    public boolean verifyUserPassword(User user) {

        String verifyPassword = "";
        boolean passwordVerified = false;
        for (User eachUser : userList) {
            if (user.getName().equals(eachUser.getName())) {
                verifyPassword = eachUser.getPassword();
            }
        }
        if (user.getPassword().equals(verifyPassword)) {
            passwordVerified = true;
        }
        return passwordVerified;
    }
}