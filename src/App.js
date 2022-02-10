import React, { useEffect, useState } from "react";
import * as faceapi from 'face-api.js';
import { FaceMatcherContainer } from "./pages/FaceMatcher/FaceMatcherContainer";

const App = () => {

  const avengers =
  {
    characters: ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark'],
    folder: 'http://localhost:3000/labeled_images/',
    ext: 'jpg',
    maxId: 2
  }
  
  const bigBang = {
    characters: ['Amy', 'Bernadette', 'Howard', 'Leonard', 'Penny', 'Raj', 'Sheldon'],
    folder: 'http://localhost:3000/BigBangTraining',
    ext: 'png',
    maxId: 2
  }

  const ulriken = {
    characters: ['BjørnErik', 'Jarle', 'Knut', 'Magne', 'Mannaf', 'Olav', 'TheKevsMan', 'TorChristian', 'Torstein', 'Uchermann'],
    folder: 'UC_training',
    ext: 'png',
    maxId: 1
  }

  const [faceMatcher, setFaceMatcher] = useState()
  const [isReady, setIsReady] = useState(false)
  const [task, setTask] = useState(false)

  useEffect(() => {

    async function initialiseFaceApi() {    

      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      ]).then(console.log('FaceApi is loaded'))
              
      // Training model with known faces
      setTask('Start training model with known faces')      
      const faceDescriptors = await trainModelWithKnownFaces(bigBang)
      //const faceDescriptors = await trainModelWithKnownFaces(ulriken)
      const facMat = new faceapi.FaceMatcher(faceDescriptors, 0.6)
      setFaceMatcher(facMat)
      setTask('Done training model with known faces')

      setIsReady(true)
    }
    initialiseFaceApi()

  }, [])


 /*
  TODO kan vi gjøre dette mer robust: 
    variabelt antall, 
    hva om vi ikke finner ansikt i filen
    Kan vi lagre facedtections på localstorage, og slippe å tolke bildet for hver gang?
 */
 function trainModelWithKnownFaces(personList) {

    return Promise.all(
      personList.characters.map(async name => {
        
        // Array med ansiktsinformasjon
        const faceDescriptors = []
        for (let i = 1; i <= personList.maxId; i++) {
          setTask(`Learning the face of ${name} version ${i}.`)          
          
          // Hent et bilde          
          const image = await faceapi.fetchImage(`${personList.folder}/${name}/${i}.${personList.ext}`)

          // Finn ansikt på bildet, bruker Singleface
          const detections = await faceapi
            .detectSingleFace(image)
            .withFaceLandmarks()
            .withFaceDescriptor()            
          
          console.log(detections)
          
          // Legg resultatet av detektering i array for angitt navn
          faceDescriptors.push(detections.descriptor)
          
          console.log(`Loaded image: ${name}/${i}.jpg`)
        }
  
        // Returnere fra promise med array over detektert ansikt fra alle bildene for en person
        return new faceapi.LabeledFaceDescriptors(name, faceDescriptors)
      })
    )
  }
// {isReady && <FaceMatcherContainer faceMatcher={faceMatcher} />}
  // Rendering
  return (
    <>
      {!isReady && <p>Please Wait. Initializing the face api, {task}.</p>}
     
    </>
  )
}

export default App;