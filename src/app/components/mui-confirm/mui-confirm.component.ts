import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-mui-confirm',
  templateUrl: './mui-confirm.component.html',
  styleUrls: ['./mui-confirm.component.css']
})
export class MuiConfirmComponent {
  @Input() open: boolean = false;
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
