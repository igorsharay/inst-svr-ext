# Instagram files saver

Its going to be an extantion in the future that saves all instagram photos by adding a download button to a post. Currently it allows to save photos manualy by copying the script from `manual_files.saver.js` file to a dev console. If you want to try it, follow instractions inside the file.

The downloader goes through all collected links and downloads the media file from each link every three seconds by collection of ten files. So a browser would not block the download process.

### Helper notes to the file

`._aagv` - post container, contains media post `img` element. 

`main[role="main"] article > div > div` - posts wrapper, contains all posts on the page. This element updates its children on scroll event.



