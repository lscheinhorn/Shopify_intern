//this object stores important info
const info = {
    API_KEY: "RGkpWjhIy6gvbT7hNzAWpi46Le6zTIKAUqjdOXlC",
    ACCOUNT_ID: "cb241c79-b1fd-45dd-8067-36bdea054751" 
}

//stores api parameters and builds request URL
let count = 12;
let date;
let requestURL = () => {
    let url = `https://api.nasa.gov/planetary/apod?api_key=${info.API_KEY}`;
    if(count) {
        url += `&count=${count}`;
    }
    if(date) {
        url += `&date=${date}`;
    }
    return url;
}

const spinner = document.getElementById("spinner");

//makes http request for image data from apoc api
const getNasaImages = () => {
    
    spinner.removeAttribute('hidden');

    fetch(requestURL())
        .then((response) => {
        
            //parsing JSON file to javascript object
            return response.json()
        })
        .then((data) => {
            console.log('json response', data);
            spinner.setAttribute('hidden', '');

            //nasa apod api has been returning an object with an error code
            if(data.code){
                throw new Error(`Code: ${data.code}`)
            }

            //puts object with one image in an array to perform .forEach()
            if(!Array.isArray(data)) {
                data = [data];
            }
            
            //adding image element to main with styling
            let imagesElement = document.createElement("div");
            imagesElement.setAttribute("class", "row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3");
            imagesElement.setAttribute("id", "images");
            document.getElementById("main").appendChild(imagesElement);

            //iterating through image objects to capture data
            data.forEach((imageObj) => {
                //create a div for image
                let newDiv = document.createElement("div");
                newDiv.setAttribute("class", "col")

                //creating an iframe for video
                if(imageObj.media_type === "video") {
                    let videoParent = document.createElement("div");
                    videoParent.setAttribute("style", "position:relative;padding-top:56.25%")
                    let video = document.createElement("iframe");
                    videoParent.appendChild(video);
                    video.setAttribute("frameborder", "0");
                    video.setAttribute("allowfullscreen", "true");
                    video.setAttribute("style", "position:absolute;top:0;left:0;width:100%;height:100%;");
                    video.src = imageObj.url;
                    video.setAttribute("tabindex", "0");
                    newDiv.appendChild(videoParent);
                } else {
                    
                    //create and append the image to parent div
                    let img = document.createElement("img");
                    let imgLink = document.createElement("a");
                    imgLink.setAttribute("href", imageObj.hdurl);
                    imgLink.setAttribute("target", "blank");
                    img.setAttribute("aria-label", `${imageObj.title}, image, link`);
                    img.src = imageObj.url;
                    img.setAttribute("class", "card-img-top");
                    img.setAttribute("alt", ``);
                    imgLink.setAttribute("tabindex", "0");
                    imgLink.appendChild(img);
                    newDiv.appendChild(imgLink);
                }

                //creating the text card
                let textCard = document.createElement("div");
                textCard.setAttribute("class", "card-body");
                newDiv.appendChild(textCard);

                //This function will be called on keyboard focus to add aria-label to live region. If aria-live regions have content on load, screen readers will announce all live regions. If aria-live regions are created dynamically, screen readers will not recognize them. Thus, aria-live regions must be created with no aria content.
                const addAriaLabel = (event) => {
                    if(!event.target.hasAttribute("aria-label")){
                        event.target.setAttribute("aria-label", "like");
                    }
                }

                //toggles like button
                const likeToggle = (event) => {
                    event.stopPropagation();
                    if(likeButton.ariaLabel === "like") {
                        likeButton.ariaLabel = "unlike";
                        heart.classList.remove("far");
                        heart.classList.add("fas");
                    } else {
                        likeButton.ariaLabel = "like";
                        heart.classList.remove("fas");
                        heart.classList.add("far");
                    }
                }

                //create accessible like button
                let likeButton = document.createElement("button");
                likeButton.setAttribute("class", "heart");
                likeButton.setAttribute("aria-live", "polite");
                likeButton.addEventListener("focus", addAriaLabel);
                likeButton.addEventListener("click", likeToggle);
                textCard.appendChild(likeButton);

                //creating a like button heart icon
                let heart = document.createElement("i");
                heart.setAttribute("class", "far fa-heart fa-3x");
                heart.addEventListener("click", likeToggle);
                likeButton.appendChild(heart);

                //create and append the title to parent div
                let title = document.createElement("h4");
                title.setAttribute("class", "card-text light-text");
                title.innerText = imageObj.title;
                title.setAttribute("tabindex", "0");
                textCard.appendChild(title);
                
                //create and append the date to parent div
                let date = document.createElement("p");
                date.setAttribute("class", "card-text light-text");
                date.innerText = `Posted: ${imageObj.date}`;
                date.setAttribute("tabindex", "0");
                textCard.appendChild(date);
                
                //create and append the description to parent div
                let description = document.createElement("p");
                description.innerText = imageObj.explanation;
                description.setAttribute("class", "card-text light-text");
                description.setAttribute("tabindex", "0");
                textCard.appendChild(description);
                
                //append the new image div to the 'images' div
                document.getElementById("images").appendChild(newDiv);
            })
            
        })

        .catch((error) => {
            spinner.setAttribute('hidden', '');
            const errorDiv = document.createElement("div");
            errorDiv.setAttribute("id", "error");
            errorDiv.setAttribute("tabindex", "1");
            errorDiv.innerText = "We're sorry!\r\nThe server is not responding\r\nPlease try again";
            document.getElementById("main").appendChild(errorDiv);
            console.error("There was an error", error);
        })
    }

getNasaImages();
    
//changes the date from conventional "MM-DD-YYYY" format to "YYYY-MM-DD" for API call
const dateMutate = (oldDate) => {
    let newDate = oldDate.split("");
    newDate.push("-");
    for(let i=0;i<5;i++) {
      newDate.push(newDate.shift());
    }
    newDate.shift();
    newDate = newDate.join("");
    return newDate;
  }

//fetches an image from a given date
const searchDate = () => {
    let inputElement = document.getElementById("date_input")
    let dateInput = inputElement.value;
    date = dateMutate(dateInput);
    if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date)) {
        alert('Please enter a date in the format MM-DD-YYYY');
        inputElement.value = "";
        return;
    }
    let imagesElement = document.getElementById("images");
    if(imagesElement) {
        imagesElement.remove();
    }
    if(document.getElementById("error")) {
        document.getElementById("error").remove();
    }
    getNasaImages();
    inputElement.value = "";
}

//adds event listener to date_input for enter key and clicks the search button
let input = document.getElementById("date_input");
input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search_date_button").click();
    }
});