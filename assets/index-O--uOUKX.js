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
const template = '<!doctype html>\n<html lang="ko">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="stylesheet" href="./styles/reset.css" />\n    <link rel="stylesheet" href="./styles/main.css" />\n    <link rel="stylesheet" href="./styles/tab.css" />\n    <link rel="stylesheet" href="./styles/thumbnail.css" />\n    <link rel="stylesheet" href="./styles/modal.css" />\n    <title>영화 리뷰</title>\n  </head>\n\n  <body>\n    <div id="app">\n      <header id="header">\n        <div class="header-top">\n          <h1 class="logo">\n            <a href="./"><img src="./images/logo.png" alt="MovieList" /></a>\n          </h1>\n          <div class="search-bar">\n            <input\n              type="text"\n              class="search-input"\n              placeholder="검색어를 입력하세요"\n            />\n            <button class="search-button">\n              <img\n                src="./images/search_icon.png"\n                alt="검색"\n                class="search-icon"\n              />\n            </button>\n          </div>\n        </div>\n        <div class="background-container">\n          <div class="overlay" aria-hidden="true"></div>\n          <div class="top-rated-container">\n            <div class="top-rated-movie"></div>\n          </div>\n        </div>\n      </header>\n      <div class="container">\n        <!-- <ul class="tab">\n        <li>\n          <a href="#">\n            <div class="tab-item selected">\n              <h3>상영 중</h3>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href="#">\n            <div class="tab-item">\n              <h3>인기순</h3>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href="#">\n            <div class="tab-item">\n              <h3>평점순</h3>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href="#">\n            <div class="tab-item">\n              <h3>상영 예정</h3>\n            </div>\n          </a>\n        </li>\n      </ul> -->\n        <main>\n          <section>\n            <h2 id="section-title">지금 인기 있는 영화</h2>\n            <ul class="thumbnail-list"></ul>\n          </section>\n        </main>\n        <!-- <button id="load-movie-button">더 보기</button> -->\n      </div>\n\n      <footer class="footer">\n        <p><img src="./images/woowacourse_logo.png" width="180" /></p>\n        <p>&copy; 우아한테크코스 All Rights Reserved.</p>\n      </footer>\n    </div>\n  </body>\n</html>\n\n<!--\n  포스터 원본: https://image.tmdb.org/t/p/original//pmemGuhr450DK8GiTT44mgwWCP7.jpg\n  포스터 썸네일: https://media.themoviedb.org/t/p/w440_and_h660_face/pmemGuhr450DK8GiTT44mgwWCP7.jpg\n  배너 원본: https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg\n-->\n';
const posterBaseURL$1 = "https://image.tmdb.org/t/p/original";
const createMovieItemHTML = (movie) => {
  const posterSrc = `${posterBaseURL$1}${movie.poster_path}`;
  const li = document.createElement("li");
  li.dataset.movieId = String(movie.id);
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
    <button class="primary detail" data-movie-id="${movie.id}">자세히 보기</button>
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
const createModalHTML = () => {
  const div = document.createElement("div");
  div.insertAdjacentHTML(
    "beforeend",
    /*html*/
    `<div class="modal-background" id="modalBackground">
      <div class="modal">
        <button class="close-modal" id="closeModal">
          <img src="./images/modal_button_close.png" />
        </button>
        <div class="modal-container">
          <div class="modal-image">
            <img src="" alt="영화 포스터" />
          </div>
          <div class="modal-description">
            <h2></h2>
            <p class="category"></p>
            <p class="rate">
              <span>평균</span> <img src="./images/star_filled.png" class="star" /><span id="average-score"></span>
            </p>
            <hr />
            <h3>내 별점</h3>
            <div id="customRate">
                <div id="rate-stars"></div>                                                      
                <span id="rate-evaluate"></span>                                                 
                <span id="rate-score"></span></div>
            <hr />
            <p class="detail"></p>
          </div>
        </div>
      </div>
    </div>`
  );
  return div;
};
const initTemplate = () => {
  document.querySelector("#app").innerHTML = template;
  document.body.appendChild(createModalHTML());
};
const getKeyword = () => document.querySelector(".search-input")?.value ?? "";
const initSearchSubmit = (onSubmit) => {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".search-button")) {
      const keyword = getKeyword();
      if (keyword) onSubmit(keyword);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.closest(".search-input")) {
      const keyword = getKeyword();
      if (keyword) onSubmit(keyword);
    }
  });
};
const initDetailClick = (onClick) => {
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".primary.detail");
    if (!target) return;
    const movieId = target.dataset.movieId;
    if (!movieId) return;
    onClick(Number(movieId));
  });
};
const initLoadMore = (onLoadMore) => {
  window.addEventListener("scroll", () => {
    if (window.scrollY + window.innerHeight === document.documentElement.scrollHeight) onLoadMore();
  });
};
const initMovieClick = (onSelect) => {
  document.addEventListener("click", (e) => {
    const li = e.target.closest(".thumbnail-list li");
    if (!li?.dataset.movieId) return;
    onSelect(Number(li.dataset.movieId));
  });
};
const initRatingClick = (onRate) => {
  document.querySelector("#rate-stars")?.addEventListener("click", (e) => {
    const target = e.target;
    const index = target.dataset.index;
    if (!index) return;
    onRate(Number(index) * 2);
  });
};
const initModalClose = (onClose) => {
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (target.closest("#closeModal") || target.id === "modalBackground") {
      onClose();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") onClose();
  });
};
class MovieBrowser {
  #mode = "popular";
  #keyword = "";
  #page = 1;
  #totalPages = 0;
  get isLastPage() {
    return this.#totalPages > 0 && this.#page >= this.#totalPages;
  }
  get canLoadMore() {
    return !this.isLastPage;
  }
  get isNewSession() {
    return this.#page === 1;
  }
  get showsBanner() {
    return this.#mode === "popular";
  }
  get sectionTitle() {
    return this.#mode === "search" ? `"${this.#keyword}" 검색 결과` : "";
  }
  get currentPage() {
    return this.#page;
  }
  get nextPageNumber() {
    return this.#page + 1;
  }
  startSearch(keyword) {
    this.#mode = "search";
    this.#keyword = keyword;
    this.#page = 1;
    this.#totalPages = 0;
  }
  setTotalPages(totalPages) {
    this.#totalPages = totalPages;
  }
  nextPage() {
    if (!this.canLoadMore) return;
    this.#page += 1;
  }
}
const defaultOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWYwODNjMTAyMjBiOTA1NGJlZGVkNGY3YWZhMjM2NSIsIm5iZiI6MTc3NDg0MzUwMS4zNjYwMDAyLCJzdWIiOiI2OWM5ZjY2ZGEwYTA5YjQ5M2E4Mzk0YTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FOPeyes9rY20axIrHitx-G2rDslDDKpyCDctcEBh6Cw"}`
  }
};
const get = async (url, errorMessage, signal) => {
  const response = await fetch(url, { ...defaultOptions, signal });
  if (!response.ok)
    throw new Error(`[ERROR] ${response.status} ${response.statusText} - ${errorMessage}`);
  return response.json();
};
const apiFetch = async (url, errorMessage, signal) => {
  const json = await get(url, errorMessage, signal);
  return { results: json.results, totalPages: json.total_pages };
};
const fetchMovies = (page, signal) => {
  const popularMoviesUrl = new URL("https://api.themoviedb.org/3/movie/popular");
  popularMoviesUrl.searchParams.set("language", "en-US");
  popularMoviesUrl.searchParams.set("page", String(page));
  return apiFetch(popularMoviesUrl.href, "인기 영화 불러오기에 실패하였습니다.", signal);
};
const fetchSearchedMovies = (keyword, page, signal) => {
  const searchMoviesUrl = new URL("https://api.themoviedb.org/3/search/movie");
  searchMoviesUrl.searchParams.set("query", keyword);
  searchMoviesUrl.searchParams.set("language", "en-US");
  searchMoviesUrl.searchParams.set("page", String(page));
  return apiFetch(searchMoviesUrl.href, "검색 영화 불러오기에 실패하였습니다.", signal);
};
const fetchMovieDetail = async (id, signal) => {
  const url = new URL(`https://api.themoviedb.org/3/movie/${id}`);
  url.searchParams.set("language", "en-US");
  const json = await get(url.href, "영화 상세 정보 불러오기에 실패하였습니다.", signal);
  return {
    id: json.id,
    title: json.title,
    poster_path: json.poster_path,
    vote_average: json.vote_average,
    overview: json.overview,
    release_date: json.release_date,
    genres: json.genres
  };
};
const popularStrategy = (page, signal) => fetchMovies(page, signal);
const searchStrategy = (keyword) => (page, signal) => fetchSearchedMovies(keyword, page, signal);
const bannerBaseURL = "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces";
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
const appendMovie = (movie) => {
  const li = createMovieItemHTML(movie);
  attachSkeletonEvents(li);
  document.querySelector(".thumbnail-list")?.appendChild(li);
};
const renderMovieList = (movies) => {
  movies.forEach(appendMovie);
};
const renderBanner = (movie) => {
  const bg = document.querySelector(".background-container");
  if (bg) bg.style.backgroundImage = `url("${bannerBaseURL + movie.backdrop_path}")`;
  document.querySelector(".top-rated-movie")?.appendChild(createBannerHTML(movie));
};
const renderNoResult = () => {
  document.querySelector(".thumbnail-list")?.appendChild(createNoResultHTML());
};
const clearMovieList = () => {
  const thumbnailList = document.querySelector(".thumbnail-list");
  if (thumbnailList) thumbnailList.replaceChildren();
};
const showBanner = () => {
  const bg = document.querySelector(".background-container");
  if (bg) bg.hidden = false;
};
const hideBanner = () => {
  const bg = document.querySelector(".background-container");
  if (bg) bg.hidden = true;
};
const render = (state, movies) => {
  if (state.isNewSession) {
    clearMovieList();
    if (state.showsBanner) {
      showBanner();
      renderBanner(movies[0]);
    } else {
      hideBanner();
    }
  }
  if (movies.length === 0) {
    renderNoResult();
  } else {
    renderMovieList(movies);
  }
};
const showError = (error) => {
  alert(error instanceof Error ? error.message : "오류가 발생했습니다.");
};
const browser = new MovieBrowser();
let strategy = popularStrategy;
let controller;
let isLoading = false;
const createNewRequest = () => {
  controller?.abort();
  controller = new AbortController();
  return controller.signal;
};
const handleSuccess = (data, onSuccess) => {
  onSuccess?.();
  browser.setTotalPages(data.totalPages);
  render(browser, data.results);
};
const handleError = (error) => {
  if (error instanceof DOMException && error.name === "AbortError") return;
  showError(error);
};
const load = async (page, onSuccess) => {
  const signal = createNewRequest();
  isLoading = true;
  try {
    const data = await strategy(page, signal);
    handleSuccess(data, onSuccess);
  } catch (error) {
    handleError(error);
  } finally {
    isLoading = false;
  }
};
const loadPopular = () => load(browser.currentPage);
const search = (keyword) => {
  strategy = searchStrategy(keyword);
  browser.startSearch(keyword);
  return load(browser.currentPage);
};
const loadMore = () => {
  if (!browser.canLoadMore) return;
  if (isLoading) return;
  return load(browser.nextPageNumber, () => browser.nextPage());
};
class MovieSelection {
  #selected = null;
  get selected() {
    return this.#selected;
  }
  get isOpen() {
    return this.#selected !== null;
  }
  select(detail) {
    this.#selected = detail;
  }
  close() {
    this.#selected = null;
  }
}
const renderStars = (rate) => {
  const starsEl = document.querySelector("#rate-stars");
  if (!starsEl) return;
  starsEl.innerHTML = "";
  const filledCount = rate === null ? 0 : rate / 2;
  for (let i = 1; i <= 5; i++) {
    const img = document.createElement("img");
    if (i <= filledCount) {
      img.src = "./images/star_filled.png";
    } else {
      img.src = "./images/star_empty.png";
    }
    img.dataset.index = String(i);
    starsEl.appendChild(img);
  }
};
const renderEvaluate = (rate) => {
  const evaluateEl = document.querySelector("#rate-evaluate");
  if (!evaluateEl) return;
  evaluateEl.textContent = rate === null ? "아직 별점을 남기지 않으셨습니다" : ratingMap.get(rate);
};
const renderScore = (rate) => {
  const scoreEl = document.querySelector("#rate-score");
  if (!scoreEl) return;
  scoreEl.textContent = rate === null ? "(0/10)" : `(${rate}/10)`;
};
const renderCustomRating = (rate) => {
  renderStars(rate);
  renderEvaluate(rate);
  renderScore(rate);
};
const ratingMap = /* @__PURE__ */ new Map([
  [2, "최악이예요"],
  [4, "별로예요"],
  [6, "보통이에요"],
  [8, "재미있어요"],
  [10, "명작이에요"]
]);
const getCustomRate = (movieId) => {
  const rate = localStorage.getItem(String(movieId));
  if (rate) return Number(rate);
  return null;
};
const saveCustomRate = (movieId, rating) => {
  localStorage.setItem(String(movieId), String(rating));
};
const posterBaseURL = "https://image.tmdb.org/t/p/original";
const showModal = () => {
  document.querySelector("#modalBackground")?.classList.add("active");
  document.body.classList.add("modal-open");
};
const hideModal = () => {
  document.querySelector("#modalBackground")?.classList.remove("active");
  document.body.classList.remove("modal-open");
};
const renderModal = (state, customRateNum) => {
  if (!state.isOpen) {
    hideModal();
    return;
  }
  const detail = state.selected;
  const img = document.querySelector(".modal-image img");
  if (img) img.src = `${posterBaseURL}${detail.poster_path}`;
  const title = document.querySelector(".modal-description h2");
  if (title) title.textContent = detail.title;
  const category = document.querySelector(".modal-description .category");
  if (category) category.textContent = `${detail.release_date.slice(0, 4)} · ${detail.genres.map((g) => g.name).join(", ")}`;
  const rate = document.querySelector("#average-score");
  if (rate) rate.textContent = `${detail.vote_average.toFixed(1)}`;
  const description = document.querySelector(".modal-description .detail");
  if (description) description.textContent = detail.overview;
  showModal();
};
const selection = new MovieSelection();
const openModal = async (id) => {
  try {
    const detail = await fetchMovieDetail(id);
    selection.select(detail);
    const customRate = getCustomRate(id);
    renderModal(selection, customRate);
    renderCustomRating(customRate);
  } catch (error) {
    showError(error);
  }
};
const rateMovie = (rating) => {
  const movieId = selection.selected?.id;
  if (!movieId) return;
  saveCustomRate(movieId, rating);
  renderCustomRating(rating);
};
const closeModal = () => {
  selection.close();
  renderModal(selection);
};
class App {
  constructor() {
    initTemplate();
    initDetailClick(openModal);
    initSearchSubmit(search);
    initLoadMore(loadMore);
    initMovieClick(openModal);
    initModalClose(closeModal);
    initRatingClick(rateMovie);
    loadPopular();
  }
}
new App();
