import {Component, signal} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

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
    NgOptimizedImage
  ],
  templateUrl: './carousel.component.html'
})
export class CarouselComponent {

  images = signal<CarouselImage[]>([]);

}
