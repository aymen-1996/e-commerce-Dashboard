import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/module/product';

interface ColumnItem {
  name: string;
  sortOrder: string | null;
  sortFn: ((a: Product, b: Product) => number) | null;
  filterMultiple: boolean;
  listOfFilter: { text: string; value: string }[];
  filterFn: ((list: string[], product: Product) => boolean) | null;
  sortDirections: string[];
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  listOfColumns: ColumnItem[] = [];
  searchTerm = '';
  selectedCategory: string | null = null;
  sortOrderPrice: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.ProductList();
    this.initializeColumns();
  }

  ProductList() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      console.log('productList', this.products);
      this.filteredProducts = data;
    });
  }

  initializeColumns() {
    this.listOfColumns = [
      {
        name: 'Name',
        sortOrder: null,
        sortFn: null,    
        sortDirections: [],  
        filterMultiple: true,
        listOfFilter: this.products.map((product) => ({ text: product.title, value: product.title })),
        filterFn: (list: string[], product: Product) => list.some(title => product.title.includes(title)),
      },
      {
        name: 'Category',
        sortOrder: null,  
        sortFn: null,   
        sortDirections: [], 
        filterMultiple: true,
        listOfFilter: this.getUniqueCategories(),
        filterFn: (list: string[], product: Product) => list.some(category => product.category === category),
      },
    ];
  }


  sortByPrice(a: Product, b: Product): number {
    return a.price - b.price;
  }

  getUniqueCategories() {
    const categories = Array.from(new Set(this.products.map(product => product.category)));
    return categories.map(category => ({ text: category, value: category }));
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesName = this.searchTerm ? product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      return matchesName && matchesCategory;
    });
  }
}

