// https://getbootstrap.com/docs/5.0/getting-started/introduction/
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "../node_modules/@popperjs/core/dist/umd/popper.min.js"
// import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
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
    

      dataAccordMetsVin.METS.forEach((met) => {
        // Data récupéré mets + vin et comme j'ai voulu faire des cards mets, j'ai filtré le for each avec .METS
      
        let vinCommentaires = met.S_ACCORDE_AVEC.map((accord) => {
          //array map pour pour gérer la pop over et récupérer un tableau des vins et de leur commentaire
          //on for each sur les met c'est pourquoi on le note met.S_ACCORDE.... 
          //pour chaque met on a une entrée s'accorde avec
          //le parametre itterateur accord vas itterer sur une data
          return accord.VIN.map((vinCourant) => { 
            return [vinCourant.NOM_CUVEE, vinCourant.COMMENTAIRES]
          });
        });

        // avec le for each on a une triple boucle imbriquée... le for each contiens un array map qui return les accords et sert de
        // base pour refaire un array map pour return le tableau nom + comm du vin
        //la 1ere boucle est sur l'api MET, la 2nde boucle va chercher les accords et la 3ème parcours le tableau des 
        // vins et return un tableau avec len om du vin et le commmentaire - c'est ca qui sert pour popover

      let popovervinCommentaires = vinCommentaires.map((vinEtCommentaire) => {
        //utilisation de la variable vin commentaire qui contien et le vin et le commentaire pour faire un array map
        // et compléter les popovers 
        // on utilise le template litterals pour fabriquer le contenu de la card et popover
          return `<button type="button" class="btn btn-lg btn-light" data-bs-toggle="popover" 
            data-bs-title="Commentaire" 
            data-bs-placement="right" 
            data-bs-content="${vinEtCommentaire[0][1]}">${vinEtCommentaire[0][0]}</button>` 
            // les index permettent d'acceder aux élements voulu, comme le double map return finalement un tableau a 2 dimensions
            // on doit appeler avec des doubles index pour place le nom du vin au bon endroit et le commentaire aussi  
        }).join("");
        // le join permet d'éviter un affichage tableau avec des virgules 

      // template litterals pour remplir la cards
        const cardHTML = `
          <div class="card text-center">
          <div class="card-header"><b><h4>
            ${met.NOM}</h5></b>
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
          <br>
        `;
        
        //on peut utiliser des emojis dans le code 
        cardContainer.innerHTML += cardHTML;
        
        
      });
     
      var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
      popoverTriggerList.forEach(function (popoverTriggerEl) {
        new bootstrap.Popover(popoverTriggerEl)
      })
      // ces lignes servent pour initialiser les popover, càd que le commentaire s'affiche au clic grace à cette doc
      // https://getbootstrap.com/docs/5.0/components/popovers/
    }, 
    (error) => {
      console.log("La requete GET a échoué : ", error);
    }
  )
});
