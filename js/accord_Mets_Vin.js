import "../node_modules/bootstrap/dist/js/bootstrap.js";

import { loadHTML } from "./ajax_Class_Html.js";
import { Ajax_Es6 } from "./Ajax_class.js";

("use strict");

let urlmetsvin = "http://fbrc.esy.es/DWWM22239/Api/api.php/METS?include=VIN&transform=1";
let ajaxClassMetsVin = new Ajax_Es6(urlmetsvin);
ajaxClassMetsVin.get(
  (reponse) => {
    let card = document.getElementById("json-object");
    let MetsVin = JSON.parse(reponse);
    console.log(MetsVin);
    card.innerHTML = JSON.stringify(MetsVin, null, 2);
  },

  (error) => {
    console.log("La requete GET a échoué : ", error);
  }
);

window.addEventListener("load", () => {
  let header = new loadHTML("header-id", "./header_footer/HEADER.html");
  // let header = new loadHTML("header-id"); // Produit une erreur
  let footer = new loadHTML("footer-id", "./header_footer/FOOTER.html");
  // let footer = new loadHTML(); // Produit une erreur

  header.load();
  footer.load();
  // Ne doit pas être compris dans le click pour être sur d'avoir une portée sur tout le code
  // c'est pour ca que le second paramettre du load est une fonction fléchée
});
