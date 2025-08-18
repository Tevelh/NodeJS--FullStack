import { sendHTTPRequests, getAllMovies, getMovieById } from "./utils/functions.js";

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
document.getElementById("searchByMovieId").addEventListener("input", async(event)=>
{
    event.preventDefault();
    let movieId = event.target.value;
    if(movieId == "")
    {
        getAllMovies(allMoviesContent, responseData.movies, "allMovies");
    }
    else
    {
        let movie = await getMovieById(movieId);
        console.log("movie", movie);
        if(!movie || movie == "No Movie found")
        {
            alert("No movie found");
            return;
        }
        getAllMovies(allMoviesContent, [movie], "allMovies");
    }
})