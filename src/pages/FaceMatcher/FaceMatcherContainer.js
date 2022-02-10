import React, { useRef } from "react";
import * as faceapi from 'face-api.js';

export const FaceMatcherContainer = (props) => {

    const imageRef = useRef();
    const canvasRef = useRef(null);

    const faceMatcher = props.faceMatcher
    
    const imageOnChange = async (event) => {

        console.log('We are loading a new image')
      
        // Viser bilde på skjermen
        let image = await faceapi.bufferToImage(event.target.files[0])
        imageRef.current.src = image.src

        // Lager et canvase basert på bildet
        let canvas = canvasRef.current
        canvasRef.current = faceapi.createCanvasFromMedia(image)

        // Sett dimensjonenen på bildet og canvas likt
        const displaySize = { width: image.width, height: image.height }
        faceapi.matchDimensions(canvas, displaySize) 
        canvasRef.current = canvas

        // Kjør ansiktsdeteksjon
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

        // Iterer gjennom resutatene
        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            drawBox.draw(canvas)
        }) 
    }

    return (
        <>
            <div>
                <input type="file" onChange={(event) => imageOnChange(event)} />
            </div>
            <div>

                <img style={{ position: "absolute", top: 200, left: 0 }} ref={imageRef} id="imageUpload" /><br />
                <canvas ref={canvasRef} style={{ position: "absolute", top: 200, left: 0 }} />
      
            </div>
        </>
    )


}