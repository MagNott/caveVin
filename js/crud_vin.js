import '../node_modules/bootstrap/dist/js/bootstrap.js'

import { loadHTML } from "./ajax_Class_Html.js";
import { ajaxClassVin } from "./init.js";
import { Table } from "./Classe_table_complete.js";

("use strict");


  function generationTableau(ajaxClass) {
    ajaxClass.get(
      (reponse) => {
        let tableauVin = new Table();
        tableauVin.id_zone = "zone-table-id";

        let tableauDisplay = document.getElementById("zone-table-id");
        tableauDisplay.innerHTML = "";

        tableauVin.data = JSON.parse(reponse)["VIN"]["records"];
        tableauVin.header = JSON.parse(reponse)["VIN"]["columns"];
        tableauVin.BS_toggle_modal = "modal";
        tableauVin.BS_target_vue = "#vueVinModal";
        tableauVin.BS_target_modif = "#modifVinModal";
        tableauVin.BS_target_suppr = "#supprVinModal";
        tableauVin.id_tbody = "Vintbody";
        tableauVin.class_vue = "btn btn-secondary btn-sm bi bi-eye";
        tableauVin.class_modif = "btn btn-info btn-sm bi bi-pencil";
        tableauVin.class_suppr = "btn btn-danger btn-sm bi bi-trash";
        tableauVin.class_table = "table table-dark table-striped table-hover";

        tableauVin.fonction_modif = function (event) {
          let modal = document.getElementById("modifVinModalBody");
          modal.innerHTML = "";
          event.target.value.split("*").forEach((valeursSplitee, index) => {
            let input = document.createElement("input");
            if (index == 0) {
              input.disabled = true;
            }
            let label = document.createElement("label");
            label.innerHTML = `${tableauVin.header[index]} : &nbsp;`;
            input.id = `input${index}`;
            input.value = valeursSplitee;
            modal.appendChild(label);
            modal.appendChild(input);
            modal.appendChild(document.createElement("br"));
          });
        };

        tableauVin.fonction_vue = function (event) {
          let modal = document.getElementById("vueVinModalBody");
          modal.innerHTML = "";
          event.target.value.split("*").forEach((valeursSplitee, index) => {
            let label = document.createElement("label");
            label.innerText = `${tableauVin.header[index]} : ${valeursSplitee}`;
            modal.appendChild(label);
            modal.appendChild(document.createElement("br"));
          });
        };

        tableauVin.fonction_suppr = function (event) {
          let modal = document.getElementById("supprVinModalBody");
          modal.innerHTML = "";
          event.target.value.split("*").forEach((valeursSplitee, index) => {
            let label = document.createElement("label");
            if (index == 0) {
              label.innerHTML = `${tableauVin.header[index]} : <span id="codeSuppr-id">${valeursSplitee}</span>`;
            } else {
              label.innerText = `${tableauVin.header[index]} : ${valeursSplitee}`;
            }
            modal.appendChild(label);
            modal.appendChild(document.createElement("br"));
          });
        };

        tableauVin.generer();
        search("txtRech", "vintbody");
      },

      (error) => {
        console.log("La requete GET a échoué : ", error);
      }
    );
  }

  function putVin(ajaxClass) {
    let codeModif = document.getElementById("input0");
    ajaxClass.Cle = codeModif.value;
    let nomCuveeModif = document.getElementById("input1");
    let codeAppellationModif = document.getElementById("input2");
    let codeRegionModif = document.getElementById("input3");
    let codeCouleurModif = document.getElementById("input4");
    let typeCultureMofif = document.getElementById("input5");
    let commentairesModif = document.getElementById("input6");
    let majuscules = /^[A-Z]+$/;

    if (nomCuveeModif.value.length == 0 || !majuscules.test(nomCuveeModif.value) ) {
      alert(" Le nom de cuvée doit au moins contenir une lettre et être en majuscule");
    } else if (codeAppellationModif.value.length == 0) {
      alert(" L'appellation doit au moins contenir une lettre");
    } else if (codeRegionModif.value.length == 0) {
      alert(" La région doit au moins contenir une lettre");
    } else if (codeCouleurModif.value.length == 0) {
      alert(" La couleur doit au moins contenir une lettre");
    } else if (typeCultureMofif.value.length == 0){
      alert(" Le type de culture doit au moins contenir une lettre");
    } else if (commentairesModif.value.length == 0){
      alert(" Le commentaire doit au moins contenir une lettre");
    } else {
      let vin = {
        NOM_CUVEE: nomCuveeModif.value,
        CODEAPPELLATION: codeAppellationModif.value,
        CODEREGION: codeRegionModif.value,
        CODECOULEUR:codeCouleurModif.value,
        TYPE_DE_CULTURE: typeCultureMofif.value,
        COMMENTAIRES: commentairesModif.value,
      };

      ajaxClass.put(
        JSON.stringify(vin),
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

  function postVin(ajaxClass) {
    let cuveeAjout = document.getElementById("cuvee");
    let codeAppellationAjout = document.getElementById("appellation");
    let regionAjout = document.getElementById("region");
    let couleurAjout = document.getElementById("couleur");
    let cultureAjout = document.getElementById("culture");
    let commentairesAjout = document.getElementById("commentaires");

    if (cuveeAjout.value.length == 0) {
      alert(" Le vin doit au moins contenir une lettre");
    } else if (codeAppellationAjout.value.length == 0) {
      alert(" La couleur doit au moins contenir une lettre");
    } else if (regionAjout.value.length == 0) {
      alert(" La couleur doit au moins contenir une lettre");
    } else if (couleurAjout.value.length == 0) {
      alert(" La couleur doit au moins contenir une lettre");
    } else if (cultureAjout.value.length == 0) {
      alert(" La couleur doit au moins contenir une lettre");
    } else if (commentairesAjout.value.length == 0) {
      alert(" La couleur doit au moins contenir une lettre");
    }else {      
      let vin = {
        NOM_CUVEE: cuveeAjout.value,
        CODEAPPELLATION: codeAppellationAjout.value,
        CODEREGION: regionAjout.value,
        CODECOULEUR: couleurAjout.value,
        TYPE_DE_CULTURE: cultureAjout.value,
        COMMENTAIRES: commentairesAjout.value,
      };

      ajaxClass.post(
        JSON.stringify(vin),
        () => {
          ajaxClass.Cle = "";
          document.getElementById("bandeauajout-id").classList.remove("d-none");
          document.getElementById("btnAjoutDismiss").addEventListener("click", () => {
            document.getElementById("bandeauajout-id").classList.add("d-none");
          });

          generationTableau(ajaxClass);
          cuveeAjout.value = "";
          codeAppellationAjout.value = "";
          regionAjout.value = "";
          couleurAjout.value = "";
          cultureAjout.value = "";
          commentairesAjout.value = "";
        },
        () => {
          alert("Erreur");
        }
      );
    }
  }

  function delVin(ajaxClass) {
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

    generationTableau(ajaxClassVin);

    document.getElementById("modifVin-id").addEventListener("click", () => {
      putVin(ajaxClassVin);
    });

    document.getElementById("ajoutVin-id").addEventListener("click", () => {
      postVin(ajaxClassVin);
    });

    document.getElementById("supprVin-id").addEventListener("click", () => {
      delVin(ajaxClassVin);
    });
  });

