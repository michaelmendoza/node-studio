# NodeStudio

A library for visual programming of image-processing algorithms on dicom images. Still in development ... 

Frontend javascript code located in nodestudiojs

Backend python server code located in nodestudio


##

To run locally frontend: ( From project root directory )
- Add third party packages
```
cd nodestudiojs 
npm install
```
- To run frontend react server
``` 
npm start
```

To run locally backend api server: ( From project root directory )

- Setup conda enviroment 
```
conda env create -f nodestudio/environment.yml
conda activate nodestudio
```
- Run to API server
```
npm run api
```
