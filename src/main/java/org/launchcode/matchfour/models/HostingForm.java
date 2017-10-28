package org.launchcode.matchfour.models;

public class HostingForm {

    // Variables
    private String bestTimeString;
    private double myBestTime;

    // Constructor
    public HostingForm() {

    }

    // Getters and Setters
    public String getBestTimeString() {
        return bestTimeString;
    }

    public void setBestTimeString(String bestTimeString) {
        this.bestTimeString = bestTimeString;
    }

    public double getMyBestTime() {
        return myBestTime;
    }

    public void setMyBestTime(double myBestTime) {
        this.myBestTime = myBestTime;
    }
}
