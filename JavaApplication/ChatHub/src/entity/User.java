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
public class User {
    private String Username;
    private String Password;
    private String Avatar;
    private String Email;
    private String FullName;
    private String Birthday;
    private String Gender;

    public User(String Username) {
        this.Username = Username;
    }

    public User(String Username, String Password, String Avatar, String Email, String FullName, String Birthday, String Gender) {
        this.Username = Username;
        this.Password = Password;
        this.Avatar = Avatar;
        this.Email = Email;
        this.FullName = FullName;
        this.Birthday = Birthday;
        this.Gender = Gender;
    }
    
    public String getAvatar() {
        return Avatar;
    }

    public void setAvatar(String Avatar) {
        this.Avatar = Avatar;
    }
    
    public String getUsername() {
        return Username;
    }

    public void setUsername(String Username) {
        this.Username = Username;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String Password) {
        this.Password = Password;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String Email) {
        this.Email = Email;
    }

    public String getFullName() {
        return FullName;
    }

    public void setFullName(String FullName) {
        this.FullName = FullName;
    }

    public String getBirthday() {
        return Birthday;
    }

    public void setBirthday(String Birthday) {
        this.Birthday = Birthday;
    }

    public String getGender() {
        return Gender;
    }

    public void setGender(String Gender) {
        this.Gender = Gender;
    }
}
