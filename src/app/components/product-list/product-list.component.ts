import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/module/product';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute } from '@angular/router';

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
  categoryList: string[] = ['men\'s clothing', 'jewelery', 'electronics', 'women\'s clothing'];
  newProduct: Product = {
    id: 0,
    title: '',
    price: 0,
    category: '',
    rating: {
      rate: 0,
      count: 0 
    },
    description:''
  };
  
  constructor(private productService: ProductService , private cartService: CartService,
     private message: NzMessageService , private activatedRoute:ActivatedRoute 
    ) {}

  ngOnInit(): void {

    this.activatedRoute.data.subscribe((data: any) => {
      const title = data.title || 'Titre par défaut';
      document.title = ` ${title}`;
    });

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
  isModalVisible = false;


    openAddProductModal(): void {
      this.isModalVisible = true;
    }
  
    handleCancel(): void {
      this.isModalVisible = false;
    }
  
    handleOk(): void {
      this.addProduct();
    }
    
    addProduct(): void {
      if (!this.newProduct.title || !this.newProduct.price || !this.newProduct.category
         || !this.newProduct.description ||!this.newProduct.rating.rate) {
        this.message.error('All fields are required!');
        return;
      }
  
      this.productService.addProduct(this.newProduct).subscribe(
        (response: any) => {
          response.rating = {
            count: this.newProduct.rating.count,
            rate: this.newProduct.rating.rate
          };
  
          this.products.unshift(response);
          this.filteredProducts = [...this.products];
  
          console.log('Product added successfully', response);
          this.message.success('Product added successfully!');
  
          // Reset newProduct
          this.newProduct = {
            id: 0,
            title: '',
            price: 0,
            category: '',
            rating: {
              rate: 0,
              count: 0
            },
            description: ''
          };
  
          setTimeout(() => {
            this.isModalVisible = false;
          }, 1500);
        },
        error => {
          console.error('Error adding product', error);
          this.message.error('Error adding product');
        }
      );
    }
    
  addToCart(product: Product): void {
    this.cartService.addProductToCart(product); 
  }
  
  }
    
    


