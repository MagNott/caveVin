/////////////////////////////////////
///   La classe "MERE"          /////
/////////////////////////////////////
class Ajax {
  // Les attributs
  #url = ""; // Contiendra l'URL de l'API
  #cle = ""; // Contiendra l'identifiant (clé unique)
  // pour les PUT et DELETE

  // Le constructeur
  constructor(url = "", cle = "") {
    // La classe AJAX est ABSTRAITE
    if (this.constructor === Ajax) {
      throw new Error("La classe AJAX ne peut être instanciée");
    }
    this.Url = url;
    this.Cle = cle;
  }
  // Les Getter/Setter
  get Url() {
    return this.#url;
  }
  set Url(value) {
    if (value.length != 0) {
      this.#url = value;
    } else {
      throw new Error(
        "Un objet AJAX doit obligatoirement avoir une propriété Url renseignée"
      );
    }
  }
  get Cle() {
    return this.#cle;
  }
  set Cle(value) {
    this.#cle = value;
  }
  // Les Méthodes
}

/////////////////////////////////////
///   La classe "Fille" ES6     /////
/////////////////////////////////////
export class Ajax_Es6 extends Ajax {
  // Les Attributs

  // Le constructeur
  constructor(url = "", id = "") {
    super(url, id);
  }

  // Les getter/setter

  // Les methodes
  get(fonctSuccess, fonctError) {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    // Correction du BUG avec OPENWEATHER
    let url_complete = this.Url;
    if (this.Cle != "") {
      url_complete += "/" + this.Cle;
    }

    fetch(url_complete, requestOptions)
      .then((response) => response.json())
      .then(function (data) {
        fonctSuccess(JSON.stringify(data));
      })
      .catch(function (error) {
        console.log("La requete GET a échoué : ", error);
        fonctError(error);
      });
  }

  post(donnees, fonctSuccess, fonctError) {
    var requestOptions = {
      method: "POST",
      body: donnees,
      redirect: "follow",
    };

    fetch(this.Url, requestOptions)
      .then((response) => response.text())
      .then(function (data) {
        console.log("Requete POST a abouti avec la réponse JSON : ", data);
        fonctSuccess(data);
      })
      .catch(function (error) {
        console.log("La requete POST a échoué : ", error);
        fonctError(error);
      });
  }

  put(donnees, fonctSuccess, fonctError) {
    var requestOptions = {
      method: "PUT",
      body: donnees,
      redirect: "follow",
    };

    fetch(this.Url + "/" + this.Cle, requestOptions)
      .then((response) => response.text())
      .then(function (data) {
        console.log("Requete PUT a abouti avec la réponse JSON : ", data);
        fonctSuccess(data);
      })
      .catch(function (error) {
        console.log("La requete PUT a échoué : ", error);
        fonctError(error);
      });
  }

  del(fonctSuccess, fonctError) {
    var urlencoded = new URLSearchParams();

    var requestOptions = {
      method: "DELETE",
      body: urlencoded,
      redirect: "follow",
    };

    fetch(this.Url + "/" + this.Cle, requestOptions)
      .then((response) => response.text())
      .then(function (data) {
        console.log("Requete DELETE a abouti avec la réponse JSON : ", data);
        fonctSuccess(data);
      })
      .catch(function (error) {
        console.log("La requete DELETE a échoué : ", error);
        fonctError(error);
      });
  }
}
