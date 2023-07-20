// https://getbootstrap.com/docs/5.0/getting-started/introduction/
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/@popperjs/core/dist/umd/popper.min.js";
// import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import { loadHTML } from "./ajax_Class_Html.js";
import { Ajax_Es6 } from "./Ajax_class.js";
import { urlMetsVin } from "./init.js";
("use strict");

window.addEventListener("load", () => {
  let header = new loadHTML("header-id", "./header_footer/HEADER.html");
  // let header = new loadHTML("header-id"); // Produit une erreur
  let footer = new loadHTML("footer-id", "./header_footer/FOOTER.html");
  // let footer = new loadHTML(); // Produit une erreur

  header.load();
  footer.load();
  // Ne doit pas être compris dans le click pour être sur d'avoir une portée sur tout le code
  // c'est pour ca que le second paramettre du load est une fonction fléchée

  const cardContainer = document.getElementById("card-container-id");

  const ajax = new Ajax_Es6(urlMetsVin);
  ajax.get(
    (reponse) => {
      let dataAccordMetsVin = JSON.parse(reponse);
      let rowOpen;
      let containerGenere = '<div class="row row-flex">';

      dataAccordMetsVin.METS.forEach((met, index) => {
        let vinCommentaires = met.S_ACCORDE_AVEC.map((accord) => {
          return accord.VIN.map((vinCourant) => {
            return [vinCourant.NOM_CUVEE, vinCourant.COMMENTAIRES];
          });
        });

        let popovervinCommentaires = vinCommentaires
          .map((vinEtCommentaire) => {
            // const vin = vinCommentaires[0];
            // const commentaire = vinCommentaires[1];
            //  data-bs-content = vin[0]
            //   NOM DU VIN = vin[1]
            return `<button type="button" class="btn btn-lg btn-light" data-bs-toggle="popover" 
            data-bs-title="Commentaire" 
            data-bs-placement="right" 
            data-bs-content="${vinEtCommentaire[0][1]}">${vinEtCommentaire[0][0]}</button>`;
          })
          .join("");

        // 0 1 2 au lieu des noms des vins

        // if (index % 2 === 0) {
        //   containerGenere += `<div class="row">`;
        //   rowOpen = true; // Marquer la div row comme ouverte
        // }

        const cardHTML = `   
        <div class="col-md-6 my-2">
          <div class="card text-center">
            <div class="card-header">
              <b>
                <h5>
                  ${met.NOM}
                </h5>
              </b>
            </div>
            <div class="card-body">
              <h5 class="card-title">🍷 Les vins pouvants accompagner ce plat sont : </h5>
              ${popovervinCommentaires}
              <p class="card-text"><em>Cliquez sur le vin pour connaitre son commentaire</em></p>
            </div>
            <div class="card-footer text-body-secondary">
              <a href="${met.LIEN_RECETTE}" target="blank" class="btn btn-primary">Voir la recette</a>
            </div>
          </div>
          </div>
        `;

        containerGenere += cardHTML;

        // if (index % 2 === 1 || index === vinCommentaires.length - 1) {
        //   containerGenere += `</div>`;
        //   rowOpen = false; // Marquer la div row comme fermée
        // }

        // if (rowOpen) {
        //   containerGenere += `</div> `;
        // }

        // `
        // <div class="row">
        //   <div class="col-sm-6 mb-3 mb-sm-0">
        //     <div class="card">
        //     <div class="card-header">
        //     ${met.NOM}
        //     </div>
        //         <div class="card-body">
        //         <h5 class="card-title">🍷 Les vins pouvants accompagner ce plat sont :
        //         ${popovervinCommentaires}</h5>
        //         <p class="card-text"><em>Cliquez sur le vin pour connaitre son commentaire</em></p>
        //         <div class="card-footer text-body-secondary">
        //         <a href="${met.LIEN_RECETTE}" class="btn btn-primary">Voir la recette</a>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        //   <div class="col-sm-6">
        //     <div class="card">
        //     <div class="card-header">
        //     ${met.NOM}
        //     </div>
        //       <div class="card-body">
        //         <h5 class="card-title"> 🍷 Les vins pouvants accompagner ce plat sont :  ${popovervinCommentaires}</h5>
        //         <p class="card-text"><em>Cliquez sur le vin pour connaitre son commentaire</em></p>
        //         <div class="card-footer text-body-secondary">
        //         <a href=" ${met.LIEN_RECETTE}" class="btn btn-primary">Voir la recette</a>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        //  </div>`;
      });

      cardContainer.innerHTML = containerGenere + `</div> `;

      // https://getbootstrap.com/docs/5.0/components/popovers/
      var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
      popoverTriggerList.forEach(function (popoverTriggerEl) {
        new bootstrap.Popover(popoverTriggerEl);
      });
    },
    (error) => {
      console.log("La requete GET a échoué : ", error);
    }
  );
});
