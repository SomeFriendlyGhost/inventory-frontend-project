import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '../Interfaces/IProduct';
import { IProductList } from '../Interfaces/IProductList';
import { fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  map,
} from 'rxjs/operators';
@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {
  fullProductList: IProduct[] = [];
  subsetProductList: IProduct[] = [];
  pageStart: number = 0;
  pageEnd: number = 10
  startSearch: boolean = false;
  searchString: string = "";
  loaded: boolean = false;
  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.searchInput();
  }

  nextPage(): void{
    this.pageStart = this.pageEnd;
    this.pageEnd = this.pageEnd + 10;
    console.log(this.pageStart, this.pageEnd)
  }
  previousPage(): void{
    this.pageEnd = this.pageStart;
    this.pageStart = this.pageStart - 10;
    console.log(this.pageStart, this.pageEnd)
  }

  searchInput(): any{
     fromEvent(document.getElementById('type-ahead')!, 'keyup')
    .pipe(map(event => (event.target as HTMLInputElement).value), debounceTime(150))
    .subscribe(val  => {
      this.searchString = val;
      
      // For the sake of initial performance the list of products is read after the user starts searcing for products.
      if(this.startSearch == false){
        this.formatProductList();
        this.startSearch = true;
      }
      this.searchProductList();
    });
  }
  
  //sepperating the array from IProductList into an array of IProducts for it to be iteratable.
  formatProductList():any{
    this.getProducts().subscribe( data => {
      this.fullProductList = data.content.map(element =>{
       return element
      })
      console.log(this.fullProductList);
    })
  }
    // Reading data from json into a structured object <Observable<IProductList>> so it can be managed as such.
    getProducts(): Observable<IProductList> {
      return this.http.get<IProductList>("./assets/products.json");
    }

    //this method is used to only show products that meets the search requiremnts 
    searchProductList(): any{
    //a subset of the full productlist is stored in a seperat array for display in the view
    this.subsetProductList = this.fullProductList.filter(product => {
  
      //For us to be able to iterate trough each of the terms the search query is split into terms and stored into an array 
      let v = this.searchString.split(" ");
      //variable used to check if all the terms was in the product title
      let numberOfTerms = 0;

      //Iterate through the terms and count for each time there is a match with the product title 
      for(let term of v){
        if (product.title.match(term)){
          numberOfTerms = numberOfTerms +1;
        }
      }
      //if all the terms was in the product title, the number of correct terms should be == to the length of the terms array
      //Therefore the product must inlcude the terms of the search query and can be returned to the array of viewed products. 
      if (numberOfTerms == v.length){
        return product
      }
      else return
      })
    }
}