const jFileDL = require("../DLs/jFileDL");
const path = require("path");
const moviesPath = path.resolve(__dirname, "..", "data", "movies.json");
const logsPath = path.resolve(__dirname, "..", "data", "logs.json");
console.log(moviesPath)

const getAllMovies = ()=>
{
    console.log(moviesPath)
    return jFileDL.readData(moviesPath);
}

const getMovieById = async(movieId)=>
{
    let movies = await getAllMovies();
    let movie = movies.find(x=>x.movieId == movieId);
    if(movie)
    {
        return movie;
    }
    else
    {
        return "No Movie found";
    }
}

const createNewMovie = async(newMovieData)=>
{
    let movies = await getAllMovies();
    newMovieData.movieId = +movies[movies.length-1].movieId + 1;
    if(typeof movies == "string")
    {
        return movies;
    }
    else
    {
        console.log("Creating new movie:", newMovieData);
        movies = [...movies, newMovieData];
        return jFileDL.saveData(moviesPath, movies);
    }
}

const updateMovie = async(movieId, movieData)=>
{
    let movies = await getAllMovies();
    if(typeof movies == "string")
    {
        return movies;
    }
    else
    {
        let index = movies.findIndex(x=>x.movieId == movieId);
        if(index >= 0 )
        {
            movies[index] = {
                ...movies[index],
                ...movieData
            }
            return jFileDL.saveData(moviesPath, movies);
        }
        else
        { 
            return "No movie found";
        }
    }

}

const deleteMovie = async(movieId)=>
{
        let movies = await getAllMovies();
        let index = movies.findIndex(x=>x.movieId == movieId);
        if(index >= 0)
        {
            movies.splice(index, 1);
            await jFileDL.saveData(moviesPath, movies);
            return "Movie Deleted";
        }
        else
        {
            return "Movie not found"
        }
}

const logUserAction = async (userId, actionType, counter) => {
    let logs = await jFileDL.readData(logsPath);
    if (!Array.isArray(logs)) logs = [];
    logs.push({
        userId,
        action: actionType,
        counter,
        timestamp: new Date().toISOString()
    });
    await jFileDL.saveData(logsPath, logs);
};

module.exports = 
{
    getAllMovies,
    getMovieById,
    createNewMovie,
    updateMovie,
    deleteMovie,
    logUserAction
}