/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

/**
 *
 * @author Dao Tuan Tu
 */
public class Message {
    private String Mode = "None";
    private int ID;
    private String Avatar;
    private String Name;
    private String Time;
    private String Message;

    public Message(int ID, String Avatar, String Name, String Time, String Message) {
        this.ID = ID;
        this.Avatar = Avatar;
        this.Name = Name;
        this.Time = Time;
        this.Message = Message;
    }

    public String getMode() {
        return Mode;
    }

    public void setMode(String Mode) {
        this.Mode = Mode;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getAvatar() {
        return Avatar;
    }

    public void setAvatar(String Avatar) {
        this.Avatar = Avatar;
    }

    public String getName() {
        return Name;
    }

    public void setName(String Name) {
        this.Name = Name;
    }

    public String getTime() {
        return Time;
    }

    public void setTime(String Time) {
        this.Time = Time;
    }

    public String getMessage() {
        return Message;
    }

    public void setMessage(String Message) {
        this.Message = Message;
    }
}
