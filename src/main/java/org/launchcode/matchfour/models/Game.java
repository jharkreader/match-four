package org.launchcode.matchfour.models;

public class Game {

    //private User user;
    //private ??? timer;
    private static int guesses = 10;
    private int score = 0;
    private Code gameCode = new Code();

    public void runGame() {

        while (guesses > 0) {



        }

        // User.score += score;
        // Or return score and use database call in GameController?
    }



    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public static int getGuesses() {
        return guesses;
    }

    public Code getGameCode() {
        return gameCode;
    }

}
