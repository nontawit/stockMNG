import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const BarcodeScanner = () => {
  const webcamRef = useRef(null);
  const [productID, setProductID] = useState(null);
  const [error, setError] = useState(null);

  const scanBarcode = () => {
    const canvas = document.createElement("canvas");
    const video = webcamRef.current.video;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

    if (qrCode) {
      setProductID(qrCode.data); // ได้ผลลัพธ์จากบาร์โค้ด
    } else {
      setError("ไม่สามารถสแกนบาร์โค้ดได้");
    }
  };

  return (
    <div>
      <h3>สแกนบาร์โค้ด</h3>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ width: "100%", height: "auto" }}
      />
      <button onClick={scanBarcode}>สแกน</button>
      {productID && <p>Product ID: {productID}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default BarcodeScanner;
