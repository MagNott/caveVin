import { loadHTML }  from "./ajax_Class_Html.js"
// import '../node_modules/bootstrap/dist/js/bootstrap.js'
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";

// Programme PRINCIPAL
window.addEventListener("load", (event) => {
  //////////////////////////////////////
  // Recuperation du header
  //////////////////////////////////////

  let header = new loadHTML("header-id", "./header_footer/HEADER.html");
  // let header = new loadHTML("header-id"); // Produit une erreur
  let footer = new loadHTML("footer-id", "./header_footer/FOOTER.html");
  // let footer = new loadHTML(); // Produit une erreur

  header.load();
  footer.load();
});