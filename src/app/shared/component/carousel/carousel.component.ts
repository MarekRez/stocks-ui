import {Component, input, Input, signal} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {NgbCarousel, NgbSlide} from '@ng-bootstrap/ng-bootstrap';

interface CarouselImage {
  src: string;
  alt: string;
  title: string;
  caption: string;
  width?: string;
  height?: string;
}

@Component({
  selector: 'app-carousel',
  imports: [
    NgOptimizedImage,
    NgbCarousel,
    NgbSlide
  ],
  templateUrl: './carousel.component.html'
})
export class CarouselComponent {

  images = input.required<CarouselImage[]>();

}
