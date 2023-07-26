import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/@popperjs/core/dist/umd/popper.min.js";
import { loadHTML } from "./ajax_Class_Html.js";
import { ajaxClassAppellation } from "./init.js";
import { Table } from "./Classe_table_complete.js";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import { urlAppellationOrder } from "./init.js";
("use strict");

function generationTableau(ajaxClass) {
  ajaxClass.Url = urlAppellationOrder;
  ajaxClass.get(
    (reponse) => {
      let tableauAppellation = new Table();
      tableauAppellation.id_zone = "zone-table-id";

      let tableauDisplay = document.getElementById("zone-table-id");
      tableauDisplay.innerHTML = "";

      tableauAppellation.data = JSON.parse(reponse)["APPELLATION"]["records"];
      tableauAppellation.header = ["Code appellation", "Appellation"];
      tableauAppellation.BS_toggle_modal = "modal";
      tableauAppellation.BS_target_vue = "#vueAppellationModal";
      tableauAppellation.BS_target_modif = "#modifAppellationModal";
      tableauAppellation.BS_target_suppr = "#supprAppellationModal";
      tableauAppellation.id_tbody = "Appellationtbody";
      tableauAppellation.class_vue = "btn btn-secondary btn-sm bi bi-eye";
      tableauAppellation.class_modif = "btn btn-info btn-sm bi bi-pencil";
      tableauAppellation.class_suppr = "btn btn-danger btn-sm bi bi-trash";
      tableauAppellation.class_table = "table table-dark table-striped table-hover text-center align-middle";

      tableauAppellation.fonction_modif = function (event) {
        let modal = document.getElementById("modifAppellationModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let input = document.createElement("input");
          if (index == 0) {
            input.disabled = true;
          }
          let label = document.createElement("label");
          label.innerHTML = `${tableauAppellation.header[index]} : &nbsp;`;
          input.id = `input${index}`;
          input.value = valeursSplitee;
          modal.appendChild(label);
          modal.appendChild(input);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauAppellation.fonction_vue = function (event) {
        let modal = document.getElementById("vueAppellationModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          label.innerText = `${tableauAppellation.header[index]} : ${valeursSplitee}`;
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauAppellation.fonction_suppr = function (event) {
        let modal = document.getElementById("supprAppellationModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          if (index == 0) {
            label.innerHTML = `${tableauAppellation.header[index]} : <span id="codeSuppr-id">${valeursSplitee}</span>`;
          } else {
            label.innerText = `${tableauAppellation.header[index]} : ${valeursSplitee}`;
          }
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauAppellation.generer();
      search("txtRech", "Appellationtbody");
    },

    (error) => {
      console.log("La requete GET a échoué : ", error);
    }
  );
}

function putAppellation(ajaxClass) {
  let codeAppellationModif = document.getElementById("input0");
  ajaxClass.Cle = codeAppellationModif.value;
  let nomAppellationModif = document.getElementById("input1");

  if (nomAppellationModif.value.length == 0) {
    alert(" La region doit au moins contenir une lettre");
  } else {
    let appellation = {
      CODEAPPELLATION: codeAppellationModif.value,
      NOMAPPELLATION: nomAppellationModif.value,
    };

    ajaxClass.put(
      JSON.stringify(appellation),
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

function postAppellation(ajaxClass) {
  let nomAppellation = document.getElementById("appellation");

  if (nomAppellation.value.length == 0) {
    alert(" L'appellation doit au moins contenir une lettre");
  } else {
    let appellation = {
      NOMAPPELLATION: nomAppellation.value,
    };

    ajaxClass.post(
      JSON.stringify(appellation),
      () => {
        ajaxClass.Cle = "";
        document.getElementById("bandeauajout-id").classList.remove("d-none");
        document.getElementById("btnAjoutDismiss").addEventListener("click", () => {
          document.getElementById("bandeauajout-id").classList.add("d-none");
        });

        generationTableau(ajaxClass);
        nomAppellation.value = "";
      },
      () => {
        alert("Erreur");
      }
    );
  }
}

function delAppellation(ajaxClass) {
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

  generationTableau(ajaxClassAppellation);

  document.getElementById("modifAppellation-id").addEventListener("click", () => {
    putAppellation(ajaxClassAppellation);
  });

  document.getElementById("ajoutAppellation-id").addEventListener("click", () => {
    postAppellation(ajaxClassAppellation);
  });

  document.getElementById("supprAppellation-id").addEventListener("click", () => {
    delAppellation(ajaxClassAppellation);
  });
});
