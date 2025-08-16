const moviesServerURL = "http://localhost:3000/movies/";
let moviesData = [];
let contentMovies = "";


export const sendHTTPRequests = async (url, method, body) => {
    let responseObject;
    if (method == "GET") {
        responseObject = await fetch(url, {
            credentials: "include"
        });
    } else {
        responseObject = await fetch(url, {
            method,
            body: body ? body : "",
            headers: {
                "content-type": "application/json"
            },
            credentials: "include"
        });
    }
    let contentType = responseObject.headers.get("content-type") || "";
    const flag = contentType.includes("application/json");
    const response = flag ? await responseObject.json() : await responseObject.text();
    console.log("Response from server", method, ":", response);

    if (responseObject.status === 401 && response && response.message === "Logged out due to counter limit") {
        alert(response.message);
        window.location.href = "./loginPage.html";
        return;
    }
    if (responseObject.status === 403 && response && response.error === "Access denied due to counter logout") {
        alert("You have reached the action limit and are blocked from accessing the site.");
        window.location.href = "./loginPage.html";
        return;
    }
    return response;
}

export const sleepMode = () => new Promise((res) => setTimeout(res, 3000));

export const getAllMovies = async (contentDiv, data, page) => {
    moviesData = data;
    contentMovies = contentDiv;
    contentDiv.innerHTML = "";
    const regularCreateBtn = document.getElementById('CreateNewMovieBtn');
    if (moviesData.length > 0) {
        if (regularCreateBtn) {
            regularCreateBtn.style.display = 'inline-block';
        }
        moviesData.forEach(movie => {
            const card = document.createElement("div");
            card.className = "movieCard";
            card.innerHTML = `
                <img src="${movie.picture}" alt="${movie.name}">
                <p><strong>Name: </strong>${movie.name}</p>
                <p><strong>Director: </strong>${movie.director}</p>
                <p><strong>Release Date: </strong>${movie.releaseDate}</p>
                <p><strong>Length: </strong>${movie.length} min</p>
            `;
            if (page == "myMovies") {
                const buttonsDiv = document.createElement("div");
                buttonsDiv.id = "buttonsCard";
                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.id = "editMovieBtn";
                editBtn.addEventListener("click", () => editMovie(movie.movieId));
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.id = "deleteMovieBtn";
                deleteBtn.addEventListener("click", () => deleteMovie(movie.movieId));
                buttonsDiv.appendChild(editBtn);
                buttonsDiv.appendChild(deleteBtn);
                card.appendChild(buttonsDiv);
            }
            contentDiv.appendChild(card);
        });
    } else {
        if (regularCreateBtn) {
            regularCreateBtn.style.display = 'none';
        }
        const emptyCard = document.createElement("div");
        emptyCard.className = "movieCard";
        emptyCard.innerHTML = `<div style=\"text-align:center; padding:32px 0 24px 0; color:#888;\">
            <p><strong>No movies found.</strong></p>
            <p>Add your first movie to get started!</p>
            <button id='CreateNewMovieBtn' style='display:inline-block; margin:16px auto 0 auto; background:#d572f3; color:#fff; border:none; border-radius:25px; padding:12px 40px; font-size:18px; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:background-color 0.3s;'>Create Movie</button>
        </div>`;
        contentDiv.appendChild(emptyCard);
        const createBtn = emptyCard.querySelector('#CreateNewMovieBtn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                if (typeof modal !== 'undefined') modal.showModal();
                document.getElementById('saveMovieBtn').style.display = 'inline';
                document.getElementById('updateMovieBtn').style.display = 'none';
            });
        }
    }
}

let cardId = null;
async function editMovie(movieId) {
    let movie = await getMovieById(movieId);
    cardId = movieId;
    modal.showModal();
    movieName.value = movie.name;
    director.value = movie.director;
    movieReleaseDate.value = movie.releaseDate;
    movieLength.value = movie.length;
    moviePicture.value = movie.picture;
    document.getElementById("saveMovieBtn").style.display = "none";
    document.getElementById("updateMovieBtn").style.display = "inline";
    document.getElementById("updateMovieBtn").addEventListener("click", async () => {
        const updatedMovie =
        {
            name: movieName.value,
            director: director.value,
            releaseDate: movieReleaseDate.value,
            length: movieLength.value,
            picture: moviePicture.value
        }
        try {
            let response = await sendHTTPRequests(`${moviesServerURL}${cardId}`, "PUT", JSON.stringify(updatedMovie));
            modal.close();
            await getAllMovies(contentMovies, moviesData, "myMovies");
            showToast(response);
            sleepMode();
        }
        catch (error) {
            showToast(error.message, true);
        }

    })
}

export async function getMovieById(movieId) {
    try {
        let movie = await sendHTTPRequests(`${moviesServerURL}${movieId}`, "GET", null);
        return movie;
    }
    catch (error) {
        console.error("Error getting movie:", error);
        return null;
    }
}



async function deleteMovie(movieId) {
    try {
        if (!confirm("Are you sure you want to delete this movie?")) {
            return;
        }
        let response = await sendHTTPRequests(`${moviesServerURL}${movieId}`, "DELETE", "");
        await getAllMovies(contentMovies, moviesData, "myMovies");
        showToast(response);
    }
    catch (error) {
        showToast(error.message, true);
    }
}

function showToast(message, isError = false) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    let toast = document.createElement('div');
    toast.textContent = message;
    toast.style.background = isError ? '#dc3545' : '#28a745';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    toast.style.fontSize = '16px';
    toast.style.cursor = 'pointer';
    toast.style.pointerEvents = 'auto';


    let closeBtn = document.createElement('span');
    closeBtn.textContent = '✖';
    closeBtn.style.marginLeft = '12px';
    closeBtn.addEventListener('click', () => toast.remove());
    toast.appendChild(closeBtn);

    container.appendChild(toast);
}

export const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:3000/auth/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
        window.location.href = "./loginPage.html";
    });
}