/**
 * Returns average rating from set of different ratings
 *
 * @param {ratings} array of movie ratings
 * @return {number} from zero to 5
 */

class Movie {
  constructor(data) {
    this.title = data.Title
    this.description = data.Plot
    this.cast = data.Actors
    this.rating = data.Ratings
    this.image = data.Poster
  }

  create(parent) {
    const rating = getRating(this.rating)
    const card = document.createElement("div")
    const wholeStars = Math.trunc(rating)
    const noStar = 5 - wholeStars
    card.innerHTML = `
        <div class="movie__left">
          <img src="${this.image}"></img>
          <div class="stars-wrapper">`+ getStars(noStar, wholeStars) +`</div>
        </div>
        
        <div class="movie__content">
          <div>
            <p>${this.title}</p>
            <p>${this.description}</p>
            <p>${this.cast}</p>
          </div>
        </div>
    `
    card.classList.add('movie-card__wrapper')
    parent.appendChild(card);
  }
}

const getStars = (emptyStars, wholeStars)=>{
  const emptyStarSVG = `<img src="./star-empty.svg" alt="emptySVGStar"></img>`
  const wholeStarSVG = `<img src="./star-filled.svg" alt="emptySVGStar"></img>`
  let auxStr = ""

  for (let index = 0; index < wholeStars; index++) {
    auxStr += wholeStarSVG
  }

  for (let index = 0; index < emptyStars; index++) {
    auxStr += emptyStarSVG
  }

  return auxStr
}

const getRating = (ratings) => {
  if (!Array.isArray(ratings)) {
    return 0;
  }
  const result = ratings.reduce(
    (collective, rating) => {
      if (rating.Value.indexOf("/") !== -1) {
        const [left, right] = rating.Value.split("/");
        collective.total += left / right;
      } else if (rating.Value.indexOf("%") !== -1) {
        collective.total += parseInt(rating.Value) / 100;
      }
      collective.count++;
      return collective;
    },
    { total: 0, count: 0 }
  );

  return Math.floor((result.total / result.count) * 5);
};

const getMovies = async () => {
  const res = await fetch("http://127.0.0.1:5501/movies.json")

  return res.json()
}

async function init(params) {
  const wrapper = document.getElementById("cards-wrapper")
  const moviesList = await getMovies()

  for (let index = 0; index < moviesList.length; index++) {
    const movie = new Movie(moviesList[index]).create(wrapper)
  }
}

init()
