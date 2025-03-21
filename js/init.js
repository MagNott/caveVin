import {Ajax_Es6} from "./Ajax_class.js";

const url = "https://afpafabrice.space/DWWM22239/Api/api.php/";


const urlPays = url + "/PAYS";
export let ajaxClassPays = new Ajax_Es6(urlPays);
export const urlPaysOrder = urlPays + '?order=NOMPAYS,asc';



const urlCouleur = url + "/COULEUR";
export let ajaxClassCouleur = new Ajax_Es6(urlCouleur);
export const urlCouleurOrder = urlCouleur + '?order=NOMCOULEUR,asc';


const urlAppellation = url + "/APPELLATION";
export const urlAppellationOrder = urlAppellation + '?order=NOMAPPELLATION,asc';
export let ajaxClassAppellation = new Ajax_Es6(urlAppellation);


export const urlRegion = url + "/REGION";
export let ajaxClassRegion = new Ajax_Es6 (urlRegion);
export const urlRegionNomPays = urlRegion + '?include=PAYS&transform=1';
export const urlRegionOrder = urlRegion +'?columns=CODEREGION,NOMREGION&order=NOMREGION,asc';

export const urlVin = url + "/VIN";
export let ajaxClassVin = new Ajax_Es6 (urlVin);

export const urlVinAppellationRegionCouleur = urlVin + '?include=APPELLATION,COULEUR,REGION&transform=1';

export const urlAcepage = url + '/A_POUR_CEPAGE?include=CEPAGE&filter=CODEVIN,eq,';
export let ajaxClassVinCepage = new Ajax_Es6(urlAcepage);

export const urlMetsVin = url + 'METS?include=VIN&transform=1';

export const urlCepage = url + '/CEPAGE';
export let ajaxClassCepage = new Ajax_Es6(urlCepage);



export const urlMets = url + '/METS';
export let ajaxClassMets = new Ajax_Es6(urlMets);
export let urlMetsCategorieMets = urlMets + '?include=CATEGORIE_METS&transform=1';

export const urlCategorieMets = url + '/CATEGORIE_METS';
export let ajaxClassCategorieMets = new Ajax_Es6(urlCategorieMets);

export const urlCategorieMetsOrder = urlCategorieMets + '?order=LIBELLE_CATEGORIE,asc';



 


// http://fbrc.esy.es/DWWM22239/Api/api.php/A_POUR_CEPAGE?filter=CODEVIN,eq,2&include=CEPAGE
// fbrc.esy.es/DWWM22239/Api/api.php/

