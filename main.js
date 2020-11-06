const initialURL =
  " https://api.github.com/search/repositories?q=topic:free+topic:tutorial+topic:course";
let pageNumber = 1;
let searchWord;

function infiniteScroll() {
  window.addEventListener("scroll", () => {
    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight
    ) {
      pageNumber++;
      console.log(pageNumber);
      apiCall(searchWord, pageNumber);
    }
  });
}

function displayOnDOM(responseJson) {
  const githubData = responseJson.items;
  console.log(githubData);

  for (let i = 0; i < githubData.length; i++) {
    $(".results-list").append(`
      <a class="result-link" href=${githubData[i].html_url}>${githubData[i].name}</a>
      <p class="result-p">${githubData[i].description}</p>
      `); //instead of two things make empty ul, padding-start:inline list-style none
  }
}

function apiCall(searchWord, pageNumber) {
  const parameter = {
    q: searchWord,
  };

  const queryItem = Object.keys(parameter).map((key) => {
    return encodeURIComponent(key) + "=" + encodeURIComponent(parameter[key]);
  });

  console.log(queryItem);

  const searchURL =
    initialURL +
    "&" +
    queryItem +
    "&" +
    `"sort=stars&order=desc&page=${pageNumber}&per_page=50"`;
  console.log(searchURL);

  fetch(searchURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        $(".error-message").append(response.status);
      }
    })
    .then((responseJson) => displayOnDOM(responseJson));
}

function returnButton() {
  $(".return-button").on("click", function () {
    window.location.reload();
  });
}

function submitButton() {
  $(".search-form").submit((event) => {
    event.preventDefault();
    $(".form-container").addClass("hidden");
    $(".results-container").removeClass("hidden");
    searchWord = $(".topic-input").val();
    console.log(searchWord);
    apiCall(searchWord);
  });
}

$(submitButton);
$(returnButton);
$(infiniteScroll);
