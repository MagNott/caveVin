import "../node_modules/bootstrap/dist/js/bootstrap.js";
import { loadHTML } from "./ajax_Class_Html.js";
import { ajaxClassVin, ajaxClassVinCepage } from "./init.js";
import { Table } from "./Classe_table_complete.js";
import { Combo } from "./Class_Combo2.js";
import { ajaxClassCouleur } from "./init.js";
import { ajaxClassAppellation } from "./init.js";
import { ajaxClassRegion } from "./init.js";
import { urlAppellationOrder } from "./init.js";
import { urlRegionOrder } from "./init.js";
import { urlCouleurOrder } from "./init.js";
import { urlVinAppellationRegionCouleur } from "./init.js";
import { urlVin } from "./init.js";
import { urlAcepage } from "./init.js";

("use strict");

function generationTableau(ajaxClass) {
  ajaxClass.Url = urlVinAppellationRegionCouleur;
  ajaxClass.get(
    (reponse) => {
      let tableauVin = new Table();
      tableauVin.id_zone = "zone-table-id";

      let tableauDisplay = document.getElementById("zone-table-id");
      tableauDisplay.innerHTML = "";

      const arrayXdimensions = JSON.parse(reponse)["VIN"];
      const mapFormated = arrayXdimensions.map((regionArray) => {
        return [
          regionArray.CODEVIN,
          regionArray.NOM_CUVEE,
          regionArray.CODEAPPELLATION,
          regionArray.APPELLATION[0].NOMAPPELLATION,
          regionArray.CODEREGION,
          regionArray.REGION[0].NOMREGION,
          regionArray.CODECOULEUR,
          regionArray.COULEUR[0].NOMCOULEUR,
          regionArray.TYPE_DE_CULTURE,
          regionArray.COMMENTAIRES,
        ];
      });
      tableauVin.data = mapFormated;
      tableauVin.header = ["Code Vin", "Nom cuvée", "Code appellation", "Appellation", "Code Région", "Nom région", "Code couleur", "Couleur", "Type de culture", "Commentaires"];
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

        let codeAppellation;
        let codeRegion;
        let codeCouleur;

        event.target.value.split("*").forEach((valeursSplitee, index) => {
          let input = document.createElement("input");
          let label = document.createElement("label");
          // if (index == 0) {
          //   input.disabled = true;
          // }

          label.innerHTML = `${tableauVin.header[index]} : &nbsp;`;
          input.id = `input${index}`;
          input.value = valeursSplitee;
          switch (index) {
            case 0:
              input.className = "d-none";
              label.className = "d-none";
              break;
            case 1:
              label.innerText = "Nom cuvée :\u00A0";
              //
              break;
            case 2:
              let spanAppellation = document.createElement("span");
              spanAppellation.id = "selectAppellation-id";
              input = spanAppellation;
              label.innerText = "Appellation :\u00A0";
              codeAppellation = valeursSplitee;
              break;
            case 3:
              input.className = "d-none";
              label.className = "d-none";
              break;
            case 4:
              let spanRegion = document.createElement("span");
              spanRegion.id = "selectRegion-id";
              input = spanRegion;
              label.innerText = "Région :\u00A0";
              codeRegion = valeursSplitee;
              break;
            case 5:
              input.className = "d-none";
              label.className = "d-none";
              break;
            case 6:
              let spanCouleur = document.createElement("span");
              spanCouleur.id = "selectCouleur-id";
              input = spanCouleur;
              label.innerText = "Couleur :\u00A0";
              codeCouleur = valeursSplitee;
              break;
            case 7:
              input.className = "d-none";
              label.className = "d-none";
              break;
            case 8:
              label.innerText = "Type de Culture :\u00A0";
              break;
            case 9:
              label.innerText = "Commentaire :\u00A0";
              break;
          }

          modal.appendChild(label);
          modal.appendChild(input);
          modal.appendChild(document.createElement("br"));
        });

        ajaxClassAppellation.Url = urlAppellationOrder;
        ajaxClassAppellation.get(
          (reponse) => {
            let comboAppellation = new Combo("selectAppellation-id", "selectAppellationDisplay-id", "comboClass");
            comboAppellation.data = JSON.parse(reponse)["APPELLATION"]["records"];
            comboAppellation.value_selected = codeAppellation;
            comboAppellation.genererCombo();
          },

          (error) => {
            console.log("La requete GET a échoué : ", error);
          }
        );

        ajaxClassRegion.Url = urlRegionOrder;
        ajaxClassRegion.get(
          (reponse) => {
            let comboRegion = new Combo("selectRegion-id", "selectRegionDisplay-id", "comboClass");

            comboRegion.data = JSON.parse(reponse)["REGION"]["records"];
            comboRegion.value_selected = codeRegion;
            comboRegion.genererCombo();
          },

          (error) => {
            console.log("La requete GET a échoué : ", error);
          }
        );

        ajaxClassCouleur.Url = urlCouleurOrder;
        ajaxClassCouleur.get(
          (reponse) => {
            let comboCouleur = new Combo("selectCouleur-id", "selectCouleurDisplay-id", "comboClass");
            comboCouleur.data = JSON.parse(reponse)["COULEUR"]["records"];
            comboCouleur.value_selected = codeCouleur;
            comboCouleur.genererCombo();
          },

          (error) => {
            console.log("La requete GET a échoué : ", error);
          }
        );
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

        ajaxClassVinCepage.Url = urlAcepage + event.target.value.split("*")[0];

        ajaxClassVinCepage.get(
          (reponse) => {
            let VinCepage = JSON.parse(reponse);
            let label = document.createElement("label");
            let VinCepageBoucle = VinCepage["CEPAGE"]["records"];

            let tabCepages = VinCepageBoucle.map((element) => {
              return element[1];
            });
            label.innerText = "Cépage : ";

            let ul = document.createElement("ul");
            label.appendChild(ul);
            tabCepages.forEach((element) => {
              let li = document.createElement("li");
              li.innerText = element;
              ul.appendChild(li);
            });

            modal.appendChild(label);
            modal.appendChild(document.createElement("br"));
          },
          (error) => {
            console.log("La requete GET a échoué : ", error);
          }
        );
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
      search("txtRech", "Vintbody");
    },
    (error) => {
      console.log("La requete GET a échoué : ", error);
    }
  );
}

