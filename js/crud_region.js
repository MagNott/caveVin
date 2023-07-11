import { loadHTML } from "./ajax_Class_Html.js";
import { ajaxClassRegion } from "./init.js";
import { Table } from "./Classe_table_complete.js";

("use strict");


  function generationTableau(ajaxClass) {
    ajaxClass.get(
      (reponse) => {
        let tableauRegion = new Table();
        tableauRegion.id_zone = "zone-table-id";

        let tableauDisplay = document.getElementById("zone-table-id");
        tableauDisplay.innerHTML = "";

        tableauRegion.data = JSON.parse(reponse)["REGION"]["records"];
        tableauRegion.header = JSON.parse(reponse)["REGION"]["columns"];
        tableauRegion.BS_toggle_modal = "modal";
        tableauRegion.BS_target_vue = "#vueRegionModal";
        tableauRegion.BS_target_modif = "#modifRegionModal";
        tableauRegion.BS_target_suppr = "#supprRegionModal";
        tableauRegion.id_tbody = "Regiontbody";
        tableauRegion.class_vue = "btn btn-secondary btn-sm bi bi-eye";
        tableauRegion.class_modif = "btn btn-info btn-sm bi bi-pencil";
        tableauRegion.class_suppr = "btn btn-danger btn-sm bi bi-trash";
        tableauRegion.class_table = "table table-dark table-striped table-hover";

        tableauRegion.fonction_modif = function (event) {
          let modal = document.getElementById("modifRegionModalBody");
          modal.innerHTML = "";
          event.target.value.split("*").forEach((valeursSplitee, index) => {
            let input = document.createElement("input");
            if (index == 0) {
              input.disabled = true;
            }
            let label = document.createElement("label");
            label.innerHTML = `${tableauRegion.header[index]} : &nbsp;`;
            input.id = `input${index}`;
            input.value = valeursSplitee;
            modal.appendChild(label);
            modal.appendChild(input);
            modal.appendChild(document.createElement("br"));
          });
        };

        tableauRegion.fonction_vue = function (event) {
          let modal = document.getElementById("vueRegionModalBody");
          modal.innerHTML = "";
          event.target.value.split("*").forEach((valeursSplitee, index) => {
            let label = document.createElement("label");
            label.innerText = `${tableauRegion.header[index]} : ${valeursSplitee}`;
            modal.appendChild(label);
            modal.appendChild(document.createElement("br"));
          });
        };

        tableauRegion.fonction_suppr = function (event) {
          let modal = document.getElementById("supprRegionModalBody");
          modal.innerHTML = "";
          event.target.value.split("*").forEach((valeursSplitee, index) => {
            let label = document.createElement("label");
            if (index == 0) {
              label.innerHTML = `${tableauRegion.header[index]} : <span id="codeSuppr-id">${valeursSplitee}</span>`;
            } else {
              label.innerText = `${tableauRegion.header[index]} : ${valeursSplitee}`;
            }
            modal.appendChild(label);
            modal.appendChild(document.createElement("br"));
          });
        };

        tableauRegion.generer();
        search("txtRech", "regiontbody");
      },

      (error) => {
        console.log("La requete GET a échoué : ", error);
      }
    );
  }

  function putRegion(ajaxClass) {
    let codeModif = document.getElementById("input0");
    ajaxClass.Cle = codeModif.value;
    let marqueModif = document.getElementById("input1");
    let couleurModif = document.getElementById("input2");
    let cylindreeModif = document.getElementById("input3");

    let car = {
      marque: marqueModif.value,
      couleur: couleurModif.value,
      cylindree: cylindreeModif.value,
    };

    ajaxClass.put(
      JSON.stringify(car),
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

  function postRegion(ajaxClass) {
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

      ajaxClass.post(
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

  function delRegion(ajaxClass) {
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

    generationTableau(ajaxClassRegion);

    document.getElementById("modifRegion-id").addEventListener("click", () => {
      putRegion(ajaxClassRegion);
    });

    document.getElementById("ajoutRegion-id").addEventListener("click", () => {
      postRegion(ajaxClassRegion);
    });

    document.getElementById("supprRegion-id").addEventListener("click", () => {
      delRegion(ajaxClassRegion);
    });
  });

