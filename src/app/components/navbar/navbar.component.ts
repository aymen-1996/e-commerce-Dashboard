import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from 'src/app/module/product';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartCount: number = 0; 
  showPendingInvitesDropdown: boolean = false;
  cartItems: { product: Product; quantity: number }[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCart();
    this.cartService.totalPrice$.subscribe((price) => {
      this.totalPrice = price;
    });
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;  
    });
  }


  
togglePendingCartDropdown() {
  this.showPendingInvitesDropdown = !this.showPendingInvitesDropdown;
}


removeFromCart(product: Product): void {
  this.cartService.removeFromCart(product); 
  this.cartItems = this.cartService.getCart();
}

}
