package org.launchcode.matchfour.models;


import java.util.Random;

public class CodePeg {

    // Using a number instead of color, connection to color or shape will happen on front end
    private int pegValue;

    CodePeg() {
        Random ran = new Random();
        int newNumber = ran.nextInt(6);
        this.setPegValue(newNumber);
    }

    CodePeg(int num) {
        this();
        this.setPegValue(num);
    }

    public int getPegValue() {
        return pegValue;
    }

    public void setPegValue(int pegValue) {
        this.pegValue = pegValue;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CodePeg)) return false;

        CodePeg codePeg = (CodePeg) o;

        return pegValue == codePeg.pegValue;
    }

    @Override
    public int hashCode() {
        return pegValue;
    }
}
