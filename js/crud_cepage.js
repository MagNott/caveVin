import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/@popperjs/core/dist/umd/popper.min.js";
import { loadHTML } from "./ajax_Class_Html.js";
import { ajaxClassCepage } from "./init.js";
import { Table } from "./Classe_table_complete.js";
import { urlCepageOrder } from "./init.js";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";

("use strict");

function generationTableau(ajaxClass) {
  ajaxClass.Url = urlCepageOrder;
  ajaxClass.get(
    (reponse) => {
      let tableauCepage = new Table();
      tableauCepage.id_zone = "zone-table-id";

      let tableauDisplay = document.getElementById("zone-table-id");
      tableauDisplay.innerHTML = "";

      tableauCepage.data = JSON.parse(reponse)["CEPAGE"]["records"];
      tableauCepage.header = ["Code cépage", "Cépage"];
      tableauCepage.BS_toggle_modal = "modal";
      tableauCepage.BS_target_vue = "#vueCepageModal";
      tableauCepage.BS_target_modif = "#modifCepageModal";
      tableauCepage.BS_target_suppr = "#supprCepageModal";
      tableauCepage.id_tbody = "Cepagetbody";
      tableauCepage.class_vue = "btn btn-secondary btn-sm bi bi-eye";
      tableauCepage.class_modif = "btn btn-info btn-sm bi bi-pencil";
      tableauCepage.class_suppr = "btn btn-danger btn-sm bi bi-trash";
      tableauCepage.class_table = "table table-dark table-striped table-hover text-center align-middle";

      tableauCepage.fonction_modif = function (event) {
        let modal = document.getElementById("modifCepageModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let input = document.createElement("input");
          if (index == 0) {
            input.disabled = true;
          }
          let label = document.createElement("label");
          label.innerHTML = `${tableauCepage.header[index]} : &nbsp;`;
          input.id = `input${index}`;
          input.value = valeursSplitee;
          modal.appendChild(label);
          modal.appendChild(input);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauCepage.fonction_vue = function (event) {
        let modal = document.getElementById("vueCepageModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          label.innerText = `${tableauCepage.header[index]} : ${valeursSplitee}`;
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauCepage.fonction_suppr = function (event) {
        let modal = document.getElementById("supprCepageModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          if (index == 0) {
            label.innerHTML = `${tableauCepage.header[index]} : <span id="codeSuppr-id">${valeursSplitee}</span>`;
          } else {
            label.innerText = `${tableauCepage.header[index]} : ${valeursSplitee}`;
          }
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauCepage.generer();
      search("txtRech", "Cepagetbody");
    },

    (error) => {
      console.log("La requete GET a échoué : ", error);
    }
  );
}

function putCepage(ajaxClass) {
  let codeModif = document.getElementById("input0");
  ajaxClass.Cle = codeModif.value;
  let cepageModif = document.getElementById("input1");

  if (cepageModif.value.length == 0) {
    alert(" Le cepage doit au moins contenir une lettre et être écrit en majuscule");
  } else {
    let cepage = {
      NOMCEPAGE: cepageModif.value,
    };

    ajaxClass.put(
      JSON.stringify(cepage),
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

function postCepage(ajaxClass) {
  let cepageAjout = document.getElementById("cepage");

  if (cepageAjout.value.length == 0) {
    alert(" Le cepage doit au moins contenir une lettre");
  } else {
    let cepage = {
      NOMCEPAGE: cepageAjout.value,
    };

    ajaxClass.post(
      JSON.stringify(cepage),
      () => {
        ajaxClass.Cle = "";
        document.getElementById("bandeauajout-id").classList.remove("d-none");
        document.getElementById("btnAjoutDismiss").addEventListener("click", () => {
          document.getElementById("bandeauajout-id").classList.add("d-none");
        });

        generationTableau(ajaxClass);
        cepageAjout.value = "";
      },
      () => {
        alert("Erreur");
      }
    );
  }
}

function delCepage(ajaxClass) {
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

  generationTableau(ajaxClassCepage);

  document.getElementById("modifCepage-id").addEventListener("click", () => {
    putCepage(ajaxClassCepage);
  });

  document.getElementById("ajoutCepage-id").addEventListener("click", () => {
    postCepage(ajaxClassCepage);
  });

  document.getElementById("supprCepage-id").addEventListener("click", () => {
    delCepage(ajaxClassCepage);
  });
});