function putVin(ajaxClass) {
  ajaxClass.Url = urlVin;
  let codeModif = document.getElementById("input0");
  ajaxClass.Cle = codeModif.value;
  let nomCuveeModif = document.getElementById("input1");
  let codeAppellationModif = document.getElementById("selectAppellationDisplay-id");
  let codeRegionModif = document.getElementById("selectRegionDisplay-id");
  let codeCouleurModif = document.getElementById("selectCouleurDisplay-id");
  let typeCultureMofif = document.getElementById("input8");
  let commentairesModif = document.getElementById("input9");

  if (nomCuveeModif.value.length == 0) {
    alert("Le nom de cuvée doit au moins contenir une lettre");
  } else if (typeCultureMofif.value.length == 0) {
    alert("Le type de culture doit au moins contenir une lettre");
  } else if (commentairesModif.value.length == 0) {
    alert("Le commentaire doit au moins contenir une lettre");
  } else {
    let vin = {
      NOM_CUVEE: nomCuveeModif.value,
      CODEAPPELLATION: codeAppellationModif.value,
      CODEREGION: codeRegionModif.value,
      CODECOULEUR: codeCouleurModif.value,
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
  let codeAppellationAjout = document.getElementById("selectAppellationDisplay-id");
  let regionAjout = document.getElementById("selectRegionDisplay-id");
  let couleurAjout = document.getElementById("selectCouleurDisplay-id");
  let cultureAjout = document.getElementById("culture");
  let commentairesAjout = document.getElementById("commentaires");

  if (cuveeAjout.value.length == 0) {
    alert(" Le vin doit au moins contenir une lettre");
  } else if (cultureAjout.value.length == 0) {
    alert(" Le type de culture doit au moins contenir une lettre");
  } else if (commentairesAjout.value.length == 0) {
    alert(" Le commentaire doit au moins contenir une lettre");
  } else {
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
  ajaxClass.Url = urlVin;
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

  generationTableau(ajaxClassVin);

  document.getElementById("modifVin-id").addEventListener("click", () => {
    putVin(ajaxClassVin);
  });

  document.getElementById("ajoutvin-id").addEventListener("click", () => {
    ajaxClassAppellation.Url = urlAppellationOrder;
    ajaxClassAppellation.get(
      (reponse) => {
        let comboAppellationAjout = new Combo("selectAjoutVinAppellation-id", "selectAppellationDisplay-id", "comboClass");
        comboAppellationAjout.data = JSON.parse(reponse)["APPELLATION"]["records"];
        document.getElementById("selectAjoutVinAppellation-id").innerHTML = "";
        comboAppellationAjout.genererCombo();
      },

      (error) => {
        console.log("La requete GET a échoué : ", error);
      }
    );
  });

  document.getElementById("ajoutvin-id").addEventListener("click", () => {
    ajaxClassRegion.Url = urlRegionOrder;
    ajaxClassRegion.get(
      (reponse) => {
        let comboRegionAjout = new Combo("selectAjoutVinRegion-id", "selectRegionDisplay-id", "comboClass");
        comboRegionAjout.data = JSON.parse(reponse)["REGION"]["records"];
        document.getElementById("selectAjoutVinRegion-id").innerHTML = "";
        comboRegionAjout.genererCombo();
      },

      (error) => {
        console.log("La requete GET a échoué : ", error);
      }
    );
  });

  document.getElementById("ajoutvin-id").addEventListener("click", () => {
    ajaxClassCouleur.Url = urlCouleurOrder;
    ajaxClassCouleur.get(
      (reponse) => {
        let comboCouleurAjout = new Combo("selectAjoutVinCouleur-id", "selectCouleurDisplay-id", "comboClass");
        comboCouleurAjout.data = JSON.parse(reponse)["COULEUR"]["records"];
        document.getElementById("selectAjoutVinCouleur-id").innerHTML = "";
        comboCouleurAjout.genererCombo();
      },

      (error) => {
        console.log("La requete GET a échoué : ", error);
      }
    );
  });

  document.getElementById("ajoutVinEnregistrer-id").addEventListener("click", () => {
    postVin(ajaxClassVin);
  });

  document.getElementById("supprVin-id").addEventListener("click", () => {
    delVin(ajaxClassVin);
  });
});
