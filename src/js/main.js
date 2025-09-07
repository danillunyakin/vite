document.getElementById("privacyPolicyModalOpen").addEventListener("click" ,function(){
    document.getElementById("privacyPolicyModal").classList.add("modal__open")
})


document.getElementById("privacyPolicyModalClose").addEventListener("click" ,function(){
    document.getElementById("privacyPolicyModal").classList.remove("modal__open")
})


window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        document.getElementById("privacyPolicyModal").classList.remove("modal__open")
    }
})

document.querySelector("#privacyPolicyModal .modal__box").addEventListener('click', event => {
    event._isClickWithInModal = true;
})
document.getElementById("privacyPolicyModal").addEventListener('click', event => {
    if (event._isClickWithInModal) return
    event.currentTarget.classList.remove("modal__open")
})








document.getElementById("personalDataModalOpen").addEventListener("click" ,function(){
    document.getElementById("personalDataModal").classList.add("modal__open")
})


document.getElementById("personalDataModalClose").addEventListener("click" ,function(){
    document.getElementById("personalDataModal").classList.remove("modal__open")
})

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        document.getElementById("personalDataModal").classList.remove("modal__open")
    }
})

document.querySelector("#personalDataModal .modal__box").addEventListener('click', event => {
    event._isClickWithInModal = true;
})
document.getElementById("personalDataModal").addEventListener('click', event => {
    if (event._isClickWithInModal) return
    event.currentTarget.classList.remove("modal__open")
})

