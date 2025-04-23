import {effect, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private key = 'theme';

  private current = signal< 'light' | 'dark' >(
    (localStorage.getItem(this.key) as 'dark' | 'light') ?? 'light'
  );

  theme = this.current.asReadonly();

  constructor() {
    effect(() => {
      const t = this.current();
      document.documentElement.setAttribute('data-bs-theme', t);
      localStorage.setItem(this.key, t);
    });
  }

  toggle() {
    this.current.set(this.current() === 'dark' ? 'light' : 'dark');
  }
}
