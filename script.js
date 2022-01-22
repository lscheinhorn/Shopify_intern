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

//Changes like status
const likeToggle = (event) => {
    if(event.target.classList.contains("fas")) {
        event.target.classList.remove("fas");
        event.target.classList.add("far");
        event.target.ariaLabel = "like";
    } else {
        event.target.classList.remove("far");
        event.target.classList.add("fas");
        event.target.ariaLabel = "unlike";                }
}

//makes http request for image data from apoc api
const getNasaImages = () => {
    fetch(requestURL())
        .then((response) => {
        
            //parsing JSON file to javascript object
            return response.json()
        })
        .then((data) => {
            //puts object with one image in an array to perform .forEach()
            if(!Array.isArray(data)) {
                data = [data];
            }
            
            let imagesElement = document.createElement("div");
            imagesElement.setAttribute("class", "row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3");
            imagesElement.setAttribute("id", "images");
            document.getElementById("main").appendChild(imagesElement);

            //iterating through image objects to capture data
            data.forEach((imageObj) => {
                //create a div for image
                let newDiv = document.createElement("div");
                newDiv.setAttribute("class", "col")

                if(imageObj.media_type !== "image") {
                    console.log("There's a video here!");
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
                    img.src = imageObj.url;
                    img.setAttribute("class", "card-img-top");
                    img.setAttribute("alt", `an image titled ${imageObj.title}`);
                    img.setAttribute("tabindex", "0");
                    newDiv.appendChild(img);
                }

                //creating the text card
                let textCard = document.createElement("div");
                textCard.setAttribute("class", "card-body");
                newDiv.appendChild(textCard);

                //creating a like button
                let likeButton = document.createElement("button");
                likeButton.setAttribute("class", "far fa-heart fa-3x card-text");
                likeButton.setAttribute("aria-hidden", "true");
                likeButton.addEventListener("click", likeToggle);
                textCard.appendChild(likeButton);
        
                //create and append the title to parent div
                let title = document.createElement("h4");
                title.setAttribute("class", "card-text");
                title.innerText = imageObj.title;
                title.setAttribute("tabindex", "0");
                textCard.appendChild(title);
                
                //create and append the date to parent div
                let date = document.createElement("p");
                date.setAttribute("class", "card-text");
                date.innerText = `Posted: ${imageObj.date}`;
                date.setAttribute("tabindex", "0");
                textCard.appendChild(date);
                
                //create and append the description to parent div
                let description = document.createElement("p");
                description.innerText = imageObj.explanation;
                description.setAttribute("class", "card-text");
                description.setAttribute("tabindex", "0");
                textCard.appendChild(description);
                
                //append the new image div to the 'images' div
                document.getElementById("images").appendChild(newDiv);
            })
            
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
    let dateInput = document.getElementById("date_input").value;
    date = dateMutate(dateInput);
    if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date)) {
        alert('Please enter a date in the format MM-DD-YYYY')
        return
    }
    let imagesElement = document.getElementById("images");
    imagesElement.remove();
    count = 0;
    getNasaImages();
}

//adds event listener to date_input for enter key and clicks the search button
let input = document.getElementById("date_input");
input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search_date_button").click();
    }
});