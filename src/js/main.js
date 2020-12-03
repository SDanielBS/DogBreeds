const $container_screen_listBreeds = document.getElementById("container-breeds--filters")
const $container_screen_imageBreeds = document.getElementById("container-selected-breed")
const $btn_close_modal = document.getElementsByClassName('exit')
const $btn_alphabet = document.getElementsByClassName('alphabet')
const $container_alphabet = document.getElementById("container-alphabet")
const $container_breed_list_filtered = document.querySelector("#container-breeds--filters .breeds-list")
const $titleBreed = document.getElementsByClassName("breed-title")
const $container_selected_breed = document.querySelector("#container-selected-breed .image-breed-selected")
const $btn_breed = document.getElementsByClassName("breedItem")
const URL_API_BREEDS = "https://dog.ceo/api/breeds/list/all"

async function loadBreeds(){

  async function getBreeds(url){
    const response = await fetch(url)
    const data = response.json()
    return data
  }

  const breedsList = await getBreeds(URL_API_BREEDS)

  async function getImageFiltered(breed){
    try {
      const NaB = breed.includes("No hay razas")
      if(NaB){
        const urlIndex = "https://cdn.pixabay.com/photo/2014/04/03/00/42/footprints-309158_960_720.png"
        return urlIndex
      }else{
        const breedImage = await getBreeds(`https://dog.ceo/api/breed/${breed}/images/random`)
        const imageURL = breedImage.message
        return imageURL
      }
    } catch (error) {
      return `Algo salio mal : ${error}`
    }
  }

  function templateAlphabet(letter){
    return (
      `<div class="alphabet">
        <a href="#">${letter}</a>
      </div>`
      )
  }

  function createTemplate(HTMLTemplate){
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLTemplate
    return html.body.children[0]
  }

  function renderAlphabetButtons(keyCode){
    const HTMLTemplate = templateAlphabet(String.fromCharCode(keyCode))
    const alphabetElement = createTemplate(HTMLTemplate)
    $container_alphabet.append(alphabetElement)
  }

  function renderAllLetters(){
    for( let i = 0; i < 26; i++){
      let keyCode = i+65
      renderAlphabetButtons(keyCode)
    }
  }

  renderAllLetters()

  function filterAlphabet(letter){
    const arrayBreedsNames = Object.keys(breedsList.message)
    const arrayBreedsNamesFilters = []
    arrayBreedsNames.forEach((breed)=>{
      if(breed.startsWith(letter)){
        arrayBreedsNamesFilters.push(breed)
      }
    })
    if(arrayBreedsNamesFilters.length > 0){
      return arrayBreedsNamesFilters
    }else{
      return [`No hay razas con la letra ${letter}`]
    }
  }

  function templateBreedListFiltered(breed){
    return (
      `<div class="breedItem">
        <a href="#">${breed}</a>
       </div>`
      )
  }

  function renderBreedListFiltered(breed){
    const HTMLTemplate = templateBreedListFiltered(breed)
    const HTMLElement = createTemplate(HTMLTemplate)
    $container_breed_list_filtered.append(HTMLElement)
  }

  function getClickLetters(){
    for( let i = 0; i < 26; i++){
      let keyCode = i+65
      let letter = String.fromCharCode(keyCode)
      const lowercaseLetter = letter.toLowerCase()
      $btn_alphabet[i].addEventListener("click", e =>{
        e.preventDefault()
        let arrayBreedsNamesFilters = filterAlphabet(lowercaseLetter)
        $container_breed_list_filtered.innerHTML = ""
        $container_alphabet.style.display = "none"
        $container_screen_listBreeds.style.display = "block"
        $container_screen_listBreeds.classList.add("modal")
        arrayBreedsNamesFilters.forEach( breed => {
          renderBreedListFiltered(breed)
        })
        getClickBreeds(arrayBreedsNamesFilters)
      })
    }
    closeModal(0)
  }

  getClickLetters()

  function templateSelectedBreedImage(imageBreedURL,breedName){
    return `
            <img src="${imageBreedURL}" alt="${breedName}">
           `
  }

  async function renderSelectedBreedImage(breedName){
    const imageBreed = await getImageFiltered(breedName)
    const HTMLTemplate = templateSelectedBreedImage(imageBreed,breedName)
    const HTMLElement = createTemplate(HTMLTemplate)
    $container_selected_breed.innerHTML = ""
    $titleBreed[1].innerHTML = `Raza ${breedName}`
    $container_selected_breed.append(HTMLElement)
  }

  function getClickBreeds(breeds){
    for( let i = 0; i < breeds.length; i++){
       $btn_breed[i].addEventListener("click", e => {
        e.preventDefault()
        const $link_btn_breed = document.querySelectorAll(".breedItem a")
        const breedSelected = $link_btn_breed[i].innerHTML
        $container_screen_imageBreeds.classList.add("modal")
        $container_screen_listBreeds.style.display = "none"
        renderSelectedBreedImage(breedSelected)
      })
    }
    closeModal(1)
  }
  function closeModal(screen){
    $btn_close_modal[screen].addEventListener("click",(e)=>{
      e.preventDefault()
      const currentContainer = $btn_close_modal[screen].parentElement
      currentContainer.classList.remove("modal")
      if(screen == 0){
        $container_alphabet.style.display = "flex"
        $container_screen_listBreeds.style.display = "none"
      }
      if(screen+1 == $btn_close_modal.length){
        $container_screen_listBreeds.style.display = "block"
      }
    })
  }
  
}
loadBreeds()
