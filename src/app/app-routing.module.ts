import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [

  
  {
    path: 'product',
    component: ProductListComponent,
    data: { title: 'Product List' }
  },

  { path: 'cart', 
    component: CartComponent,
    data: { title: 'Cart Shopping' }

  
  },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
