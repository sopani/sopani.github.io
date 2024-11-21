"use client";
import { useRef, useState } from "react";
import classes from "./image-picker.module.css";
import Image from "next/image";
export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickImage] = useState();
  const imageInput = useRef();

  function handlePickClick() {
    imageInput.current.click();
  }

  function handleImagekChage(event) {
    const file = event.target.files[0];
    if (!file) {
      setPickImage(null);

      return;
    } else {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPickImage(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
    // setPickImage(event.target.files[0])}
    // imageInput.current.click();
  }
  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>

      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No Image picked yet.</p>}
          {pickedImage && (
            <Image src={pickedImage} alt="this image is selcted" fill></Image>
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImagekChage}
          required
        ></input>
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          {" "}
          Pick the image
        </button>
      </div>
    </div>
  );
}
