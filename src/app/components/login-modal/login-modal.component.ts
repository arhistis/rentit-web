import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RegisterModalComponent } from '../register-modal/register-modal.component';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): FormGroup{
    return this.formBuilder.group({
      email: this.formBuilder.control('cojeagabriel@yahoo.com', Validators.required),
      password: this.formBuilder.control('parola', Validators.required)
    });
  }

  login(){
    let {email, password} = this.form.value;
    this.authService.authenticate(email, password)
      .catch((err) => {
        alert("User or password incorrect");
        return Observable.throw(err);
      })
      .subscribe(() => {
        console.log("Login success");
        this.bsModalRef.hide();
      });
  }

  showRegisterModal(){
    this.bsModalRef.hide();
    this.modalService.show(RegisterModalComponent);
  }

}
