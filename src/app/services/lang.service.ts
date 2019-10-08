import { Subject } from 'rxjs';

export class LangService {
  private langSub = new Subject<{lang: string}>();

  getActiveLang() {
    return this.langSub;
  }

  setActiveLang(lng: string) {
    this.langSub.next({lang: lng});
  }

}
