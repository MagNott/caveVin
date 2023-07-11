"use strict"; 

export class Combo {
    Id_zone;
    Id_select;
    class_select;
    data;

    generer() {

        //Je prepare mon throw 
        if (this.Id_zone === undefined || this.Id_select === undefined) {
            throw new Error ('Pour générer un Combo, il faut préciser la proprieté id_zone et la propriété id_select');
        }

        //Ici on connecte html avec le js, on créé le select 
        let comboDisplay = document.getElementById(this.Id_zone);
        let selectBox = document.createElement ('select');
        selectBox.classList.add(this.class_select); //on ajoute une class qu'on pourra utiliser en css
        
        // la on met un enfant a select box
        selectBox.appendChild (document.createElement('option')); 
        //J'ai économisé une varaible :'D, je suis émue

        // condition d'action si les données sont présentes
        if (this.data !== undefined) {

            //forEach (amen !) permet de passer sur chaque element du tableauception pour ajouter une valeur et un texte
            this.data.forEach(optionBox => {
                let optionElement = document.createElement('option');
                optionElement.value = optionBox[0];
                optionElement.innerText = optionBox[1];
                selectBox.appendChild(optionElement); // on met un enfant (option) par elemenet du tableau dans le select 
            });
            

        }
        selectBox.onchange = this.function_change // ??? inconnue au bataillon, j'avais pas compris la consigne
        comboDisplay.appendChild(selectBox); // on met un enfant à la div qui affiche 

    }

    function_change() {
        alert("Je passe dans fonction change !")
        // j'avais pas du tout compris le truc, c'est mon mari qui m'a expliqué
    }



}

