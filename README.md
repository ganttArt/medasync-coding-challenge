# Medasync Coding Challenge

## Design Explanation

- I used a stream and a readline interface to process the input text line by line.  
- I separated helper functions like summarizing the patient actions into their own modules so I can unit test the functionality and keep the main function and file processing clean.
- My approach to parse and summarize the data was to add patients to an object and update their discharge, intake and treatments when they occured. At the end of the file we would run the summary function which would transform all of the data we had received for the patients into string descriptions.
- I also added thorough validation and error handling throughout all of this processing.

## Setup

`npm install`

## Start

To run script on your file use:
`node index.js {pathToYourFile.txt}`

To run the proof of concept test:
`npm start`

## Tests

Use this command to run the suite of unit tests
`npm test`
