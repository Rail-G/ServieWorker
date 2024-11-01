import {ajax} from 'rxjs/ajax';
import {catchError, interval, take, mergeMap} from 'rxjs';

export default class NewsController {
  constructor() {
    this.newsBody = document.querySelector('.news-body');
    this.updBtn = document.querySelector('.nb-reload');
    this.defaultThemeSet;
  }

  init() {
    this.sendRequest();
    this.sendRequest = this.sendRequest.bind(this);
    this.updBtn.addEventListener('click', this.sendRequest);
  }

  sendRequest() {
    this.newsBody.innerHTML = '';
    this.setDefaultTheme();
    this.defaultThemeSet = true;
    const obs$ = interval(5000).pipe(
        take(5),
        mergeMap(() => {
          return ajax.getJSON('https://serviceworkerserver.onrender.com');
        }),
        catchError((error) => {
          return error;
        }),
    );

    obs$.subscribe({
      next: (value) => {
        this.drawNewsPage(value);
      },
      error: () => this.showError(),
    });
  }

  drawNewsPage(value) {
    if (this.defaultThemeSet) {
      this.removeDefaultTheme();
      this.defaultThemeSet = false;
    }
    this.newsBody.insertAdjacentHTML(
        'afterbegin',
        NewsController.newsBlock(value),
    );
  }

  setDefaultTheme() {
    for (let i = 0; i < 5; i++) {
      this.newsBody.insertAdjacentHTML(
          'afterbegin',
          NewsController.defaultTheme(),
      );
    }
  }

  removeDefaultTheme() {
    this.newsBody.innerHTML = '';
  }

  showError() {
    this.newsBody.insertAdjacentHTML('afterbegin', NewsController.errorBlock());
  }

  static defaultTheme() {
    return `
        <div class="news-def">
            <div class="n-title-def">
                <span class="n-title-name-def"></span>
                <span class="n-title-date-def"></span>
            </div>
            <div class="n-body-def">
                <div class="n-img-def"></div>
                <div class="n-text-def">
                    <div class="n-text-def-2"></div>
                </div>
            </div>
        </div>
        `;
  }

  static newsBlock(value) {
    return `
            <div class="news">
                <div class="n-title">
                    <span class="n-title-name">${value.title}</span>
                    <span class="n-title-date">${value.posted}</span>
                </div>
                <div class="n-body">
                    <div class="n-img">
                        <img src="${value.img}" alt="">
                    </div>
                    <div class="n-text">
                        ${value.text}
                    </div>
                </div>
            </div>
        `;
  }

  static errorBlock() {
    return `
            <div class="error-absolute-block">
                <div class="error-block">
                <span class="error-text">Не удалось загрузить данные.
                <br> Проверьте интернет соединению и обновите страницу :(</span>
                </div>
            </div>
        `;
  }
}
