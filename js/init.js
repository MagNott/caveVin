import {Ajax_Es6} from "./Ajax_class.js"


const urlPays = "http://fbrc.esy.es/DWWM22239/Api/api.php/PAYS";
export let ajaxClassPays = new Ajax_Es6(urlPays);

const urlCouleur = "http://fbrc.esy.es/DWWM22239/Api/api.php/COULEUR";
export let ajaxClassCouleur = new Ajax_Es6(urlCouleur);


const urlAppellation = "http://fbrc.esy.es/DWWM22239/Api/api.php/APPELLATION";
export let ajaxClassAppellation = new Ajax_Es6(urlAppellation);


const urlRegion = "http://fbrc.esy.es/DWWM22239/Api/api.php/REGION";
export let ajaxClassRegion = new Ajax_Es6 (urlRegion);


const urlVin = "http://fbrc.esy.es/DWWM22239/Api/api.php/VIN";
export let ajaxClassVin = new Ajax_Es6 (urlVin);


// fbrc.esy.es/DWWM22239/Api/api.php/APPELLATION

// http://fbrc.esy.es/DWWM22239/Api/api.php/VIN


// http://fbrc.esy.es/DWWM22239/Api/api.php/
// ou
// https://afpafabrice.space/DWWM22239/Api/api.php/


// Il suffit d'ajouter le nom de la "Table" après le dernier /

// Par exemple pour accèder à la table VIN :  

// http://fbrc.esy.es/DWWM22239/Api/api.php/VIN
// ou
// https://afpafabrice.space/DWWM22239/Api/api.php/VIN
