import { sendHTTPRequests, getAllMovies } from "./utils/functions.js";

const modal = document.getElementById("modal");
const allMoviesContent = document.getElementById("allMoviesContent");
const movieContent = document.getElementById("movieContent");

const moviesServerURL = "http://localhost:3000/movies/";

const movieName = document.getElementById("movieName");
const movieReleaseDate = document.getElementById("movieReleaseDate");
const director = document.getElementById("director");
const movieLength = document.getElementById("movieLength");

const moviePicture = document.getElementById("moviePicture");



let responseData = await sendHTTPRequests(moviesServerURL, "GET");
console.log("responseData", responseData);
if (!Array.isArray(responseData.movies)) {
    alert("Please log in first");
    window.location.href = "./loginPage.html";
} else {
    getAllMovies(allMoviesContent, responseData.movies, "allMovies");
}
document.getElementById("searchByMovieId").addEventListener("input", async (event) => {

    let movieId = event.target.value;
    if (movieId == "") {
        getAllMovies(allMoviesContent, responseData, "allMovies");
    }
    else {
        let movie = await getMovieById(movieId);
        console.log(movie);
        if (!movie) {
            alert("No movie found");
            return;
        }
        allMoviesContent.innerHTML = "";
        allMoviesContent.innerHTML =
            `
        <div class="movieCard">
                <p><strong>Name: </strong>${movie.name}</p>
                <p><strong>Director: </strong>${movie.director}</p>
                <p><strong>Premiered Year: </strong>${movie.premieredYear}</p>
                <div id="buttonsCard">
                    <button onclick="editMovie('${movie._id}')" id="editMovieBtn">Edit</button>
                    <button onclick="deleteMovie('${movie._id}')" id="deleteMovieBtn">Delete</button>
                </div>
            </div>    
        `
    }
})
