import { sendHTTPRequests, getAllMovies, getMovieById } from "./utils/functions.js";

let modal = document.getElementById("modal");
const myMoviesContent = document.getElementById("myMoviesContent");
const moviesServerURL = "http://localhost:3000/movies/";
let myMovies = [];
let response = await sendHTTPRequests(moviesServerURL, "GET");
if (typeof response === "string" && response.includes("Token not provided")) {
    window.location.href = "./loginPage.html";
}
if (response && response.userId && Array.isArray(response.movies)) {
    let userId = response.userId;
    let movies = response.movies;
    myMovies = movies.filter(movie => movie.userId == userId);
    console.log("mymovies", myMovies);
    console.log("userId", userId);
} else {
    console.log("Could not get userId or movies from response", response);
}
document.getElementById("CreateNewMovieBtn").addEventListener("click", ()=>
{
    modal.showModal();
    document.getElementById("saveMovieBtn").style.display="inline";
    document.getElementById("updateMovieBtn").style.display="none";
})

document.getElementById("exitModal").addEventListener("click", ()=>
{
    modal.close();
})

document.getElementById("saveMovieBtn").addEventListener("click", async()=>
{
    if(movieName.value == "" || movieReleaseDate.value == "" || movieLength.value == "" || director.value == "" || moviePicture.value == "")
    {
        alert("Please provide all the data");
    }
    else
    {
        let newMovie=
        {
            name : movieName.value,
            releaseDate : movieReleaseDate.value,
            length : movieLength.value,
            director: director.value,
            picture : moviePicture.value,
        }
        try
        {
            
            let responseObject = await sendHTTPRequests(moviesServerURL, "POST", JSON.stringify(newMovie));
             if(typeof responseObject == "string")
            {
                alert(responseObject);
            }
            modal.close();
            getAllMovies(myMoviesContent, myMovies, "myMovies");
        }
        catch(error)
        {
            alert(error.message);
        }
    }
    
})

getAllMovies(myMoviesContent, myMovies, "myMovies");

document.getElementById("searchByMovieId").addEventListener("input", async(event)=>
{
    
    let movieId = event.target.value;
    if(movieId == "")
    {
        getAllMovies(myMoviesContent, myMovies, "myMovies");
    }
    else
    {
        let movie = await getMovieById(movieId);
        console.log(movie);
        if(!movie)
        {
            alert("No movie found");
            return;
        }
        getAllMovies(myMoviesContent, [movie], "myMovies");
    }
})







