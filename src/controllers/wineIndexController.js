import axios from "axios";
import Handlebars from "handlebars";
import database from "../firebaseConfig";


export default function wineIndexController() {

    axios
    .get("templates/wineIndex.hbs")
    .then((wineIndexResponse) => {
      axios
      .get("templates/wineResult.hbs")
      .then((wineResultResponse) => {
        axios
        .get("templates/editWineForm.hbs")
        .then((editWineResponse) => {
            return render(wineIndexResponse.data, wineResultResponse.data, editWineResponse.data);
         });
      });
    });



    function render(wineIndexTemplateHtml, wineResultTemplateHtml, editWineTemplateHtml) {
        const windIndexTemplateFunc = Handlebars.compile(wineIndexTemplateHtml);
        const wineResultTemplateFunc = Handlebars.compile(wineResultTemplateHtml);
        const editWineTemplateFunc = Handlebars.compile(editWineTemplateHtml);


       
        // display wines from firebase in root
    
        document
        .getElementById("root")
        .innerHTML = windIndexTemplateFunc();

        const wineCollection = document.getElementById("wine-index");

        database
        .ref("wines")
        .on("value", (results) => {
            wineCollection.innerHTML = "";

            results.forEach((result) => {

                const wine = result.val();
                const wineId = result.key;
                
                wineCollection.innerHTML += wineResultTemplateFunc({...wine,
                    wineId: wineId 
                });

                    
            });
        });

        
        //add new wine to firebase db

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
            .push(newWine)
            .then(() => {

                document
                .getElementById("add-wine-form")
                .reset();
        
                $("#add-wine-modal").modal("hide");
            });
            

        });


    //    Event Delegators

        document
        .addEventListener("click", (event) => {
            if (event.target.classList.contains("edit-wine-button")) {
                console.log("clicking edit button");

                // grab wineId from edit button

                const wineId = event.target.id;
                console.log(wineId);

                // find edit modal and append id

                document
                .querySelector(".edit-modal")
                .setAttribute('id', `edit-wine-modal${wineId}`);

                $('.edit-modal').modal('show');


                // pull in wine for update


                database
                    .ref("wines")
                    .child(wineId)
                    .on("value", (results) => {
                        const oneWine = results.val();

                        document
                        .getElementById("edit-modal-form")
                        .innerHTML = editWineTemplateFunc(oneWine);
                    });

                

                const wineEditModal =  document.querySelector(".edit-modal")
                console.log(wineEditModal);

                
                document
                .getElementById("edit-wine-form")        
                .addEventListener("submit", function(event) {
                    event.preventDefault();
                    console.log("clicked submit on update form")

                    database
                    .ref("wines")
                    .child(wineId)
                    .update({
                        name: document.getElementById("editName").value,
                        year: document.getElementById("editYear").value,
                        grapes: document.getElementById("editGrapes").value,
                        country: document.getElementById("editCountry").value,
                        region: document.getElementById("editRegion").value,
                        description: document.getElementById("editDescription").value,
                        price: document.getElementById("editPrice").value, 
                        picture: document.getElementById("editPicture").value 
                    })
                    .then(() => {
                        console.log("update submitted");
                        $(".edit-modal").modal("hide");
                    })
                    .catch(function(err) {
                        console.log(err);
                    });

                    


                });

                
            } 
            
            if (event.target.classList.contains("delete-wine-button")){
                event.preventDefault();
                const wineId = event.target.id;

                console.log(wineId);


                database
                .ref("wines")
                .child(wineId)
                .remove()
                .then(() => {
                    window.location.href = "#/wines";
                });
            }
        });
        
    }
}