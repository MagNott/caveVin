import '../node_modules/bootstrap/dist/js/bootstrap.js'

import { loadHTML } from "./ajax_Class_Html.js";
import { ajaxClassPays } from "./init.js";
import { Table } from "./Classe_table_complete.js";

("use strict");

function generationTableau(ajaxClass) {
  ajaxClass.get(
    (reponse) => {
      let tableauPays = new Table();
      tableauPays.id_zone = "zone-table-id";

      let tableauDisplay = document.getElementById("zone-table-id");
      tableauDisplay.innerHTML = "";

      tableauPays.data = JSON.parse(reponse)["PAYS"]["records"];
      tableauPays.header = JSON.parse(reponse)["PAYS"]["columns"];
      tableauPays.BS_toggle_modal = "modal";
      tableauPays.BS_target_vue = "#vuePaysModal";
      tableauPays.BS_target_modif = "#modifPaysModal";
      tableauPays.BS_target_suppr = "#supprPaysModal";
      tableauPays.id_tbody = "Paystbody";
      tableauPays.class_vue = "btn btn-secondary btn-sm bi bi-eye";
      tableauPays.class_modif = "btn btn-info btn-sm bi bi-pencil";
      tableauPays.class_suppr = "btn btn-danger btn-sm bi bi-trash";
      tableauPays.class_table = "table table-dark table-striped table-hover";

      tableauPays.fonction_modif = function (event) {
        let modal = document.getElementById("modifPaysModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let input = document.createElement("input");
          if (index == 0) {
            input.disabled = true;
          }
          let label = document.createElement("label");
          label.innerHTML = `${tableauPays.header[index]} : &nbsp;`;
          input.id = `input${index}`;
          input.value = valeursSplitee;
          modal.appendChild(label);
          modal.appendChild(input);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauPays.fonction_vue = function (event) {
        let modal = document.getElementById("vuePaysModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          label.innerText = `${tableauPays.header[index]} : ${valeursSplitee}`;
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauPays.fonction_suppr = function (event) {
        let modal = document.getElementById("supprPaysModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          if (index == 0) {
            label.innerHTML = `${tableauPays.header[index]} : <span id="codeSuppr-id">${valeursSplitee}</span>`;
          } else {
            label.innerText = `${tableauPays.header[index]} : ${valeursSplitee}`;
          }
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauPays.generer();
      search("txtRech", "paystbody");
    },

    (error) => {
      console.log("La requete GET a échoué : ", error);
    }
  );
}

function putPays(ajaxClass) {
  let codeModif = document.getElementById("input0");
  ajaxClass.Cle = codeModif.value;
  let paysModif = document.getElementById("input1");

  if (paysModif.value.length == 0) {
    alert(" Le pays doit au moins contenir une lettre");
    event.preventDefault();
  } else {
    let pays = {
      NOMPAYS: paysModif.value,
    };

    ajaxClass.put(
      JSON.stringify(pays),
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

function postPays(ajaxClass) {
  let paysAjout = document.getElementById("pays");

  if (paysAjout.value.length == 0) {
    alert(" Le pays doit au moins contenir une lettre");
    event.preventDefault();
  } else {
    let pays = {
      NOMPAYS: paysAjout.value,
    };

    ajaxClass.post(
      JSON.stringify(pays),
      () => {
        ajaxClass.Cle = "";
        document.getElementById("bandeauajout-id").classList.remove("d-none");
        document.getElementById("btnAjoutDismiss").addEventListener("click", () => {
          document.getElementById("bandeauajout-id").classList.add("d-none");
        });

        generationTableau(ajaxClass);
        paysAjout.value = "";
      },
      () => {
        alert("Erreur");
      }
    );
  }
}

function delPays(ajaxClass) {
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

function search(saisie, table) {
  let zoneRecherche = document.getElementById(saisie);
  zoneRecherche.value = "";
  zoneRecherche.addEventListener(
    "keyup",
    () => {
      let rows = document.getElementById(table).getElementsByTagName("tr");
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

  generationTableau(ajaxClassPays);

  document.getElementById("modifPays-id").addEventListener("click", () => {
    putPays(ajaxClassPays);
  });

  document.getElementById("ajoutPays-id").addEventListener("click", () => {
    postPays(ajaxClassPays);
  });

  document.getElementById("supprPays-id").addEventListener("click", () => {
    delPays(ajaxClassPays);
  });
});
