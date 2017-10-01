package org.launchcode.matchfour.models;

import java.util.ArrayList;

public class Code {

    private ArrayList<CodePeg> codeList;

    Code() {
        CodePeg peg1 = new CodePeg();
        CodePeg peg2 = new CodePeg();
        CodePeg peg3 = new CodePeg();
        CodePeg peg4 = new CodePeg();

        this.codeList.add(peg1);
        this.codeList.add(peg2);
        this.codeList.add(peg3);
        this.codeList.add(peg4);
    }

    //Working assumption: validation for this construction will happen on front end
    Code(int num1, int num2, int num3, int num4) {
        this();
        CodePeg peg1 = new CodePeg(num1);
        CodePeg peg2 = new CodePeg(num2);
        CodePeg peg3 = new CodePeg(num3);
        CodePeg peg4 = new CodePeg(num4);

        this.codeList.set(0, peg1);
        this.codeList.set(1, peg2);
        this.codeList.set(2, peg3);
        this.codeList.set(3, peg4);
    }

    //Checks for exact match
    public boolean checkPegBlack(int index, Code gameCode, Code guessCode) {
        if (gameCode.codeList.get(index).equals(guessCode.codeList.get(index))) {
            return true;
        }
        else {
            return false;
        }
    }

    public boolean checkPegWhite(Code gameCode, Code guessCode) {

        // Need to loop through ArrayList checking for value but excluding value at proper position

        return true;
    }


    public ArrayList<CodePeg> getCodeList() {
        return codeList;
    }
}
