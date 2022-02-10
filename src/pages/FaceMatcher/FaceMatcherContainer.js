import React, { useRef } from "react";
import * as faceapi from 'face-api.js';

export const FaceMatcherContainer = (props) => {

    const imageRef = useRef();
    const canvasRef = useRef(null);

    const faceMatcher = props.faceMatcher

    // Viser bilde på skjermen
    let image = await faceapi.bufferToImage(event.target.files[0])
    imageRef.current.src = image.src

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