// Fonctions utiles
export class loadHTML {
  idZone;
  urlFichier;

  constructor(id = "", url = "") {
    if (id == "") {
      throw new Error(
        "Pour utiliser la Classe 'loadHTML' il faut préciser l'Id de la zone destination"
      );
    }
    if (url == "") {
      throw new Error(
        "Pour utiliser la Classe 'loadHTML' il faut préciser l'url source"
      );
    }
    this.idZone = id;
    this.urlFichier = url;
  }

  load() {
    fetch(this.urlFichier)
      .then((r) => {
        if (r.ok) {
          return r.text();
        } else {
          throw new Error("Code Erreur : " + r.status);
        }
      })
      .then((s) => {
        // console.log(s);
        if (document.getElementById(this.idZone) !== null) {
          document.getElementById(this.idZone).innerHTML = s;
        } else {
          console.log("l'Id " + this.idZone + " n'existe pas sur la page");
        }
      })
      .catch(function (error) {
        console.log("La requete GET HTML a échoué : ", error);
      });
  }
}
