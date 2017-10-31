package org.launchcode.matchfour.controllers;

import jdk.nashorn.internal.parser.JSONParser;
import org.launchcode.matchfour.models.UserTime;
import org.launchcode.matchfour.models.data.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import org.launchcode.matchfour.models.User;
import org.springframework.validation.Errors;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.util.ArrayList;

@Controller
@RequestMapping("")

public class HomeController {

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "login", method = RequestMethod.GET)
    public String logIn(Model model){

        model.addAttribute("user", new User());
        model.addAttribute("title", "Welcome to MatchFour!" );
        return "userLogin";
    }

    @RequestMapping(value = "login", method = RequestMethod.POST)
    public String logIn(@ModelAttribute @Valid User user, Errors errors, Model model) {

        if (errors.hasErrors()) {
            model.addAttribute("user", new User());
            return "userLogin";
        }

        ArrayList<User> userList = new ArrayList<>();

        for (User eachUser : userDao.findAll()) {
            userList.add(eachUser);
        }

        boolean userExists = false;
        String verifyPassword = "";

        for (User eachUser : userList) {
            if (user.getName().equals(eachUser.getName())) {
                verifyPassword = eachUser.getPassword();
                userExists = true;
            }
        }

        if (!userExists) {
            // TODO Need span on form to display these error messages
            model.addAttribute("userError", "User name does not exist. Please sign up!");
            model.addAttribute("user", new User());
            return "userLogin";
        }

        if (userExists) {

            if (!user.getPassword().equals(verifyPassword)) {
                model.addAttribute("passwordError", "Invalid password!");
                model.addAttribute("user", new User());
                return "userLogin";
            }
        }

        model.addAttribute("username", user.getName());
        return "redirect:";
    }


    @RequestMapping(value = "signUp", method = RequestMethod.GET)
    public String addUser(Model model) {
        model.addAttribute("title", "Sign up!");
        model.addAttribute("user", new User());

        return "userSignUp";
    }

    @RequestMapping(value = "signUp", method = RequestMethod.POST)
    public String addUser(@ModelAttribute @Valid User user, Errors errors, Model model, RedirectAttributes ra) {

        if (errors.hasErrors()) {
            return "userSignUp";
        }

        ArrayList<User> userList = new ArrayList<>();

        for (User eachUser : userDao.findAll()) {
            userList.add(eachUser);
        }

        boolean userExists = false;

        for (User eachUser : userList) {
            if (user.getName().equals(eachUser.getName())) {
                userExists = true;
            }
        }

        //TODO Also needs error display span
        if (userExists) {
            model.addAttribute("userError", "User name exists. Please select another.");
            return "userSignUp";
        }

        userDao.save(user);

        ra.addAttribute("username", user.getName());

        return "redirect:";
    }

    @RequestMapping(value = "")
    public String index(Model model, @RequestParam("username") String username,
                        @ModelAttribute("flashAttr") String flashAttr){

        System.out.println(username);
        model.addAttribute("username", username);
        model.addAttribute("title", "Let's Play!" );
        return "game";
    }

    @RequestMapping(value = "/path-to/hosting/save", method = RequestMethod.GET)
    public String getHosting(@RequestBody UserTime userTime) {

        return "game";
    }
    @RequestMapping(value = "/path-to/hosting/save", method = RequestMethod.POST)
    public String updateHosting(@RequestParam String userTime) {
        JSONParser parser = new JSONParser();


        return "game";
    }
}
