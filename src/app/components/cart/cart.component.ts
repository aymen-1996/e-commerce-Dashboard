import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from 'src/app/module/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: { product: Product; quantity: number }[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService , private activatedRoute:ActivatedRoute ) {}

  ngOnInit(): void {

    this.activatedRoute.data.subscribe((data: any) => {
      const title = data.title || 'Titre par défaut';
      document.title = ` ${title}`;
    });

    this.cartItems = this.cartService.getCart();
    this.cartService.totalPrice$.subscribe((price) => {
      this.totalPrice = price;
    });
  }

  removeFromCart(product: Product): void {
    this.cartService.removeFromCart(product); 
    this.cartItems = this.cartService.getCart();
  }
}
