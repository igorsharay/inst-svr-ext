// Copy this stuff to the dev console opened on instagram saved page.

class PostsObserver {
  observerElement;
  observerConfig;
  observer;

  constructor(
    observerElement,
    observerConfig = {
      attributes: false,
      childList: true,
      subtree: true,
    }
  ) {
    if (!observerElement) {
      throw new Error("No observer element found!");
    }

    PostsObserver.observerElement = observerElement;
    PostsObserver.observerConfig = observerConfig;
  }

  set setObserver(callback) {
    PostsObserver.observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          callback();
        }
      }
    });
  }

  get getObserver() {
    return PostsObserver.observer;
  }

  observePosts() {
    const observerNodeElement = document.querySelector(
      PostsObserver.observerElement
    );

    PostsObserver.observer.observe(
      observerNodeElement,
      PostsObserver.observerConfig
    );
  }
}

class InstMediaCollector extends PostsObserver {
  mediaSrcs;
  postElement;

  constructor(postElement, observerElement) {
    super(observerElement);

    if (!postElement) {
      throw new Error("No post element found!");
    }

    this.mediaSrcs = new Set();
    this.postElement = postElement;
  }

  get mediaSrcsArray() {
    return [...this.mediaSrcs];
  }

  collectAllPostsMedia() {
    super.setObserver = () => {
      const posts = document.querySelectorAll(this.postElement);

      posts.forEach(post => this.mediaSrcs.add(post.firstChild.src));
    };

    super.observePosts();
  }

  stopCollecting() {
    super.getObserver.disconnect();
  }
}

class FileDownloader {
  constructor() {}

  static #_download(url, filename) {
    fetch(url).then(function (t) {
      return t.blob().then(b => {
        let a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.setAttribute("download", filename);
        a.click();
      });
    });
  }

  static #createFileName(fileUrl, fileSign = "file") {
    let img_name = fileUrl.split("?");
    img_name = img_name[0].split("/");

    return fileSign + "__" + img_name[img_name.length - 1];
  }

  static downloadMediaFile(fileUrl, fileSign) {
    if (!fileUrl) {
      throw new Error("No file url found!");
    }

    this.#_download(fileUrl, this.#createFileName(fileUrl, fileSign));
  }
}

class InstMediaDownloader extends FileDownloader {
  mediaArray = [];
  #limit = 10;

  constructor(mediaArray) {
    super();

    if (!mediaArray) {
      throw new Error("No mediaArray found!");
    }

    this.mediaArray = mediaArray;
  }

  #loopMedia(start) {
    console.log(start);

    let i = start;

    for (; i < start + this.#limit; i++) {
      console.log(this.mediaArray[i]);
      this.mediaArray[i] &&
        FileDownloader.downloadMediaFile(this.mediaArray[i], `inst_${i}_`);
    }

    if (i + this.#limit < this.mediaArray.length - 1) {
      setTimeout(() => this.#loopMedia(i), 3000);
    }
  }

  downloadImages() {
    this.#loopMedia(0);
  }
}

const instMediaCollector = new InstMediaCollector(
  "._aagv",
  `main[role="main"] article > div > div`
);

// Call as many times as you need to collect all posts.
instMediaCollector.collectAllPostsMedia();

// End of collecting.
instMediaCollector.stopCollecting();

// After that call downloader. Enjoy!
const downloader = new InstMediaDownloader(instMediaCollector.mediaSrcsArray);
downloader.downloadImages();
