// import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/@popperjs/core/dist/umd/popper.min.js";
import { loadHTML } from "./ajax_Class_Html.js";
import { ajaxClassMets } from "./init.js";
import { Table } from "./Classe_table_complete.js";
import { urlMetsCategorieMets } from "./init.js";
import { urlMets } from "./init.js";
import { urlCategorieMetsOrder } from "./init.js";
import { ajaxClassCategorieMets } from "./init.js";
import { Combo } from "./Class_Combo.js";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";

("use strict");

function generationTableau(ajaxClass) {
  ajaxClass.Url = urlMetsCategorieMets;
  ajaxClass.get(
    (reponse) => {
      let tableauMets = new Table();
      tableauMets.id_zone = "zone-table-id";

      let tableauDisplay = document.getElementById("zone-table-id");
      tableauDisplay.innerHTML = "";

      const arrayXdimensions = JSON.parse(reponse)["METS"];
      const mapFormated = arrayXdimensions.map((regionArray) => {
        return [regionArray.CODEMETS, regionArray.ID_CATEGORIE_METS, regionArray.CATEGORIE_METS[0].LIBELLE_CATEGORIE, regionArray.NOM, regionArray.LIEN_RECETTE];
      });
      tableauMets.data = mapFormated;
      // tableauMets.data = JSON.parse(reponse)["METS"]["records"];
      tableauMets.header = ["Code met", " Code categorie de mets", "Nom d'une catégorie de mets", "Nom du met", "Lien de la recette"];
      tableauMets.BS_toggle_modal = "modal";
      tableauMets.BS_target_vue = "#vueMetsModal";
      tableauMets.BS_target_modif = "#modifMetsModal";
      tableauMets.BS_target_suppr = "#supprMetsModal";
      tableauMets.id_tbody = "Metstbody";
      tableauMets.class_vue = "btn btn-secondary btn-sm bi bi-eye";
      tableauMets.class_modif = "btn btn-info btn-sm bi bi-pencil";
      tableauMets.class_suppr = "btn btn-danger btn-sm bi bi-trash";
      tableauMets.class_table = "table table-dark table-striped table-hover text-center align-middle";

      tableauMets.fonction_modif = function (event) {
        let modal = document.getElementById("modifMetsModalBody");
        modal.innerHTML = "";
        let codeMets;
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let input = document.createElement("input");
          let label = document.createElement("label");
          label.innerHTML = `${tableauMets.header[index]} : &nbsp;`;
          input.id = `input${index}`;
          input.value = valeursSplitee;
          switch (index) {
            case 0:
              input.className = "d-none";
              label.className = "d-none";
              break;
            case 1:
              let span = document.createElement("span");
              span.id = "selectCategorieMets-id";
              input = span;
              label.innerText = "Catégorie mets :\u00A0";
              codeMets = valeursSplitee;
              break;
            case 2:
              input.className = "d-none";
              label.className = "d-none";
              break;
            case 3:
              label.innerText = "Nom met :\u00A0";
              break;
          }
          modal.appendChild(label);
          modal.appendChild(input);
          modal.appendChild(document.createElement("br"));
        });
        ajaxClassCategorieMets.Url = urlCategorieMetsOrder;
        console.log(urlCategorieMetsOrder);
        ajaxClassCategorieMets.get(
          (reponse) => {
            let comboMets = new Combo("selectCategorieMets-id", "selectCategorieMetsDisplay-id", "comboClass");
            console.log(JSON.parse(reponse));
            comboMets.data = JSON.parse(reponse)["CATEGORIE_METS"]["records"];
            comboMets.value_selected = codeMets;
            comboMets.genererCombo();
          },

          (error) => {
            console.log("La requete GET a échoué : ", error);
          }
        );
      };

      tableauMets.fonction_vue = function (event) {
        let modal = document.getElementById("vueMetsModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          label.innerText = `${tableauMets.header[index]} : ${valeursSplitee}`;
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauMets.fonction_suppr = function (event) {
        let modal = document.getElementById("supprMetsModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          if (index == 0) {
            label.innerHTML = `${tableauMets.header[index]} : <span id="codeSuppr-id">${valeursSplitee}</span>`;
          } else {
            label.innerText = `${tableauMets.header[index]} : ${valeursSplitee}`;
          }
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauMets.generer();
      search("txtRech", "Metstbody");
    },

    (error) => {
      console.log("La requete GET a échoué : ", error);
    }
  );
}

function putMets(ajaxClass) {
  ajaxClass.Url = urlMets;
  let codeModif = document.getElementById("input0");
  ajaxClass.Cle = codeModif.value;
  let categorieMetsModif = document.getElementById("selectCategorieMetsDisplay-id");
  let nomMetsModif = document.getElementById("input3");
  let nomRecetteModif = document.getElementById("input4");

  if (nomMetsModif.value.length == 0) {
    alert(" Le met doit au moins contenir une lettre.");
  } else if (nomRecetteModif.value.length == 0) {
    alert(" L'url de la recette doit au moins contenir une lettre.");
  } else {
    let mets = {
      ID_CATEGORIE_METS: categorieMetsModif.value,
      NOM: nomMetsModif.value,
      LIEN_RECETTE: nomRecetteModif.value,
    };

    ajaxClass.put(
      JSON.stringify(mets),
      () => {
        ajaxClass.Cle = "";
        document.getElementById("bandeaumodif-id").classList.remove("d-none");
        generationTableau(ajaxClass);
        document.getElementById("btnModifDismiss").addEventListener("click", () => {
          document.getElementById("bandeaumodif-id").classList.add("d-none");
        });
        generationTableau(ajaxClass);
      },
      () => {
        alert("Erreur");
      }
    );
  }
}

function postMets(ajaxClass) {
  let metsAjout = document.getElementById("mets");
  let categorieMets = document.getElementById("ajoutMetsCombo-id");
  let lienRecette = document.getElementById("lienRecette");

  if (metsAjout.value.length == 0) {
    alert(" Le met doit au moins contenir une lettre");
  } else {
    let mets = {
      ID_CATEGORIE_METS: categorieMets.value,
      NOM: metsAjout.value,
      LIEN_RECETTE: lienRecette.value,
    };

    ajaxClass.post(
      JSON.stringify(mets),
      () => {
        ajaxClass.Cle = "";
        document.getElementById("bandeauajout-id").classList.remove("d-none");
        document.getElementById("btnAjoutDismiss").addEventListener("click", () => {
          document.getElementById("bandeauajout-id").classList.add("d-none");
        });

        generationTableau(ajaxClass);
        metsAjout.value = "";
        categorieMets.value = "";
        lienRecette.value = "";
      },
      () => {
        alert("Erreur");
      }
    );
  }
}

function delMets(ajaxClass) {
  ajaxClass.Url = urlMets;
  let codeSuppr = document.getElementById("codeSuppr-id").textContent;
  ajaxClass.Cle = codeSuppr;

  ajaxClass.del(
    () => {
      ajaxClass.Cle = "";
      document.getElementById("bandeausuppr-id").classList.remove("d-none");
      document.getElementById("btnSupprDismiss").addEventListener("click", () => {
        document.getElementById("bandeausuppr-id").classList.add("d-none");
      });
      generationTableau(ajaxClass);
    },
    () => {
      alert("Erreur");
    }
  );
}

function search(zoneRechercheId, tbodyId) {
  let zoneRecherche = document.getElementById(zoneRechercheId);
  zoneRecherche.value = "";
  zoneRecherche.addEventListener(
    "keyup",
    () => {
      let rows = document.getElementById(tbodyId).getElementsByTagName("tr");
      for (let item of rows) {
        if (!item.innerText.includes(zoneRecherche.value)) {
          item.classList.add("visually-hidden"); // Classe BS
        } else {
          item.classList.remove("visually-hidden"); // Classe BS
        }
      }
    },
    false
  );
}

window.addEventListener("load", () => {
  let header = new loadHTML("header-id", "./header_footer/HEADER.html");
  // let header = new loadHTML("header-id"); // Produit une erreur
  let footer = new loadHTML("footer-id", "./header_footer/FOOTER.html");
  // let footer = new loadHTML(); // Produit une erreur

  header.load();
  footer.load();
  // Ne doit pas être compris dans le click pour être sur d'avoir une portée sur tout le code
  // c'est pour ca que le second paramettre du load est une fonction fléchée

  generationTableau(ajaxClassMets);

  document.getElementById("modifMets-id").addEventListener("click", () => {
    putMets(ajaxClassMets);
  });

  document.getElementById("ajoutMetsModal-id").addEventListener("click", () => {
    // Petit cours improvisé sur le nommage
    // camel case  => uneVariableNommeCommeCa
    // upper camel case => UneVariableNommeCommeCa
    // snake case => une_variable_nomme_comme_ca
    // spinal case (kebab case) => pas-une-variable-nomme-comme-ca
    ajaxClassCategorieMets.get(
      (reponse) => {
        let comboCategorieMetsAjout = new Combo("selectAjoutMetCategorie-id", "ajoutMetsCombo-id", "comboClass");
        comboCategorieMetsAjout.data = JSON.parse(reponse)["CATEGORIE_METS"]["records"];
        document.getElementById("selectAjoutMetCategorie-id").innerHTML = "";
        comboCategorieMetsAjout.genererCombo();
      },

      (error) => {
        console.log("La requete GET a échoué : ", error);
      }
    );
  });

  document.getElementById("ajoutMets-id").addEventListener("click", () => {
    postMets(ajaxClassMets);
  });

  document.getElementById("supprMets-id").addEventListener("click", () => {
    delMets(ajaxClassMets);
  });
});
