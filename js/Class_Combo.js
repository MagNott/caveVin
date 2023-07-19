export class Combo {
  id_zone;
  id_select;
  class_select;
  data;
  value_selected;
  
  constructor(id_zone = "", id_select = "", class_select = "", data = {}) {
    this.id_zone = id_zone;
    this.id_select = id_select;
    this.class_select = class_select;
    this.data = data;
  }

  genererCombo() {
    if (!this.id_zone || !this.id_select) {
      throw new Error(
        "Pour générer un Combo, il faut préciser la propriété id_zone et la propriété id_select."
      );
    }

    const zone = document.getElementById(this.id_zone);
    if (!zone) {
      throw new Error(`La zone avec l'ID '${this.id_zone}' n'existe pas.`);
    }

    const select = document.createElement("select");
    select.id = this.id_select;
    select.className = this.class_select;

    this.data.forEach(([value, text]) => {
      const option = document.createElement("option");
 
      if (this.value_selected == value ) { 
        option.selected = true
      }

      option.value = value;
      option.textContent = text;
      select.appendChild(option);
    });
    zone.appendChild(select);
  }

  fonction_change(callback) {
    const select = document.getElementById(this.id_select);
    if (!select) {
      throw new Error(`Le select avec l'ID '${this.id_select}' n'existe pas.`);
    }

    select.addEventListener("change", (event) => {
      const selectedValue = event.target.value;
      callback(selectedValue);
    });
  }
}
  