(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const template = '<!doctype html>\n<html lang="ko">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="stylesheet" href="./styles/reset.css" />\n    <link rel="stylesheet" href="./styles/main.css" />\n    <link rel="stylesheet" href="./styles/tab.css" />\n    <link rel="stylesheet" href="./styles/thumbnail.css" />\n    <title>영화 리뷰</title>\n  </head>\n\n  <body>\n    <div id="app">\n      <header id="header">\n        <div class="header-top">\n          <h1 class="logo">\n            <a href="./"><img src="./images/logo.png" alt="MovieList" /></a>\n          </h1>\n          <div class="search-bar">\n            <input\n              type="text"\n              class="search-input"\n              placeholder="검색어를 입력하세요"\n            />\n            <button class="search-button">\n              <img\n                src="./images/search_icon.png"\n                alt="검색"\n                class="search-icon"\n              />\n            </button>\n          </div>\n        </div>\n        <div class="background-container">\n          <div class="overlay" aria-hidden="true"></div>\n          <div class="top-rated-container">\n            <div class="top-rated-movie"></div>\n          </div>\n        </div>\n      </header>\n      <div class="container">\n        <!-- <ul class="tab">\n        <li>\n          <a href="#">\n            <div class="tab-item selected">\n              <h3>상영 중</h3>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href="#">\n            <div class="tab-item">\n              <h3>인기순</h3>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href="#">\n            <div class="tab-item">\n              <h3>평점순</h3>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href="#">\n            <div class="tab-item">\n              <h3>상영 예정</h3>\n            </div>\n          </a>\n        </li>\n      </ul> -->\n        <main>\n          <section>\n            <h2 id="section-title">지금 인기 있는 영화</h2>\n            <ul class="thumbnail-list"></ul>\n          </section>\n        </main>\n        <button id="load-movie-button">더 보기</button>\n      </div>\n\n      <footer class="footer">\n        <p><img src="./images/woowacourse_logo.png" width="180" /></p>\n        <p>&copy; 우아한테크코스 All Rights Reserved.</p>\n      </footer>\n    </div>\n  </body>\n</html>\n\n<!--\n  포스터 원본: https://image.tmdb.org/t/p/original//pmemGuhr450DK8GiTT44mgwWCP7.jpg\n  포스터 썸네일: https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg\n  배너 원본: https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg\n-->\n';
const posterBaseURL = "https://image.tmdb.org/t/p/original";
const createMovieItemHTML = (movie) => {
  const posterSrc = `${posterBaseURL}${movie.poster_path}`;
  const li = document.createElement("li");
  li.insertAdjacentHTML(
    "beforeend",
    /*html*/
    `
    <div class="item skeleton">
      <div class="skeleton-poster"></div>
      <img class="thumbnail" src="${posterSrc}" alt="영화 포스터 사진" />
      <div class="item-desc">
        <div class="skeleton-rate"></div>
        <div class="skeleton-title"></div>
        <p class="rate">
          <img src="./images/star_empty.png" class="star"/><span>${movie.vote_average}</span>
        </p>
        <strong>${movie.title}</strong>
      </div>
    </div>`
  );
  return li;
};
const createBannerHTML = (movie) => {
  const div = document.createElement("div");
  div.insertAdjacentHTML(
    "beforeend",
    /*html*/
    `
    <div class="rate">
      <img src="./images/star_empty.png" class="star" />
      <span class="rate-value">${movie.vote_average}</span>
    </div>
    <div class="title">${movie.title}</div>
    <button class="primary detail">자세히 보기</button>
  `
  );
  return div;
};
const createNoResultHTML = () => {
  const div = document.createElement("div");
  div.insertAdjacentHTML(
    "beforeend",
    /*html*/
    `
  <div id="no-result">
    <img src="./images/planet_icon.png" alt="검색 결과 없음" class="no-result-icon" />
    <p class="no-result-text">검색 결과가 없습니다.</p>
  </div>`
  );
  return div;
};
const DOM = {
  get thumbnailList() {
    return document.querySelector(".thumbnail-list");
  },
  get backgroundContainer() {
    return document.querySelector(".background-container");
  },
  get loadMovieButton() {
    return document.querySelector("#load-movie-button");
  },
  get sectionTitle() {
    return document.querySelector("#section-title");
  },
  get banner() {
    return document.querySelector(".top-rated-movie");
  },
  get searchInput() {
    return document.querySelector(".search-input");
  }
};
const bannerBaseURL = "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces";
const renderMovies = (movies) => {
  movies.forEach((movie) => {
    const li = createMovieItemHTML(movie);
    attachSkeletonEvents(li);
    DOM.thumbnailList?.appendChild(li);
  });
};
const attachSkeletonEvents = (li) => {
  const img = li.querySelector(".thumbnail");
  const removeSkeleton = () => {
    li.querySelector(".item")?.classList.remove("skeleton");
    li.querySelector(".skeleton-poster")?.remove();
    li.querySelector(".skeleton-rate")?.remove();
    li.querySelector(".skeleton-title")?.remove();
  };
  img.addEventListener("load", removeSkeleton, { once: true });
  img.addEventListener(
    "error",
    () => {
      img.src = "./images/no_image.png";
      removeSkeleton();
    },
    { once: true }
  );
};
const renderBanner = (movie) => {
  if (DOM.backgroundContainer) {
    DOM.backgroundContainer.style.backgroundImage = `url("${bannerBaseURL + movie.backdrop_path}")`;
  }
  DOM.banner?.appendChild(createBannerHTML(movie));
};
const renderSearchedMovies = (movies) => {
  if (DOM.thumbnailList && movies.length === 0) {
    DOM.thumbnailList.appendChild(createNoResultHTML());
  }
  movies.forEach((movie) => {
    const li = createMovieItemHTML(movie);
    attachSkeletonEvents(li);
    DOM.thumbnailList?.appendChild(li);
  });
};
const setupEventListeners = (onSearchSubmit, onLoadMore) => {
  const loadMovieButton = DOM.loadMovieButton;
  if (!loadMovieButton) return;
  document.addEventListener("click", (e) => {
    if (e.target.closest(".search-button")) {
      onSearchSubmit();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.closest(".search-input")) {
      onSearchSubmit();
    }
  });
  loadMovieButton.addEventListener("click", onLoadMore);
};
const fetchMovies = async (moviePageCount) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${moviePageCount}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWYwODNjMTAyMjBiOTA1NGJlZGVkNGY3YWZhMjM2NSIsIm5iZiI6MTc3NDg0MzUwMS4zNjYwMDAyLCJzdWIiOiI2OWM5ZjY2ZGEwYTA5YjQ5M2E4Mzk0YTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FOPeyes9rY20axIrHitx-G2rDslDDKpyCDctcEBh6Cw"}`
        }
      }
    );
    if (!response.ok) {
      throw new Error("[ERROR]인기 영화 불러오기에 실패하였습니다.");
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("[ERROR]네트워크 오류가 발생했습니다.");
  }
};
const fetchSearchedMovies = async (searchKeyword, searchPageCount) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${searchKeyword}&page=${searchPageCount}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWYwODNjMTAyMjBiOTA1NGJlZGVkNGY3YWZhMjM2NSIsIm5iZiI6MTc3NDg0MzUwMS4zNjYwMDAyLCJzdWIiOiI2OWM5ZjY2ZGEwYTA5YjQ5M2E4Mzk0YTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FOPeyes9rY20axIrHitx-G2rDslDDKpyCDctcEBh6Cw"}`
        }
      }
    );
    if (!response.ok) {
      throw new Error("[ERROR]검색 영화 불러오기에 실패하였습니다.");
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("[ERROR]네트워크 오류가 발생했습니다.");
  }
};
class PopularMovies {
  #currentPage = 1;
  #totalPages = 0;
  #movies = [];
  async fetch() {
    const data = await fetchMovies(this.#currentPage);
    this.#movies = data.results;
    this.#totalPages = data.total_pages;
  }
  async loadMore() {
    this.#currentPage += 1;
    await this.fetch();
  }
  get movies() {
    return this.#movies;
  }
  get isLastPage() {
    return this.#currentPage === this.#totalPages;
  }
}
class SearchedMovies {
  #currentPage = 1;
  #totalPages = 0;
  #movies = [];
  async fetch(keyword) {
    const data = await fetchSearchedMovies(keyword, this.#currentPage);
    this.#movies = data.results;
    this.#totalPages = data.total_pages;
  }
  async loadMore(keyword) {
    this.#currentPage += 1;
    await this.fetch(keyword);
  }
  get movies() {
    return this.#movies;
  }
  get isLastPage() {
    return this.#currentPage === this.#totalPages;
  }
  reset() {
    this.#currentPage = 1;
  }
}
class App {
  #popular = new PopularMovies();
  #searched = new SearchedMovies();
  #mode = "popular";
  constructor() {
    document.querySelector("#app").innerHTML = template;
    this.#loadPopularMovies();
    setupEventListeners(
      () => this.#handleSearchSubmit(),
      () => this.#handleLoadMore()
    );
  }
  #loadPopularMovies = async () => {
    this.#mode = "loading";
    try {
      await this.#popular.fetch();
      renderBanner(this.#popular.movies[0]);
      renderMovies(this.#popular.movies);
      if (this.#popular.isLastPage) this.#hideLoadButton();
    } catch (error) {
      alert(error instanceof Error ? error.message : "오류가 발생했습니다.");
    } finally {
      this.#mode = "popular";
    }
  };
  #handleSearchSubmit = async () => {
    if (!DOM.searchInput || this.#mode === "loading") return;
    this.#mode = "loading";
    this.#searched.reset();
    if (DOM.thumbnailList) DOM.thumbnailList.replaceChildren();
    if (DOM.loadMovieButton) DOM.loadMovieButton.style.display = "";
    if (DOM.backgroundContainer) DOM.backgroundContainer.hidden = true;
    try {
      await this.#searched.fetch(DOM.searchInput.value);
      renderSearchedMovies(this.#searched.movies);
      if (this.#searched.isLastPage) this.#hideLoadButton();
      if (DOM.sectionTitle) {
        DOM.sectionTitle.textContent = `"${DOM.searchInput.value}" 검색 결과`;
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "오류가 발생했습니다.");
    } finally {
      this.#mode = "search";
    }
  };
  #handleLoadMore = () => {
    if (this.#mode === "loading") return;
    if (this.#mode === "popular") this.#loadMorePopular();
    else if (this.#mode === "search") this.#loadMoreSearched();
  };
  #loadMorePopular = async () => {
    this.#mode = "loading";
    try {
      await this.#popular.loadMore();
      renderMovies(this.#popular.movies);
      if (this.#popular.isLastPage) this.#hideLoadButton();
    } catch (error) {
      alert(error instanceof Error ? error.message : "오류가 발생했습니다.");
    } finally {
      this.#mode = "popular";
    }
  };
  #loadMoreSearched = async () => {
    if (!DOM.searchInput) return;
    this.#mode = "loading";
    try {
      await this.#searched.loadMore(DOM.searchInput.value);
      renderSearchedMovies(this.#searched.movies);
      if (this.#searched.isLastPage) this.#hideLoadButton();
    } catch (error) {
      alert(error instanceof Error ? error.message : "오류가 발생했습니다.");
    } finally {
      this.#mode = "search";
    }
  };
  #hideLoadButton() {
    if (DOM.loadMovieButton) DOM.loadMovieButton.style.display = "none";
  }
}
new App();
