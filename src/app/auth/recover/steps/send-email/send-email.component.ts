import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '@services/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthShared } from '../../../auth.shared';
import { ToastService } from '@services/utils/toast.service';
import { IconComponent } from '../../../../shared/icon/icon.component';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [AuthShared,
            InputTextModule, RouterOutlet, ButtonModule, IconComponent, 
          ],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent {
  sendEmail!: FormGroup;

  constructor(private router: Router, private formbuilder: FormBuilder, private userService: UserService, private toastService: ToastService){}

  ngOnInit(): void {
    this.sendEmail = this.formbuilder.group({
      correo_electronico: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(32)]],
    })
    
  }

  onSubmit(){
    if(this.sendEmail.invalid){
      // Mark FormControls as Touched
      Object.keys(this.sendEmail.controls).forEach(field => {
        const control = this.sendEmail.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }

    this.userService.sendRecoveryEmail(this.sendEmail.value).subscribe({
      next: (response) => {

        this.userService.setData(this.sendEmail.get('correo_electronico')?.value);

        this.router.navigate(['recuperar-contraseña','verificar-codigo']);       
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
        this.userService.clearData()
      }
    })
  }


}
