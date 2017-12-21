import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  pageTitle: string = 'Product Detail';
  product: IProduct;
  errorMessage: string;
  
  constructor(private _route: ActivatedRoute, 
				private _router: Router, 
				private _productService: ProductService) { }
				
  
  ngOnInit():void {
	//route.snapshot or .observable to get updated pathParams
	//convert str to numeric using '+'  
	const param = +this._route.snapshot.paramMap.get('id');
	if(param) {
		const id = +param;
		this.pageTitle += `: ${id}`;
		this.getProduct(id);
	}
	
	/*this.product = {	
        "productId": 10,
        "productName": "Video Game Controller",
        "productCode": "GMG-0042",
        "releaseDate": "October 15, 2015",
        "description": "Standard two-button video game controller",
        "price": 35.95,
        "starRating": 4.6,
        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/120337/xbox-controller_01.png"    
	};*/
  }
  
  getProduct(id: number) {
	  this._productService.getProduct(id).subscribe(
	  product => this.product = product, 
	  error => this.errorMessage = <any>error);
  }
  onBack(): void {
	  this._router.navigate(['/products']);
  }

}
