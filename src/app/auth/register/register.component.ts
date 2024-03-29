import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DialogComponent} from '@syncfusion/ej2-angular-popups';
import {EmitType} from '@syncfusion/ej2-base';
import {Title} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-register',
  styleUrls: ['register.component.css'],
  templateUrl: 'register.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
  form: FormGroup;

  @ViewChild('Dialog')
  public dialogObj: DialogComponent | undefined;
  public width: string = '335px';
  public visible: boolean = false;
  public showCloseIcon: Boolean = true;
  public formHeader: string = 'Error';
  public content: string = 'Wrong data, try again!';
  public target: string = '#control_wrapper';
  public isModal: boolean = true;
  public animationSettings: any = {
    effect: 'Zoom'
  };
  public textboxValue: any;
  private formSubmitAttempt: boolean | undefined;
  public dlgBtnClick: EmitType<object> = () => {
    this.dialogObj!.hide();
  }
  public dlgButtons: Object[] = [{click: this.dlgBtnClick.bind(this), buttonModel: {content: 'Ok', isPrimary: true}}];

  public focusoutfunction(args: any) {
    if (args.target.value !== '') {
      args.target.parentElement.getElementsByClassName('e-float-text')[0].classList.add('e-label-top');
    } else {
      args.target.parentElement.getElementsByClassName('e-float-text')[0].classList.remove('e-label-top');
    }
  }

  public Submit(): void {
    this.formSubmitAttempt = true;
    if (this.form!.valid) {
      this.authService.register(
        this.form.value.username,
        this.form.value.password,
        this.form.value.email,
      ).subscribe({
        next: (response) => {
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.dialogObj!.show();
        },
        complete: () => {
          this.form!.reset();
        }
      });
    }
  }





  constructor(private formBuilder: FormBuilder, private titleService: Title, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.titleService.setTitle('Register');
    this.form = this.formBuilder.group({
      username: [null, [Validators.required, Validators.minLength(2)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      email: [null, [Validators.required, Validators.email]]
    });
  }

  public isFieldValid(field: string) {
    return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
  }
}
