package org.launchcode.matchfour.controllers;

import org.launchcode.matchfour.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.Valid;

@Controller
@RequestMapping("userLogin")
public class LoginController {

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String add(Model model) {
        model.addAttribute("title", "Welcome to MatchFour!");
        model.addAttribute("user", new User());

        return "userLogin";
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String add(@ModelAttribute @Valid User user, Errors errors, Model model) {

        if (errors.hasErrors()) {
            return "userLogin";
        }

        model.addAttribute("title", "user");
        model.addAttribute("user", new User());
        return "redirect::/play"; //main html page for the game
    }
}
