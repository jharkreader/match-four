package org.launchcode.matchfour.models;

import javax.persistence.Embeddable;

@Embeddable
public class UserTime {

    // Variables
    private double myTime;

    // Constructor
    public UserTime() {

    }

    public double getTime() {
        return myTime;
    }

    public void setMyTime(double myTime) {
        this.myTime = myTime;
    }
}
