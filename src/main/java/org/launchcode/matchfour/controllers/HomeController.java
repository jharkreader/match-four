package org.launchcode.matchfour.controllers;

import org.launchcode.matchfour.models.UserData;
import org.launchcode.matchfour.models.UserTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import org.launchcode.matchfour.models.User;
import org.springframework.validation.Errors;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import javax.xml.ws.http.HTTPBinding;

@Controller
@RequestMapping("")

public class HomeController {

    @Autowired
    private UserData userData;

    @RequestMapping(value = "login", method = RequestMethod.GET)
    public String logIn(Model model){

        model.addAttribute("user", new User());
        model.addAttribute("title", "Welcome to MatchFour!" );
        return "userLogin";
    }

    @RequestMapping(value = "login", method = RequestMethod.POST)
    public String logIn(@ModelAttribute @Valid User user, Errors errors, Model model, RedirectAttributes ra, HttpSession session) {

        if (errors.hasErrors()) {
            model.addAttribute("title", "Welcome to MatchFour!" );
            model.addAttribute("user", new User());
            return "userLogin";
        }

        userData.generateUserList();

        if (!userData.checkUserExists(user)) {

            model.addAttribute("title", "Welcome to MatchFour!" );
            model.addAttribute("userError", "User name does not exist. Please sign up!");
            model.addAttribute("user", new User());
            return "userLogin";
        }

        else if (userData.checkUserExists(user) && !userData.verifyUserPassword(user)) {

                model.addAttribute("title", "Welcome to MatchFour!" );
                model.addAttribute("passwordError", "Invalid password!");
                model.addAttribute("user", new User());
                return "userLogin";

        }

        else {

            session.setAttribute("loggedInUser", user);
            ra.addFlashAttribute("username", "Welcome " + user.getName());
            System.out.println("Session user: " + session.getAttribute("loggedInUser"));
            System.out.println("User from database: " + user);
            return "redirect:";
        }
    }


    @RequestMapping(value = "signUp", method = RequestMethod.GET)
    public String addUser(Model model) {
        model.addAttribute("title", "Sign up!");
        model.addAttribute("user", new User());

        return "userSignUp";
    }

    @RequestMapping(value = "signUp", method = RequestMethod.POST)
    public String addUser(@ModelAttribute @Valid User user, Errors errors, Model model, RedirectAttributes ra, HttpSession session) {

        if (errors.hasErrors()) {
            model.addAttribute("title", "Sign up!");
            return "userSignUp";
        }

        userData.generateUserList();

        if (userData.checkUserExists(user)) {
            model.addAttribute("title", "Sign up!");
            model.addAttribute("userError", "User name exists. Please select another.");
            return "userSignUp";
        }

        userData.saveNewUser(user);
        System.out.println("Newly created user: " + user);
        session.setAttribute("loggedInUser", user);
        ra.addFlashAttribute("username", "Welcome " + user.getName());
        return "redirect:";
    }

    @RequestMapping(value = "")
    public String index(Model model){
        return "game";
    }

    // Diane added - TO DO please check
    @RequestMapping(value = "about")
    public String about(){
        return "about";
    }

    @RequestMapping(value = "logout", method = RequestMethod.GET)
    public String logOut(HttpSession session) {
        System.out.println(session.getAttribute("loggedInUser"));
        session.removeAttribute("loggedInUser");
        return "redirect:";
    }

    @RequestMapping(value = "/path-to/hosting/save", method = RequestMethod.POST)
    public String updateTime(@RequestBody UserTime userTime, HttpSession session){

        double currentTime = userTime.getTime();
        if(session.getAttribute("loggedInUser") != null) {
            User currentUser = (User) session.getAttribute("loggedInUser");
            String username = currentUser.getName();
            userData.updateUserTime(username, currentTime);
        }
        return "game";
    }
}
