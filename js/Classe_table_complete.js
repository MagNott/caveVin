"use strict";
import "../node_modules/bootstrap/dist/js/bootstrap.js";

export class Table {
  id_zone = "";
  class_table = "";
  data = [];
  header = [];
  class_modif = "";
  class_suppr = "";
  class_vue = "";
  icone_modif = "";
  icone_vue = "";
  icone_suppr = "";
  separateur = "*";
  BS_class_vue = "";
  BS_class_modif = "";
  BS_class_suppr = "";
  BS_toggle_modal = "";
  BS_target_vue = "";
  BS_target_modif = "";
  BS_target_suppr = "";
  id_tbody = "";
  append = false;
  fonction_vue;
  fonction_modif;
  fonction_suppr;

  // il faut initialiser les "variables de classes"

  generer() {
    if (this.id_zone === undefined) {
      throw new Error("Pour générer une table, il faut préciser la proprieté id_zone");
      //lève une erreur si id zone est vide
      //je ne prévois pas de try catch car si id-zone est vide, rien ne peut marcher
    }
    //génération de la table
    let zoneTable = document.getElementById(this.id_zone);
    let tableau = document.createElement("table");
    tableau.className = this.class_table;

    //generation du Thead
    let ligneh = document.createElement("tr");
    let ajusttab = 0;

    if (typeof this.fonction_modif == "function" || typeof this.fonction_suppr == "function" || typeof this.fonction_vue == "function") {
      this.header.push("Actions");
      // pur ajouter action sans s'embeter
      ajusttab = 1; // pour temporiser les colonnes sinon une en trop
    }

    this.header.forEach((tableHeader) => {
      //ici on génére les head du tableau
      let celluleheader = document.createElement("th");
      celluleheader.innerText = tableHeader;
      ligneh.appendChild(celluleheader);
    });

    let thead = document.createElement("thead");
    thead.appendChild(ligneh);
    tableau.appendChild(thead);
    let tbody = document.createElement("tbody");
    tbody.id = this.id_tbody;

    //ici on génére le body du tableau
    this.data.forEach((lignedata) => {
      let ligne = document.createElement("tr");
      for (let index = 0; index < this.header.length - ajusttab; index++) {
        // ajusttab pour temporiser
        // le -1 compense le fait que le push a "rajouter" une colonne
        //un boucle dans la boucle pour avoir autant de cellule de body que de cellule de head
        let cellule = document.createElement("td");
        cellule.innerText = lignedata[index];
        ligne.appendChild(cellule);
      }

      // condition d'affichage de la colonne action
      if (typeof this.fonction_modif == "function" || typeof this.fonction_vue == "function" || typeof this.fonction_suppr == "function") {
        let actionColonne = document.createElement("td");
        ligne.appendChild(actionColonne);

        if (typeof this.fonction_vue == "function") {
          // condition d'affichage des boutons
          let buttonVue = document.createElement("button");
          buttonVue.value = lignedata.join(this.separateur); // on prends les éléments du tableau, on les joint en les séparant avec le déparateur,
          // ainsi ca devient une grosse chaine de caractère
          buttonVue.className = `${this.class_vue} ${this.icone_vue}`; // paramétrage de la classe bootstrap (et de l'icone)
          buttonVue.dataset.bsToggle = this.BS_toggle_modal;
          buttonVue.dataset.bsTarget = this.BS_target_vue;
          buttonVue.addEventListener("click", this.fonction_vue, false); // pour qu'il s'activent au clic

          actionColonne.appendChild(buttonVue);
        }

        if (typeof this.fonction_modif == "function") {
          let buttonModifier = document.createElement("button");
          buttonModifier.value = lignedata.join(this.separateur);
          buttonModifier.className = `${this.class_modif} ${this.icone_modif}`;
          buttonModifier.dataset.bsToggle = this.BS_toggle_modal;
          buttonModifier.dataset.bsTarget = this.BS_target_modif;
          buttonModifier.addEventListener("click", this.fonction_modif, false);

          actionColonne.appendChild(buttonModifier);
        }

        if (typeof this.fonction_suppr == "function") {
          let buttonSupprimer = document.createElement("button");
          buttonSupprimer.value = lignedata.join(this.separateur);
          buttonSupprimer.className = `${this.class_suppr} ${this.icone_suppr}`;
          // on est embeté avec les icones si on ne le fait pas comme ca,  car sinon
          // ca clique sur l'icone et pas sur le bouton... donc j'ai supprimé la balise i qui contenais les font awesome
          // et je l'ai appliqué direct sur mon bouton
          buttonSupprimer.dataset.bsToggle = this.BS_toggle_modal; // ces 2 lignes cervent pour afifcher les modales
          buttonSupprimer.dataset.bsTarget = this.BS_target_suppr; //
          buttonSupprimer.addEventListener("click", this.fonction_suppr, false);

          actionColonne.appendChild(buttonSupprimer);
        }
      }

      tbody.appendChild(ligne);
    });
    tableau.appendChild(tbody);

    if (this.append === true) {
      zoneTable.appendChild(tableau);
    } else {
      zoneTable.innerHTML = "";
      zoneTable.appendChild(tableau); // ces deux lignes a la place du replaceWith parce que sinon
      //il supprime carrement la div et l'id qui permet de se rattacher dessus
    }

    if (typeof this.fonction_modif == "function" || typeof this.fonction_suppr == "function" || typeof this.fonction_vue == "function") {
      this.header.pop();
    }
  }

}
