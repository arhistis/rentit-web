import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { User } from '../../types/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  form: FormGroup;
  user: User | null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.createForm();
    this.getUser();
  }

  getUser(): void {
    this.userService.getMe()
      .catch(err => {
        return Observable.throw(err);
      })
      .subscribe(user => {
        this.user = user;
        console.log(this.user);
      });
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      password: this.formBuilder.control('parola', Validators.required)
    });
  }

  delete(): void{
    let password = this.form.get('password').value;
    this.authService.delete(password)
      .catch(err => {
        return Observable.throw(err);
      })
      .subscribe(res => {
        this.bsModalRef.hide();
        this.router.navigate(['/']);
      });
  }

}
