import store from '@/store';// path to store file
import router from '@/router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: store;
    $router: router;
  }
}