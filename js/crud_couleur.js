import { loadHTML } from "./ajax_Class_Html.js";
import { ajaxClassCouleur } from "./init.js";
import { Table } from "./Classe_table_complete.js";

("use strict");

function generationTableau(ajaxClass) {
  ajaxClass.get(
    (reponse) => {
      let tableauCouleur = new Table();
      tableauCouleur.id_zone = "zone-table-id";

      let tableauDisplay = document.getElementById("zone-table-id");
      tableauDisplay.innerHTML = "";

      tableauCouleur.data = JSON.parse(reponse)["COULEUR"]["records"];
      tableauCouleur.header = JSON.parse(reponse)["COULEUR"]["columns"];
      tableauCouleur.BS_toggle_modal = "modal";
      tableauCouleur.BS_target_vue = "#vueCouleurModal";
      tableauCouleur.BS_target_modif = "#modifCouleurModal";
      tableauCouleur.BS_target_suppr = "#supprCouleurModal";
      tableauCouleur.id_tbody = "Couleurtbody";
      tableauCouleur.class_vue = "btn btn-secondary btn-sm bi bi-eye";
      tableauCouleur.class_modif = "btn btn-info btn-sm bi bi-pencil";
      tableauCouleur.class_suppr = "btn btn-danger btn-sm bi bi-trash";
      tableauCouleur.class_table = "table table-dark table-striped table-hover";

      tableauCouleur.fonction_modif = function (event) {
        let modal = document.getElementById("modifCouleurModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let input = document.createElement("input");
          if (index == 0) {
            input.disabled = true;
          }
          let label = document.createElement("label");
          label.innerHTML = `${tableauCouleur.header[index]} : &nbsp;`;
          input.id = `input${index}`;
          input.value = valeursSplitee;
          modal.appendChild(label);
          modal.appendChild(input);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauCouleur.fonction_vue = function (event) {
        let modal = document.getElementById("vueCouleurModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          label.innerText = `${tableauCouleur.header[index]} : ${valeursSplitee}`;
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauCouleur.fonction_suppr = function (event) {
        let modal = document.getElementById("supprCouleurModalBody");
        modal.innerHTML = "";
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let label = document.createElement("label");
          if (index == 0) {
            label.innerHTML = `${tableauCouleur.header[index]} : <span id="codeSuppr-id">${valeursSplitee}</span>`;
          } else {
            label.innerText = `${tableauCouleur.header[index]} : ${valeursSplitee}`;
          }
          modal.appendChild(label);
          modal.appendChild(document.createElement("br"));
        });
      };

      tableauCouleur.generer();
      search("txtRech", "couleurtbody");
    },

    (error) => {
      console.log("La requete GET a échoué : ", error);
    }
  );
}

function putCouleur(ajaxClass) {
  let codeModif = document.getElementById("input0");
  ajaxClass.Cle = codeModif.value;
  let couleurModif = document.getElementById("input1");
  if (couleurModif.value.lenght == 0) {
    alert(" Le pays doit au moins contenir une lettre");
    event.preventDefault();
  } else {
    let couleur = {
      NOMCOULEUR: couleurModif.value,
    };

    ajaxClass.put(
      JSON.stringify(couleur),
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

function postCouleur(ajaxClass) {
  let marqueAjout = document.getElementById("marque");
  let couleurAjout = document.getElementById("couleur");
  let cylindreeAjout = document.getElementById("cylindree");

  if (marqueAjout.value.length == 0) {
    alert(" La marque doit au moins contenir une lettre");
    event.preventDefault();
  } else if (couleurAjout.value.length == 0) {
    alert(" La couleur doit au moins contenir une lettre");
    event.preventDefault();
  } else {
    let car = {
      marque: marqueAjout.value,
      couleur: couleurAjout.value,
      cylindree: cylindreeAjout.value,
    };

    ajaxClass.postCouleur(
      JSON.stringify(car),
      () => {
        ajaxClass.Cle = "";
        document.getElementById("bandeauajout-id").classList.remove("d-none");
        document.getElementById("btnAjoutDismiss").addEventListener("click", () => {
          document.getElementById("bandeauajout-id").classList.add("d-none");
        });

        generationTableau(ajaxClass);
        marqueAjout.value = "";
        couleurAjout.value = "";
        cylindree.value = "";
      },
      () => {
        alert("Erreur");
      }
    );
  }
}

function delCouleur(ajaxClass) {
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

  generationTableau(ajaxClassCouleur);

  document.getElementById("modifCouleur-id").addEventListener("click", () => {
    putCouleur(ajaxClassCouleur);
  });

  document.getElementById("ajoutCouleur-id").addEventListener("click", () => {
    postCouleur(ajaxClassCouleur);
  });

  document.getElementById("supprCouleur-id").addEventListener("click", () => {
    delCouleur(ajaxClassCouleur);
  });
});
