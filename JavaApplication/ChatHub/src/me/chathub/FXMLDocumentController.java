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
        Message msg = new Message(0001, "https://3.bp.blogspot.com/-4PvJkghRRlg/Wm7cFGvq8JI/AAAAAAAAGzk/_IqVk9ewIJsELLPzT0jbljh87XjwSbspQCLcBGAs/s1600/anh-girl-xinh%2B%25282%2529.jpg", "Đào Tuấn Tú", "15:00", "abc xyz jssjlâ jdjkwsssssssssssssssd");
        Message msg2 = new Message(0002, "http://kenh14.mediacdn.vn/2015/tumblr-ntm6s9hvg51uqzlm3o1-500-1449541563455.jpg", "Pro Vl", "15:00", "sduiwd jwe ưdnkdwđư kw d");
        Message msg3 = new Message(0001, "https://cdn.pose.com.vn/legacy/images/baiviet/201711/nenezsnp_30_11_2017_15_13_51_21(1).jpg", "Bo Tu", "15:00", "abc xyz jssjlâ jdjkw");
        Message msg4 = new Message(0002, "https://i.pinimg.com/736x/a3/44/f8/a344f84e6481b4955dc5012ed8a9076c.jpg", "Vjp VL", "15:00", "sduiwd jwe ưdnkdwđư kw d");
        
        // LẤY THÔNG TIN LIÊN HỆ TRONG ARRAYLIST
        arrayList.addAll(Arrays.asList(msg,msg2,msg3,msg4));
        message.addAll(arrayList);
        ListContacts.setItems(message);
        
        //HIỂN THỊ THÔNG TIN LIÊN HỆ
        ListContacts.setCellFactory(listView -> new ListCell<Message>() {
            public void updateItem(Message msg, boolean empty) {
                super.updateItem(msg, empty);
                if (empty) {
                    setText(null);
                    setGraphic(null);
                } else {
                    HBox contactInfo = new HBox();
                    contactInfo.setSpacing(10);
                    VBox msgInfo = new VBox();
                    msgInfo.setPadding(new Insets(5, 0, 0, 0));
                    ImageView imgYour = new ImageView(new Image(msg.getAvatar()));
                    imgYour.setFitHeight(50);
                    imgYour.setFitWidth(50);
                    msgInfo.setPadding(new Insets(5, 0, 0, 0));
                    Label msgName = new Label(msg.getName());
                    Label msgContent = new Label(msg.getMessage());
                    msgInfo.getChildren().addAll(msgName,msgContent);
                    contactInfo.getChildren().addAll(imgYour,msgInfo);
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
