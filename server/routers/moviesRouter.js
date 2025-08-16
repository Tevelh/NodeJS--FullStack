const router = require("express").Router();
const moviesBL = require("../BLs/moviesBL");
const verifyToken = require("../utils/verifyToken");

function handleCounter(req, actionType) {
    const today = new Date().toISOString().slice(0, 10);
    if (!req.session.lastCounterDate || req.session.lastCounterDate !== today) {
        req.session.lastCounterDate = today;
        req.session.counter = 10; 
    }

    if (["GET_MOVIE", "POST_MOVIE", "PUT_MOVIE", "DELETE_MOVIE"].includes(actionType)) {
        if (typeof req.session.counter === "number" && req.session.counter > 0) {
            req.session.counter -= 1;
        } else {
            req.session.counter = 0;
        }
        if (req.user && req.user.id) {
            moviesBL.logUserAction(req.user.id, actionType, req.session.counter);
        }
    }
    return req.session.counter;
}

function checkCounterLimit(req, res) {
    if (req.session.counter <= 0) {
        const verifyToken = require("../utils/verifyToken");
        if (req.user && req.user.id) {
            verifyToken.blockedUsers.add(req.user.id);
            req.session.blockedUserId = req.user.id;
        }
        req.session.destroy((err) => {
            res.clearCookie("token");
            if (err) {
                return res.status(500).json({ message: "Logout failed" });
            }
            return res.status(401).json({ message: "Logged out due to counter limit" });
        });
        return true;
    }
    return false;
}

router.use(verifyToken);

router.get("/", async (req, res) => {
    let response = await moviesBL.getAllMovies();
    handleCounter(req, "GET_MOVIE");
    if (checkCounterLimit(req, res)) return;
    res.send({ userId: req.user.id, movies: response });
});

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    let response = await moviesBL.getMovieById(id);
    handleCounter(req, "GET_MOVIE");
    if (checkCounterLimit(req, res)) return;
    res.send(response);
});

router.post("/", async (req, res) => {
    let movieData = req.body;
    movieData.userId = req.user.id;
    let response = await moviesBL.createNewMovie(movieData);
    handleCounter(req, "POST_MOVIE");
    if (checkCounterLimit(req, res)) return;
    res.send(response);
});

router.put("/:id", async (req, res) => {
    let { id } = req.params;
    let movieData = req.body;
    let response = await moviesBL.updateMovie(id, movieData);
    handleCounter(req, "PUT_MOVIE");
    if (checkCounterLimit(req, res)) return;
    res.send(response);
});

router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let response = await moviesBL.deleteMovie(id);
    handleCounter(req, "DELETE_MOVIE");
    if (checkCounterLimit(req, res)) return;
    res.send(response);
});

module.exports = router;