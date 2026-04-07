// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-footer',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <footer class="footer">
//       <div class="footerIcons">
//         <div class="fIcon">🔗</div>
//       </div>
//       <div class="FooterLastText">© Crazy Car</div>
//     </footer>
//   `,
//   styleUrls: ['./footer.component.css']
// })
// export class FooterComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  // Assuming the image is placed in src/assets/Img/
  logoPath: string = 'assets/Logo.png';
}
