//Actions à lancer au chargement de la page pour get les données depuis le backend
createFilterBtn();
createWorksGallery();

/*******************************************/ 
/***** Block pour Images des travaux *******/ 
/*******************************************/ 
  

//Fetch sur le endpoint /api/works afin de pouvoir get les travaux
//Il est possible de filtrer par id de catégory, 
//n'ayant pas de route : /api/works/{:id}, on va établir de le filtre dans notre fct en frontend
async function fetchWorks(categoryId) {
  const apiUrl = 'http://localhost:5678/api/works';

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Network Error, Response status =/= 200');
    }

    const worksResult = await response.json();

    //No filter
    if (!categoryId || categoryId === 0) {
      console.log('all Works');
      console.table(worksResult);
      return worksResult;
    }
    //With filter by categoryId
    else{
      const filteredWorks = worksResult.filter((work) => categoryId === work.categoryId);
      console.log('Filtered Works');
      console.table(filteredWorks);
      return filteredWorks;
    }

  } catch (error) {
    console.error("We haven't been able to retrieve the works since the api: ", error);
    return null;
  }
}

//On remove les images qu'on a mis au début pour indiquer que le site charge,
//Permet de reload après filter également, on nettoie les figures précédentes
async function removeDataFigures() {
  const previousFigures = document.querySelectorAll('.gallery figure');
  previousFigures.forEach(figure => {
      figure.remove();
  });
}

//Créer les cards en utilisant les deux fonctions précédentes, 
//le await est là pour s'assurer que le delete est bien fini avant de venir créer les nouvelles cards
//sinon les deux actions se chevauchent et c'est du n'importe quoi.
async function createWorksGallery(categoryId) {
  await removeDataFigures();

  const worksArray = await fetchWorks(categoryId);
  const galleryDiv = document.querySelector('.gallery');

  // Parcourir le tableau de travaux et créer les éléments figure pour chaque travail
  worksArray.forEach(work => {
      const figure = document.createElement('figure');
      figure.id = `figure-gallery-work-${work.id}`; //Permet de get facilement l'objet ensuite pour modifier ou retirer du DOM
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);

      galleryDiv.appendChild(figure);
  });
}

//Change la classe .active des filtres au click
function moveActiveFilter(button){
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach(btn => {
    btn.classList.remove('active');
  })

  button.classList.add("active");
}

/*******************************************/ 
/**** Block pour les boutons de filtre *****/ 
/*******************************************/ 

//Fetch sur le endpoint /api/categories afin de pouvoir get les catégories
//On créer les boutons dynamiquement comme pour les travaux, comme ça dans le futur si une catégorie est ajouté
//Pas besoin de revenir sur cette page pour ajouter des btn à la main...
async function fetchCategories() {
  const apiUrl = 'http://localhost:5678/api/categories';

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Network Error, Response status =/= 200');
    }

    const categoriesResult = await response.json();


    console.log('all Categories');
    console.table(categoriesResult);
    return categoriesResult;


  } catch (error) {
    console.error("We haven't been able to retrieve the categories since the api: ", error);
    return null;
  }
}

//On remove les btn qu'on créer précédement,
async function removeDataBtnFilter() {
  const previousFilters = document.querySelectorAll('.container-filters button');

  previousFilters.forEach(button => {
    // Important pour éviter de stacker les eventListener si jamais on rappel l'api plus tard.
    button.removeEventListener("click", () => filterBtnClickHandler(button));
    // On retire les filtres précédent du DOM
    button.remove();
  });
}

function filterBtnClickHandler(button) {
  moveActiveFilter(button);
  createWorksGallery(parseInt(button.id));
}

//Créer les btn en utilisant les deux fonctions précédentes, 
//le await est là pour s'assurer que le delete est bien fini avant de venir créer les nouveaux btn
//sinon les deux actions se chevauchent et c'est du n'importe quoi.
async function createFilterBtn(){
  await removeDataBtnFilter();

  const categoriesArray = await fetchCategories();
  const filterDiv = document.querySelector('.container-filters');

  // Ne pas oublier le bouton pour justement ne pas filter !
  const btn = document.createElement('button');

  btn.id = 0;
  //btn.classList.add("filter-btn","active"); // même chose que dessous
  btn.className ="filter-btn active";
  btn.type = "button";
  btn.textContent = "Tous";

  filterDiv.appendChild(btn);


  // Parcourir le tableau de catégories et créer les éléments btn pour chaque catégories
  categoriesArray.forEach(category => {
      const btn = document.createElement('button');

      btn.id = category.id;
      btn.className = "filter-btn";
      btn.type = "button";
      btn.textContent = category.name;

      filterDiv.appendChild(btn);
  });

  //On install les addEventListener après la création
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click",  () => filterBtnClickHandler(button));
  });

}
