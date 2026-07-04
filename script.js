const usernameInput = document.getElementById("usernameInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const profileCard = document.getElementById("profileCard");
const repoSection = document.getElementById("repoSection");
const repoList = document.getElementById("repoList");
const themeBtn = document.getElementById("themeBtn");

const API_URL = "https://api.github.com/users/";

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function fetchGitHubUser(username) {
  setMessage("Loading profile...", "loading");
  profileCard.classList.add("hidden");
  repoSection.classList.add("hidden");

  try {
    const userResponse = await fetch(`${API_URL}${username}`);

    if (!userResponse.ok) {
      throw new Error("User not found");
    }

    const user = await userResponse.json();

    const repoResponse = await fetch(
      `${API_URL}${username}/repos?sort=updated&per_page=6`,
    );
    const repos = await repoResponse.json();

    displayProfile(user);
    displayRepos(repos);

    setMessage("Profile loaded successfully.", "success");
  } catch (error) {
    setMessage(
      "User not found. Please check the username and try again.",
      "error",
    );
  }
}

function displayProfile(user) {
  profileCard.innerHTML = `
    <div class="profile-top">
      <img src="${user.avatar_url}" alt="${user.login}" />

      <div class="profile-info">
        <h2>${user.name || user.login}</h2>
        <p class="username">@${user.login}</p>
        <p class="bio">${user.bio || "No bio available."}</p>
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <h3>${user.public_repos}</h3>
        <p>Repositories</p>
      </div>

      <div class="stat">
        <h3>${user.followers}</h3>
        <p>Followers</p>
      </div>

      <div class="stat">
        <h3>${user.following}</h3>
        <p>Following</p>
      </div>
    </div>

    <div class="details">
      <p><strong>Location:</strong> ${user.location || "Not available"}</p>
      <p><strong>Company:</strong> ${user.company || "Not available"}</p>
      <p><strong>Website:</strong> ${
        user.blog
          ? `<a href="${user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}" target="_blank">Visit Website</a>`
          : "Not available"
      }</p>
      <p><strong>Joined:</strong> ${formatDate(user.created_at)}</p>
    </div>

    <a href="${user.html_url}" target="_blank" class="profile-link">View GitHub Profile</a>
  `;

  profileCard.classList.remove("hidden");
}

function displayRepos(repos) {
  repoList.innerHTML = "";

  if (repos.length === 0) {
    repoList.innerHTML = "<p>No repositories found.</p>";
  }

  repos.forEach((repo) => {
    const repoCard = document.createElement("div");
    repoCard.classList.add("repo-card");

    repoCard.innerHTML = `
      <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
      <p>${repo.description || "No description available."}</p>

      <div class="repo-meta">
        <span>⭐ ${repo.stargazers_count}</span>
        <span>🍴 ${repo.forks_count}</span>
        <span>${repo.language || "N/A"}</span>
      </div>
    `;

    repoList.appendChild(repoCard);
  });

  repoSection.classList.remove("hidden");
}

function searchUser() {
  const username = usernameInput.value.trim();

  if (username === "") {
    setMessage("Please enter a GitHub username.", "error");
    return;
  }

  fetchGitHubUser(username);
}

searchBtn.addEventListener("click", searchUser);

usernameInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchUser();
  }
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("githubFinderTheme", isDark ? "dark" : "light");
});

function loadTheme() {
  const savedTheme = localStorage.getItem("githubFinderTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  }
}

loadTheme();
