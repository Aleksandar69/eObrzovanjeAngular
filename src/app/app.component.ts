import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eobrazovanjeProjekat';

constructor(private elementRef: ElementRef){}

  ngAfterViewInit(){
    //this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#212121';

 }
}
