import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { TopicService } from '../services/topic.service';
import { CategoryService } from "../services/category.service";
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';

import { DialogEdit } from '../topics/manipulateTopics/manipulateDialog.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminComponent implements OnInit {

  users = [];
  topics = [];
  topic = {};
  isLoading = true;
  isEditing = false;
  isEditing_topic = false;
  dialogRef: MdDialogRef<any>;
  categoriesAvailable = [];

  constructor(public auth: AuthService,
              public toast: ToastComponent,
              private userService: UserService,
              private topicService: TopicService,
              private categoryService: CategoryService,
              public dialogEdit: MdDialog) { }

  ngOnInit() {
    this.getUsers();
    this.loadAvailableCategories();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => this.users = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  deleteUser(user) {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      this.userService.deleteUser(user).subscribe(
        data => this.toast.setMessage('user deleted successfully.', 'success'),
        error => console.log(error),
        () => this.getUsers()
      );
    } 
  }

  deleteTopic(topic) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.topicService.deleteTopic(topic).subscribe(
        res => {
          const pos = this.topics.map(elem => elem._id).indexOf(topic._id);
          this.topics.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  getTopics() {
    this.topicService.getTopics().subscribe(
      data => {
         this.topics = data,
         this.isEditing = true,
         console.log(this.topics)
       },
      error => console.log(error)
    );
  }

  editTopic(topic) {
    this.topicService.editTopic(topic).subscribe(
      res => {
        this.isEditing_topic = false;
        this.topic = topic;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  loadAvailableCategories() {
    this.categoryService.getCategories().subscribe(
      data => {
        this.categoriesAvailable = data;
      },
      error => console.log(error),
      () => console.log('categories loaded')
    );
  }

  save_reordering(){
    console.log(this.topics);
  }

    // Dialog for editing topics
  open_edit(del_topic) {
    this.dialogRef = this.dialogEdit.open(dialogEdit);
    this.isEditing_topic = true;
    this.topic = del_topic;
    this.dialogRef.componentInstance.dialog_topic = del_topic;
    this.dialogRef.componentInstance.categoriesAvailable = this.categoriesAvailable;
    this.dialogRef.componentInstance.topicCategories = del_topic.categories;

    this.dialogRef.afterClosed().subscribe(
      result => {
        this.dialogRef = null;
        if (!result) {
          //this.cancelEditing_topic();
          this.toast.setMessage('item cancled.', 'warning');
        } else {
          this.editTopic(result);
          this.toast.setMessage('item edited successfully.', 'success');
        }
      });
  }

}


const dialogEdit = DialogEdit;