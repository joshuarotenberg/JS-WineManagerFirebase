import axios from "axios";
import Handlebars from "handlebars";
import database from "../firebaseConfig";


export default function wineIndexController() {


database
.ref("wines")
.on("value", (results) => {
    results.forEach((result) => {
      const wine = result.val();
      const wineId = result.key;
    });
});

document
.getElementById("add-wine-form")
.addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("form submitted");



    const newWine = {
        name: document.getElementById("name").value,
        year: document.getElementById("year").value,
        grapes: document.getElementById("grapes").value,
        country: document.getElementById("country").value,
        region: document.getElementById("region").value,
        price: document.getElementById("price").value,
        picture: document.getElementById("picture").value,
        description: document.getElementById("description").value
    }
    
    //add record to Firebase using the Firebase SDK

    console.log(newWine);


    database
    .ref("wines")
    .push(newWine);

});

    axios
    .get("templates/wineIndex.hbs")
    .then((wineIndexResponse) => {
      axios
      .get("templates/wineResult.hbs")
      .then((wineResultResponse) => {
        return render(wineIndexResponse.data, wineResultResponse.data);
      });
    });

    function render(wineIndexTemplateHtml, wineResultTemplateHtml) {
        const windIndexTemplateFunc = Handlebars.compile(wineIndexTemplateHtml);
        const wineResultTemplateFunc = Handlebars.compile(wineResultTemplateHtml);
    
        document
        .getElementById("root")
        .innerHTML = wineIndexTemplateFunc();


        const wines = document.getElementById("wine-index");
    }
}