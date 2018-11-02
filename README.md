# Image labeling tool

This application is used to label things in images.  
With the goal to be used as a tool for labeling things later to be trained for object detection using Tensorflow or similar tools.  
Labels has a related geometry, using the geomtry id, as of right now the id is a faked uuid.  
Focus from the start has been on plant counting, but there's no reason not to use it for something else.

## Use instructions
The application is separated in two parts. They work about the same. Geometries created for plant counting can be used for training as well.
I have tried to keep as much of the data in GeoJson as possible.

### Count plants
Start by drawing geometries with the tools on the top right corner.
Right click on a geometry to select it.  
Select a model and click process.  
A API request is now simulated and points are added to the map.

That's about it for plant counting.

### Training models
Draw or use old geometries by right clicking on them and select them.  
Click inside geometry to create annotations with the selected annotation type.  
Several geometries can be created.  
Click train to simulate the API request.

A new fake model will be added to the list of models.

## Install instructions

To start:

```bash
$ npm install
```

or

```bash
$ yarn
```

To develop:

```
$ npm run dev
```
or
```bash
$ yarn run dev
```

To build for production:

```bash
$ npm run build
```

## Issues
The mock API is not the best, I didn't want to waste time there. So it only works one time. So if you train more than one model the created fake uuid will be the same and a therefore there's a bug.  
Easily solved with a proper API.

---
