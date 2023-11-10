import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineDownload } from "react-icons/ai";
import { TestContext } from "../Context/TestContext/TestContext";

function ImageModal({ imageId, onClose }) {
  const { handleImage } = useContext(TestContext);
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  const fetchOriginalImage = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/fetch-original-image`,
        {
          imageId,
        }
      );
      setImageName(response.data.imageName);

      setImageUrl(
        handleImage(response.data.image.data, response.data.contentType)
      );
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName;
    link.click();
  };

  useEffect(() => {
    fetchOriginalImage();
  }, [imageId]);

  useEffect(() => {
    const closeOnEscapeKeyDown = (e) => {
      if ((e.charCode || e.keyCode) === 27) {
        onClose();
      }
    };

    document.body.addEventListener("click", handleOutsideClick);
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);

    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, [onClose]);

  return (
    <div
      id="modal-overlay"
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
      onClick={handleOutsideClick}
    >
      <div
        id="modal-overlay"
        className="modal-overlay modal-content flex justify-center"
        style={{ width: "1%", height: "1%", margin: "auto" }}
      >
        <img src={imageUrl} alt="Original Image " style={{ height: "550px" }} />
      </div>

      <div className="icon-container">
        <button className="icon " style={{ color: "red" }} onClick={onClose}>
          <AiOutlineClose />
        </button>
        <button
          className="icon"
          style={{ color: "blue" }}
          onClick={handleDownload}
        >
          <AiOutlineDownload />
        </button>
      </div>
    </div>
  );
}

export default ImageModal;
