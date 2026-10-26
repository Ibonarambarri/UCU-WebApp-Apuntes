/** Volver a la pantalla anterior. Si no hay anterior (por ejemplo en la web
 * entraste directo pegando la URL `/tasks/3`), vamos a la Home.
 */
export function goBackOrHome(router) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}
