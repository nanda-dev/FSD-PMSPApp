import { Component, OnInit } from '@angular/core';
import { IProduct } from './product';
import { ProductService } from './product.service';
ProductService

@Component({
	selector: 'pm-products',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.css']
	
})
export class ProductListComponent implements OnInit {
	pageTitle: string = 'List of Products';
	imageWidth: number = 50;
	imageMargin: number = 2;
	showImage: boolean = false;
	errorMessage: string;
	
	/*products: IProduct[] = [
		{
			"productId": 1,
			"productName": "Leaf Rake",
			"productCode": "GDN-0011",
			"releaseDate": "March 19, 2016",
			"description": "Leaf rake with 48-inch wooden handle.",
			"price": 19.95,
			"starRating": 3.2,
			"imageUrl": "http://openclipart.org/image/300px/svg_to_png/26215/Anonymous_Leaf_Rake.png"
		},
		{
			"productId": 2,
			"productName": "Garden Cart",
			"productCode": "GDN-0023",
			"releaseDate": "March 18, 2016",
			"description": "15 gallon capacity rolling garden cart",
			"price": 32.99,
			"starRating": 4.2,
			"imageUrl": "http://openclipart.org/image/300px/svg_to_png/58471/garden_cart.png"
		}
	];*/
	products: IProduct[];
	filteredProducts: IProduct[];
	
	//listFilter: string = 'cart';
	_listFilter: string;
	get listFilter(): string {
		return this._listFilter;
	}
	set listFilter(value: string) {
		this._listFilter = value;
		this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
	}
	
	constructor(private _productService: ProductService) {
		//this.filteredProducts = this.products;//Move to ngOnInit()
		//this.listFilter = 'cart';
	}	
	
	ngOnInit(): void {
		console.log('In OnInit');
		this._productService.getProducts()
			.subscribe(products => {
				this.products = products;
				this.filteredProducts = this.products;
			}, 
			error => this.errorMessage = <any>error);
		
	}
	
	toggleImage(): void {
		this.showImage = !this.showImage;
	}
	
	performFilter(filterBy: string): IProduct[] {
		console.log('performFilter for:' + filterBy);
		filterBy = filterBy.toLocaleLowerCase();
		return this.products.filter((product: IProduct) => 
				product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1);
	}
	
	onRatingClicked(message: string): void {
		this.pageTitle = 'Product List [' + message + ']';
	}
}	
	