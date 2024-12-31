import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../module/product';
interface CartItem {
  product: Product; 
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = []; 
  private cartCountSubject = new BehaviorSubject<number>(0);
  private totalPriceSubject = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCountSubject.asObservable();
  totalPrice$ = this.totalPriceSubject.asObservable();
  
  addProductToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity++; 
    } else {
      this.cartItems.push({ product, quantity: 1 });  
    }

    this.updateCartState();  
  }

  removeFromCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity--;
      } else {
        this.cartItems = this.cartItems.filter(item => item.product.id !== product.id);
      }
    }

    this.updateCartState();
  }
  private updateCartState(): void {
    this.cartCountSubject.next(this.cartItems.length);  
    this.updateTotalPrice();  
  }

  private updateTotalPrice(): void {
    let total = 0;
    this.cartItems.forEach(item => {
      total += item.product.price * item.quantity; 
    });
    this.totalPriceSubject.next(total);  
  }
  getCart(): CartItem[] {
    return this.cartItems;
  }
}
