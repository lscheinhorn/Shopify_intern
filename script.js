//this object stores important info
const info = {
    API_KEY: "RGkpWjhIy6gvbT7hNzAWpi46Le6zTIKAUqjdOXlC",
    ACCOUNT_ID: "cb241c79-b1fd-45dd-8067-36bdea054751" 
}

//stores api parameters and builds request URL
let count = 3;
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
    console.log("Yay! You like me!")
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
            console.log(data, "data object");
        
            //puts object with one image in an array to perform .forEach()
            if(!Array.isArray(data)) {
                data = [data];
            }
            
            let imagesElement = document.createElement("div");
            imagesElement.setAttribute("id", "images");
            document.getElementById("main").appendChild(imagesElement);

            //iterating through image objects to capture data
            data.forEach((imageObj) => {
                //console.log(imageObj)
                //create a div for image
                let newDiv = document.createElement("div");

                //create and append the image to parent div
                let img = document.createElement("img");
                img.src = imageObj.url;
                img.setAttribute("alt", `an image titled ${imageObj.title}`);
                img.setAttribute("tabindex", "0");
                newDiv.appendChild(img);
                
                //creating a like button
                let likeButton = document.createElement("i");
                likeButton.setAttribute("class", "far fa-heart fa-3x");
                likeButton.setAttribute("tabindex", "0");
                likeButton.addEventListener("click", likeToggle);
                likeButton.addEventListener("keydown", likeToggle);

                likeButton.ariaLabel = "Like";
                newDiv.appendChild(likeButton);
                
                //create and append the title to parent div
                let title = document.createElement("h4");
                title.innerText = imageObj.title;
                title.setAttribute("tabindex", "0");

                newDiv.appendChild(title);
                
                //create and append the date to parent div
                let date = document.createElement("p");
                date.innerText = `Posted: ${imageObj.date}`;
                date.setAttribute("tabindex", "0");

                newDiv.appendChild(date);
                
                //create and append the description to parent div
                let description = document.createElement("p");
                description.innerText = imageObj.explanation;
                description.setAttribute("tabindex", "0");

                newDiv.appendChild(description);
                
                //append the new div to the 'main' section
                document.getElementById("images").appendChild(newDiv);
            })
            
        })
    }

getNasaImages();
    

const searchDate = () => {
    let imagesElement = document.getElementById("images");
    imagesElement.remove();
    date = document.getElementById("date_input").value;
    count = 0;
    getNasaImages();
}
