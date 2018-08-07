/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package me.chathub;

import com.jfoenix.controls.JFXTextField;
import entity.Message;
import entity.User;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.ResourceBundle;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.geometry.Insets;
import javafx.scene.control.Label;
import javafx.scene.control.ListCell;
import javafx.scene.control.ListView;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;

/**
 *
 * @author Dao Tuan Tu
 */
public class FXMLDocumentController implements Initializable {
    ObservableList<Message> message = FXCollections.observableArrayList();
    @FXML
    ListView<Message> ListContacts = new ListView<>();
    ArrayList<Message> arrayList = new ArrayList<Message>();
    @FXML
    private Label infoName;
    @FXML
    private Pane infoImage;
    @FXML
    private JFXTextField searchMsg;
    

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        // Lấy dữ liệu user
        User myuser = new User("DaoTuanTu", "CuTu","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1MPg_bq-vnHrE1xshA8WXMeOmbub8e_7BphmOJucvpX_x5w-n", "Tudtxx@xx.xx", "Dao Tuan Tu", "24/02/1999", "Nam");
        Message msg = new Message(0001, "https://3.bp.blogspot.com/-4PvJkghRRlg/Wm7cFGvq8JI/AAAAAAAAGzk/_IqVk9ewIJsELLPzT0jbljh87XjwSbspQCLcBGAs/s1600/anh-girl-xinh%2B%25282%2529.jpg", "Đào Tuấn Tú", "15:00", "abc xyz jssjlâ jdjkw");
        Message msg2 = new Message(0002, "http://kenh14.mediacdn.vn/2015/tumblr-ntm6s9hvg51uqzlm3o1-500-1449541563455.jpg", "CuTu ViDai", "15:00", "sduiwd jwe ưdnkdwđư kw d");
        Message msg3 = new Message(0001, "https://3.bp.blogspot.com/-4PvJkghRRlg/Wm7cFGvq8JI/AAAAAAAAGzk/_IqVk9ewIJsELLPzT0jbljh87XjwSbspQCLcBGAs/s1600/anh-girl-xinh%2B%25282%2529.jpg", "Đào Tuấn Tú", "15:00", "abc xyz jssjlâ jdjkw");
        Message msg4 = new Message(0002, "http://kenh14.mediacdn.vn/2015/tumblr-ntm6s9hvg51uqzlm3o1-500-1449541563455.jpg", "CuTu ViDai", "15:00", "sduiwd jwe ưdnkdwđư kw d");
        Message msg5 = new Message(0001, "https://3.bp.blogspot.com/-4PvJkghRRlg/Wm7cFGvq8JI/AAAAAAAAGzk/_IqVk9ewIJsELLPzT0jbljh87XjwSbspQCLcBGAs/s1600/anh-girl-xinh%2B%25282%2529.jpg", "Đào Tuấn Tú", "15:00", "abc xyz jssjlâ jdjkw");
        Message msg6 = new Message(0002, "http://kenh14.mediacdn.vn/2015/tumblr-ntm6s9hvg51uqzlm3o1-500-1449541563455.jpg", "CuTu ViDai", "15:00", "sduiwd jwe ưdnkdwđư kw d");
        arrayList.addAll(Arrays.asList(msg,msg2,msg3,msg4,msg5,msg6));
        // LẤY THÔNG TIN LIÊN HỆ
        HBox contactInfo = new HBox();
        contactInfo.setSpacing(10);
        for (int i = 0; i < arrayList.size(); i++) {
            VBox msgInfo = new VBox();
            msgInfo.setPadding(new Insets(5, 0, 0, 0));
            ImageView imgYour = new ImageView(new Image(arrayList.get(i).getAvatar()));
            imgYour.setFitHeight(50);
            imgYour.setFitWidth(50);
            Label msgName = new Label(arrayList.get(i).getName());
            Label msgContent = new Label(arrayList.get(i).getMessage());
            msgInfo.getChildren().addAll(msgName,msgContent);
            contactInfo.getChildren().addAll(imgYour,msgInfo);
        }
        message.addAll(arrayList);
        //HIỂN THỊ THÔNG TIN LIÊN HỆ
        ListContacts.setItems(message);
        ListContacts.setCellFactory(listView -> new ListCell<Message>() {
            public void updateItem(Message friend, boolean empty) {
                super.updateItem(friend, empty);
                if (empty) {
                    setText(null);
                    setGraphic(null);
                } else {
                    setGraphic(contactInfo);
                }
            }

        });
        
        // THÔNG TIN USER
        ImageView avtme = new ImageView(new Image(myuser.getAvatar()));
        avtme.setFitHeight(50);
        avtme.setFitWidth(50);
        infoImage.getChildren().add(avtme);
        infoName.setText(myuser.getFullName());
        infoName.setStyle("-fx-font-weight: bold");
        
        // INPUT SEARCH
        searchMsg.setPromptText("Tìm kiếm trên ChatHub");
    }     
}
