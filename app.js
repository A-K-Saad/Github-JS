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
    searchContainer.textContent = "";
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
        
        ${company !== null ? `<small class="d-block fw-bold"><i class="far fa-building"></i>@${company}</small>` : ""}
        
    `;
    userContainer.appendChild(leftSide);
    //----------Right side
    const fetchRepo = async () => {
        const resRepo = await fetch(`https://api.github.com/users/${login}/repos?sort=created&direction=desc`);
        const repoData = await resRepo.json();
        displayRepo(repoData);
    }
    fetchRepo();

    const displayRepo = (repoData) => {
        //Creating right side
        const rightSide = document.createElement("div");
        rightSide.classList.add("col-12", "col-md-9", "p-3", "d-grid", "text-dark");
        //Mapping all objects
        repoData.forEach(repo => {
            const { name, html_url, language } = repo;
            //Creating contents
            const rightSideContents = document.createElement("div");
            rightSideContents.classList.add("p-2", "col-12");
            rightSideContents.innerHTML = `
                <div class="col-12 border-bottom py-4">
                    <a href="${html_url}" class="text-decoration-none"><h4 class="text-primary repo-name">${name}</h4></a>
                    ${language !== null ? `<small><i class="fas fa-circle text-danger"></i> ${language}</small>` : ""}
                </div>
            `;

            rightSide.appendChild(rightSideContents);
            userContainer.appendChild(rightSide);
        });
    }
}
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