const searchContainer = document.querySelector(".search-section");
const searchBtn = document.getElementById("search-btn");
const inputFiled = document.getElementById("search-input");
const userContainer = document.getElementById("user-container");

//Disaling page refresh
searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    fetchUser();
    inputFiled.value = "";
});
//Showing alerts
const showAlert = () => {
    document.querySelector(".alert-section").style.display = "block";
    setTimeout(() => {
        document.querySelector(".alert-section").style.display = "none";
    }, 2000);
}
//Fetching Users
const fetchUser = async () => {
    const url = `https://api.github.com/users/${inputFiled.value}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.login == undefined) {
        searchBtn.setAttribute("disabled", true);
        return showAlert();
    }
    else {
        displayUser(data);
    }

    inputFiled.value = "";
    searchBtn.setAttribute("disabled", true);
    searchContainer.classList.remove("d-flex");
    searchContainer.classList.add("d-none");
}
//Displaying users
const displayUser = data => {
    searchContainer.style.setProperty = ("display", "none", "important");
    const { avatar_url, name, login, bio, followers, following, location, twitter_username, company } = data;
    //Getting stars
    const getStars = async () => {
        const response = await fetch(`https://api.github.com/users/${login}/starred`);
        const data = await response.json();
        const starCount = document.getElementById("star-count");
        starCount.innerText = data.length;
    }
    getStars();
    //----------Left Side
    const leftSide = document.createElement("div");
    leftSide.classList.add("col-12", "col-md-3", "p-3", "d-grid", "text-dark");
    leftSide.innerHTML = `
        <img src="${avatar_url}" alt="" class="rounded-pill img-fluid w-100 border">
        <h2 class="user-name fw-bold">${name !== null ? name : ""}</h2>
        <h4 class="text-secondary m-0">${login}</h4>
        <h5 class="pt-3">${bio !== null ? bio : ""}</h5>
        <a href="https://github.com/${login}" class="btn follow-btn border shadow-none mt-1 mb-3">Follow</a>
        
        <small class="d-block pb-3 fw-bold"><i class="fas fa-user-friends"></i> ${followers} followers · ${following} following · <a href="https://github.com/${login}?tab=stars" class="text-decoration-none text-dark" target="_blank"><i class="far fa-star"></i> <span id="star-count"></span></a></small>
        
        ${location !== null ? `<small class="d-block fw-bold location"><i class="fas fa-map-marker-alt pe-1"></i> ${location}</small>` : ""}
        
        ${twitter_username !== null ? `<small class="d-block fw-bold"><a href="https://twitter.com/${twitter_username}" class="text-decoration-none text-dark"><i class="fab fa-twitter pe-1"></i>@${twitter_username}</a></small>` : ""}
        
        ${company !== null ? `<small class="d-block fw-bold"><i class="far fa-building"></i>${company}</small>` : ""}
        
    `;
    userContainer.appendChild(leftSide);
    //----------Right side
    const fetchRepo = async () => {
        const resRepo = await fetch(`https://api.github.com/users/${login}/repos?sort=created&direction=desc`);
        const repoData = await resRepo.json();
        displayRepo(repoData);
    }
    fetchRepo();
    const fetchFollowing = async () => {
        const resFollowing = await fetch(`https://api.github.com/users/${login}/following`);
        const followingData = await resFollowing.json();
        displayFollowing(followingData);
    }
    const fetchFollower = async () => {
        const resFollowers = await fetch(`https://api.github.com/users/${login}/followers`);
        const followersData = await resFollowers.json();
        displayFollowers(followersData);
    }
    fetchFollower();
    fetchFollowing();
    //Creating right side
    const rightSide = document.createElement("div");
    rightSide.classList.add("col-12", "col-md-9", "p-3", "d-grid", "text-dark");

    //Navs and tabs
    const navBar = document.createElement("ul");
    navBar.classList.add("p-0");
    navBar.innerHTML = `
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button class="nav-link active" id="repository-tab" data-bs-toggle="tab" data-bs-target="#repository" type="button" role="tab" aria-controls="repository" aria-selected="true"><i class="fas fa-book pe-2"></i>Repositories</button>
            <button class="nav-link" id="following-tab" data-bs-toggle="tab" data-bs-target="#following" type="button" role="tab" aria-controls="following" aria-selected="false"><i class="fas fa-users pe-2"></i>Followings</button>
            <button class="nav-link" id="follower-tab" data-bs-toggle="tab" data-bs-target="#follower" type="button" role="tab" aria-controls="follower" aria-selected="false"><i class="fas fa-user-tag pe-2"></i>Followers</button>
            </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="repository" role="tabpanel" aria-labelledby="repository-tab"></div>
            <div class="tab-pane fade" id="following" role="tabpanel" aria-labelledby="following-tab"></div>
            <div class="tab-pane fade" id="follower" role="tabpanel" aria-labelledby="follower-tab"></div>
        </div>
    `;
    rightSide.appendChild(navBar);
    userContainer.appendChild(rightSide);
    const displayRepo = (data) => {
        data.forEach(repo => {
            const { name, html_url, language } = repo;
            //Creating contents
            const allRepositories = document.createElement("div");
            allRepositories.classList.add("p-2", "col-12", "each-repo");
            allRepositories.innerHTML = `
                <div class="col-12 border-bottom py-4">
                    <a href="${html_url}" class="text-decoration-none"><h4 class="text-primary repo-name">${name}</h4></a>
                    ${language !== null ? `<small><i class="fas fa-circle text-danger"></i> ${language}</small>` : ""}
                </div>
            `;
            const repoContainer = document.querySelector("#repository");
            repoContainer.appendChild(allRepositories);
        });
    }
    const displayFollowing = (data) => {
        data.forEach(following => {
            const { avatar_url, url } = following;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const allFollowing = document.createElement("div");
                    allFollowing.classList.add("p-2", "col-12", "each-following");
                    allFollowing.innerHTML = `
                        <div class="col-12 border-bottom py-4 d-flex">
                            <img src="${avatar_url}" alt="Avatar" class="following-img m-2">
                            <div class="ps-2">
                                <h5 class="d-inline">${data.name ? data.name : ""}</h5>
                                <h6 class="text-secondary d-inline">${data.login ? data.login : ""}</h6>
                                
                                <br>

                                <h6 class="pt-3 text-secondary">${data.bio !== null ? data.bio : ""}</h6>
                                ${data.location !== null ? `<small class="location"><i class="fas fa-map-marker-alt pe-1"></i> ${data.location}</small>` : ""}
                                
                                ${data.twitter_username !== null ? `<small class="ps-2"><a href="https://twitter.com/${data.twitter_username}" class="text-decoration-none text-dark"><i class="fab fa-twitter pe-1"></i>@${data.twitter_username}</a></small>` : ""}
                                
                                ${data.company !== null ? `<small class="ps-2"><i class="far fa-building pe-2"></i>${data.company}</small>` : ""}
                            </div>
                        </div>
                    `;
                    const followingContainer = document.querySelector("#following");
                    followingContainer.appendChild(allFollowing);
                });
        });
    }
    const displayFollowers = (data) => {
        data.forEach(follower => {
            const { avatar_url, url } = follower;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const allFollowers = document.createElement("div");
                    allFollowers.classList.add("p-2", "col-12", "each-following");
                    allFollowers.innerHTML = `
                        <div class="col-12 border-bottom py-4 d-flex">
                            <img src="${avatar_url}" alt="Avatar" class="following-img m-2">
                            <div class="ps-2">
                                <h5 class="d-inline">${data.name ? data.name : ""}</h5>
                                <h6 class="text-secondary d-inline">${data.login ? data.login : ""}</h6>
                                
                                <br>

                                <h6 class="pt-3 text-secondary">${data.bio !== null ? data.bio : ""}</h6>
                                ${data.location !== null ? `<small class="location"><i class="fas fa-map-marker-alt pe-1"></i> ${data.location}</small>` : ""}
                                
                                ${data.twitter_username !== null ? `<small class="ps-2"><a href="https://twitter.com/${data.twitter_username}" class="text-decoration-none text-dark"><i class="fab fa-twitter pe-1"></i>@${data.twitter_username}</a></small>` : ""}
                                
                                ${data.company !== null ? `<small class="ps-2"><i class="far fa-building pe-2"></i>${data.company}</small>` : ""}
                            </div>
                        </div>
                    `;
                    const repoContainer = document.querySelector("#follower");
                    repoContainer.appendChild(allFollowers);
                });
        })
    }
}
// navClicking();

//Disableing button for empty value
const disableBtn = () => {
    inputFiled.addEventListener("keyup", () => {
        if (inputFiled.value !== "") {
            searchBtn.removeAttribute("disabled");
        }
        else {
            searchBtn.setAttribute("disabled", true);
        }
    });
}
disableBtn();