package org.launchcode.matchfour.models;

import org.launchcode.matchfour.models.data.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
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

    public void updateUserTime(String username, double currentTime) {

        for (User user : userDao.findAll()) {
            if (user.getName().equals(username)) {
                if (user.getBestTime() > currentTime) {
                    user.setBestTime(currentTime);
                    userDao.save(user);
                }
            }
        }
    }

    public double getUserBestTime(String username) {
        double time = 0;
        for (User user : userDao.findAll()) {
            if (user.getName().equals(username)) {
                time = user.getBestTime();
            }
        }
        return time;
    }
}