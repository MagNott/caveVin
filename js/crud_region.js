import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import { loadHTML } from "./ajax_Class_Html.js";
import { ajaxClassRegion } from "./init.js";
import { Table } from "./Classe_table_complete.js";
import { Combo } from "./Class_Combo.js";
import { ajaxClassPays, urlRegionNomPays } from "./init.js";
import { urlPaysOrder } from "./init.js";
import { urlRegion } from "./init.js";

("use strict");

function generationTableau(ajaxClass) {
  ajaxClass.Url = urlRegionNomPays;
  ajaxClass.get(
    (reponse) => {
      let tableauRegion = new Table();
      tableauRegion.id_zone = "zone-table-id";

      let tableauDisplay = document.getElementById("zone-table-id");
      tableauDisplay.innerHTML = "";

      const arrayXdimensions = JSON.parse(reponse)["REGION"];
      const mapFormated = arrayXdimensions.map((regionArray) => {
        return [regionArray.CODEREGION, regionArray.CODEPAYS, regionArray.PAYS[0].NOMPAYS, regionArray.NOMREGION];
      });
      tableauRegion.data = mapFormated;

      tableauRegion.header = ["Code Région", "Code Pays", "Pays", "Nom région"];
      tableauRegion.BS_toggle_modal = "modal";
      tableauRegion.BS_target_vue = "#vueRegionModal";
      tableauRegion.BS_target_modif = "#modifRegionModal";
      tableauRegion.BS_target_suppr = "#supprRegionModal";
      tableauRegion.id_tbody = "Regiontbody";
      tableauRegion.class_vue = "btn btn-secondary btn-sm bi bi-eye";
      tableauRegion.class_modif = "btn btn-info btn-sm bi bi-pencil";
      tableauRegion.class_suppr = "btn btn-danger btn-sm bi bi-trash";
      tableauRegion.class_table = "table table-dark table-striped table-hover text-center align-middle";

      tableauRegion.fonction_modif = function (event) {
        let modal = document.getElementById("modifRegionModalBody");
        modal.innerHTML = "";
        let codePays;
        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let input = document.createElement("input");
          let label = document.createElement("label");
          label.innerHTML = `${tableauRegion.header[index]} : &nbsp;`;
          input.id = `input${index}`;
          input.value = valeursSplitee;
          switch (index) {
            case 0:
              input.className = "d-none";
              label.className = "d-none";
              break;
            case 1:
              let span = document.createElement("span");
              span.id = "selectPays-id";
              input = span;
              label.innerText = "PAYS :\u00A0";
              codePays = valeursSplitee;
              break;
            case 2:
              input.className = "d-none";
              label.className = "d-none";
              break;
            case 3:
              label.innerText = "Nom Région :\u00A0";
              break;
          }
          modal.appendChild(label);
          modal.appendChild(input);
          modal.appendChild(document.createElement("br"));
        });

        ajaxClassPays.Url = urlPaysOrder;
        ajaxClassPays.get(
          (reponse) => {
            let comboRegion = new Combo("selectPays-id", "selectPaysDisplay-id", "comboClass");
            comboRegion.data = JSON.parse(reponse)["PAYS"]["records"];
            comboRegion.value_selected = codePays;
            comboRegion.genererCombo();
          },

          (error) => {
            console.log("La requete GET a échoué : ", error);
          }
        );
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
      search("txtRech", "Regiontbody");
    },

    (error) => {
      console.log("La requete GET a échoué : ", error);
    }
  );
}

function putRegion(ajaxClass) {
  ajaxClass.Url = urlRegion;
  let codeRegionModif = document.getElementById("input0");
  ajaxClass.Cle = codeRegionModif.value;
  let codePaysModif = document.getElementById("selectPaysDisplay-id");
  let nomRegionModif = document.getElementById("input3");

  if (nomRegionModif.value.length == 0) {
    alert(" La region doit au moins contenir une lettre");
  } else {
    let region = {
      CODEPAYS: codePaysModif.value,
      NOMREGION: nomRegionModif.value,
    };

    ajaxClass.put(
      JSON.stringify(region),
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

function postRegion(ajaxClass) {
  let codePaysAjout = document.getElementById("selectPaysDisplay-id");
  let nomRegionAjout = document.getElementById("nomRegion");

  if (codePaysAjout.value.length == 0) {
    alert(" Le pays doit au moins contenir une lettre");
  } else if (nomRegionAjout.value.length == 0) {
    alert(" La région doit au moins contenir une lettre");
  } else {
    let region = {
      CODEPAYS: codePaysAjout.value,
      NOMREGION: nomRegionAjout.value,
    };

    ajaxClass.post(
      JSON.stringify(region),
      () => {
        ajaxClass.Cle = "";
        document.getElementById("bandeauajout-id").classList.remove("d-none");
        document.getElementById("btnAjoutDismiss").addEventListener("click", () => {
          document.getElementById("bandeauajout-id").classList.add("d-none");
        });

        generationTableau(ajaxClass);
        codePaysAjout.value = "";
        nomRegionAjout.value = "";
      },
      () => {
        alert("Erreur");
      }
    );
  }
}

function delRegion(ajaxClass) {
  ajaxClass.Url = urlRegion;
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

  generationTableau(ajaxClassRegion);

  document.getElementById("modifRegion-id").addEventListener("click", () => {
    putRegion(ajaxClassRegion);
  });

  document.getElementById("ajoutregion-id").addEventListener("click", () => {
    ajaxClassPays.Url = urlPaysOrder;
    ajaxClassPays.get(
      (reponse) => {
        let comboRegionAjout = new Combo("selectAjoutPays-id", "selectPaysDisplay-id", "comboClass");
        comboRegionAjout.data = JSON.parse(reponse)["PAYS"]["records"];
        document.getElementById("selectAjoutPays-id").innerHTML = "";
        comboRegionAjout.genererCombo();
      },

      (error) => {
        console.log("La requete GET a échoué : ", error);
      }
    );
  });

  document.getElementById("ajoutRegion-id").addEventListener("click", () => {
    postRegion(ajaxClassRegion);
  });

  document.getElementById("supprRegion-id").addEventListener("click", () => {
    delRegion(ajaxClassRegion);
  });
});
