package org.launchcode.matchfour.controllers;

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

    @RequestMapping(value = "")
    public String index(Model model){

        model.addAttribute("title", "Welcome" );
        return "game";
    }

    @RequestMapping(value = "play")
    public String play(Model model){

        model.addAttribute("title", "Let's Play!" );
        return "play";
    }

    // May not need it's own request path. Could prob just have a pop-up message.
    @RequestMapping(value = "gameover")
    public String gameOver(Model model){

        model.addAttribute("title", "Game Over!" );
        return "gameover";
    }


    @RequestMapping(value = "userLogin", method = RequestMethod.GET)
    public String add(Model model) {
        model.addAttribute("title", "Welcome to MatchFour!");
        model.addAttribute("user", new User());

        return "userLogin";
    }

    @RequestMapping(value = "userLogin", method = RequestMethod.POST)
    public String add(@ModelAttribute @Valid User user, Errors errors, Model model) {

        if (errors.hasErrors()) {
            return "userLogin";
        }

        model.addAttribute("title", "user");
        model.addAttribute("user", new User());
        return "redirect::/play"; //main html page for the game
    }
}
