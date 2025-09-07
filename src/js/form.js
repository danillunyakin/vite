// import JustValidate from "just-validate";
// import Inputmask from "inputmask";
import JustValidate from "just-validate";
import Inputmask from "inputmask";

let selector = document.querySelector("#tel")
let im = new Inputmask("+380(99)999-99-99")
im.mask(selector)
let validation = new JustValidate("#form")

validation.addField("#name", [
    {
        rule: "required",
        errorMessage:"Введіть Ім'я!"
    },
    {
        rule: "minLength",
        value: 3,
        errorMessage:"Мінімум 3 символи!"
    }
]).addField("#tel", [
    {

        validator: (value) => {
            const phone = selector.inputmask.unmaskedvalue()
            return Boolean(Number(phone) && phone.length > 0)
        },
        errorMessage: "Введіть номер телефону!"
    },
    {
            validator: (value) => {
         const phone = selector.inputmask.unmaskedvalue()
            return Boolean(Number(phone) && phone.length === 9)
         },
        errorMessage: "Введіть номер телефону повністю!"
     }
]).addField("#message", [
    {
        rule: "required",
        errorMessage:"Введіть коментар!!"
    },
    {
        rule: "minLength",
        value: 5,
        errorMessage:"Мінімум 5 символів!"
    }
]).onSuccess( async function() {
    let data = {
        name: document.getElementById("name").value,
        tel:document.getElementById("tel").value,
        message: document.getElementById("message").value
    }

    let response  = await fetch("http://localhost:8000/sendmail.php", {
        method: "POST",
         body: new FormData(document.querySelector("form"))
        // body: JSON.stringify(data),
        // headers: {
        //     "Content-Type": "applications/json; charset=UTF-8"
        // }
    })

    let result =  await response.text()
    alert(result)
    
})