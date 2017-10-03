package org.launchcode.matchfour.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("")

public class HomeController {

    @RequestMapping(value = "")
    public String index(Model model){

        model.addAttribute("title", "Welcome" );
        return "home";
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
}
