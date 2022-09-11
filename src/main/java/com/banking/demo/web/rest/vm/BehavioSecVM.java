package com.banking.demo.web.rest.vm;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * View Model object for storing a user's credentials.
 */
public class BehavioSecVM {

    @NotNull
    private String behavioralData;

    @NotNull
    @Size(min = 4, max = 300)
    private LoginVM authenticate;

    @NotNull
    @Size(min = 4, max = 100)
    private String behavioSession;

    public String getBehavioralData() {
        return behavioralData;
    }

    public void setBehavioralData(String behavioralData) {
        this.behavioralData = behavioralData;
    }

    public LoginVM getAuthenticate() {
        return authenticate;
    }

    public void setAuthenticate(LoginVM authenticate) {
        this.authenticate = authenticate;
    }

    /**
    public String getAuthenticate() {
        return authenticate;
    }

    public void setAuthenticate(String authenticate) {
        this.authenticate = authenticate;
    }
*/
    public String getBehavioSession() {
        return behavioSession;
    }

    public void setBehavioSession(String behavioSession) {
        this.behavioSession = behavioSession;
    }

    @Override
    public String toString() {
        return (
            "BehavioSecVM{" +
            "behavioralData='" +
            behavioralData +
            '\'' +
            ", authenticate='" +
            authenticate.toString() +
            '\'' +
            ", behavioSession='" +
            behavioSession +
            '\'' +
            '}'
        );
    }
}
