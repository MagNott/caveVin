import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/@popperjs/core/dist/umd/popper.min.js";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import { loadHTML } from "./ajax_Class_Html.js";
import { ajaxClassCategorieMets } from "./init.js";
import { Table } from "./Classe_table_complete.js";
import { urlCategorieMetsOrder } from "./init.js";
import { urlCategorieMets } from "./init.js";
("use strict");

function generationTableau(ajaxClass) {
  ajaxClass.Url = urlCategorieMetsOrder;
  ajaxClass.get(
    (reponse) => {
      let tableauCategorieMets = new Table();
      tableauCategorieMets.id_zone = "zone-table-id";

      let tableauDisplay = document.getElementById("zone-table-id");
      tableauDisplay.innerHTML = "";

      tableauCategorieMets.data = JSON.parse(reponse)["CATEGORIE_METS"]["records"];
      tableauCategorieMets.header = ["Code catégorie mets", "Catégorie de mets"];
      tableauCategorieMets.BS_toggle_modal = "modal";
      tableauCategorieMets.BS_target_vue = "#vueCategorieMetsModal";
      tableauCategorieMets.BS_target_modif = "#modifCategorieMetsModal";
      tableauCategorieMets.BS_target_suppr = "#supprCategorieMetsModal";
      tableauCategorieMets.id_tbody = "CategorieMetstbody";
      tableauCategorieMets.class_vue = "btn btn-secondary btn-sm bi bi-eye";
      tableauCategorieMets.class_modif = "btn btn-info btn-sm bi bi-pencil";
      tableauCategorieMets.class_suppr = "btn btn-danger btn-sm bi bi-trash";
      tableauCategorieMets.class_table = "table table-dark table-striped table-hover text-center align-middle";

      tableauCategorieMets.fonction_modif = function (event) {
        let modal = document.getElementById("modifCategorieMetsModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let input = document.createElement("input");
          if (index == 0) {
            input.disabled = true;
          }
          let label = document.createElement("label");
          label.innerHTML = `${tableauCategorieMets.header[index]} : &nbsp;`;
          input.id = `input${index}`;
          input.value = valeursSplitee;
          modal.appendChild(label);
          modal.appendChild(input);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauCategorieMets.fonction_vue = function (event) {
        let modal = document.getElementById("vueCategorieMetsModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          label.innerText = `${tableauCategorieMets.header[index]} : ${valeursSplitee}`;
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauCategorieMets.fonction_suppr = function (event) {
        let modal = document.getElementById("supprCategorieMetsModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          if (index == 0) {
            label.innerHTML = `${tableauCategorieMets.header[index]} : <span id="codeSuppr-id">${valeursSplitee}</span>`;
          } else {
            label.innerText = `${tableauCategorieMets.header[index]} : ${valeursSplitee}`;
          }
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauCategorieMets.generer();
      search("txtRech", "CategorieMetstbody");
    },

    (error) => {
      console.log("La requete GET a échoué : ", error);
    }
  );
}

function putCategorieMets(ajaxClass) {
  let codeModif = document.getElementById("input0");
  ajaxClass.Cle = codeModif.value;
  ajaxClass.Url = urlCategorieMets
  let CategorieMetsModif = document.getElementById("input1");

  if (CategorieMetsModif.value.length == 0) {
    alert(" Le categorie mets doit au moins contenir une lettre et être écrit en majuscule");
  } else {
    let CategorieMets = {
      LIBELLE_CATEGORIE: CategorieMetsModif.value,
    };

    ajaxClass.put(
      JSON.stringify(CategorieMets),
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

function postCategorieMets(ajaxClass) {
  let CategorieMetsAjout = document.getElementById("CategorieMets");
  


  if (CategorieMetsAjout.value.length == 0) {
    alert(" La catégorie mets doit au moins contenir une lettre");
  } else {
    let CategorieMets = {
      LIBELLE_CATEGORIE: CategorieMetsAjout.value,
    };
    ajaxClass.post(
      JSON.stringify(CategorieMets),
      () => {
        ajaxClass.Cle = "";
        document.getElementById("bandeauajout-id").classList.remove("d-none");
        document.getElementById("btnAjoutDismiss").addEventListener("click", () => {
        document.getElementById("bandeauajout-id").classList.add("d-none");
        });

        generationTableau(ajaxClass);
        CategorieMetsAjout.value = "";
      },
      () => {
        alert("Erreur");
      }
    );
  }
}

function delCategorieMets(ajaxClass) {
  let codeSuppr = document.getElementById("codeSuppr-id").textContent;
  ajaxClass.Cle = codeSuppr;
  ajaxClass.Url = urlCategorieMets;
  
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

  generationTableau(ajaxClassCategorieMets);

  document.getElementById("modifCategorieMets-id").addEventListener("click", () => {
    putCategorieMets(ajaxClassCategorieMets);
  });

  document.getElementById("ajoutCategorieMets-id").addEventListener("click", () => {
    postCategorieMets(ajaxClassCategorieMets);
  });

  document.getElementById("supprCategorieMets-id").addEventListener("click", () => {
    delCategorieMets(ajaxClassCategorieMets);
  });


});
