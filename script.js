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
    if(event.target.innerText === "Like") {
        event.target.innerText = "Unlike";
        event.target.ariaLabel = "unlike";
    } else {
        event.target.innerText = "Like";
        event.target.ariaLabel = "Like";                }
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
                newDiv.appendChild(img);
                
                //creating a like button
                let likeButton = document.createElement("button");
                likeButton.addEventListener("click", likeToggle);
                likeButton.innerText = "Like";
                likeButton.ariaLabel = "Like";
                newDiv.appendChild(likeButton);
                
                //create and append the title to parent div
                let title = document.createElement("h4");
                title.innerText = imageObj.title;
                newDiv.appendChild(title);
                
                //create and append the date to parent div
                let date = document.createElement("p");
                date.innerText = `Posted: ${imageObj.date}`;
                newDiv.appendChild(date);
                
                //create and append the description to parent div
                let description = document.createElement("p");
                description.innerText = imageObj.explanation;
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
