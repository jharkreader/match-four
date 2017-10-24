package org.launchcode.matchfour.controllers;

import org.launchcode.matchfour.models.data.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import org.launchcode.matchfour.models.User;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.Valid;

@Controller
@RequestMapping("")

public class HomeController {

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String index(Model model){

        model.addAttribute("user", new User());
        model.addAttribute("title", "Welcome to MatchFour!" );
        return "userLogin";
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String index(@ModelAttribute @Valid User user, Errors errors, Model model) {

        if (errors.hasErrors()) {
            return "userLogin";
        }

        model.addAttribute("username", user.getName());
        return "redirect:/play";
    }


    @RequestMapping(value = "signUp", method = RequestMethod.GET)
    public String add(Model model) {
        model.addAttribute("title", "Sign up!");
        model.addAttribute("user", new User());

        return "userSignUp";
    }

    @RequestMapping(value = "signUp", method = RequestMethod.POST)
    public String add(@ModelAttribute @Valid User user, Errors errors, Model model) {

        if (errors.hasErrors()) {
            return "userSignUp";
        }

        userDao.save(user);
        model.addAttribute("username", user.getName());
        return "redirect"; //back to log in page
    }

    @RequestMapping(value = "play")
    public String play(Model model){

        model.addAttribute("title", "Let's Play!" );
        return "game";
    }


}
