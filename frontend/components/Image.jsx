import React, { useState } from "react"

import { resizeImage, fileToCanisterBinaryStoreFormat } from "../utils/image"
import { useDropzone } from "react-dropzone"

import { useImageObject } from "../hooks/useImageObject"
import { useCanister } from "@connect2ic/react"

const ImageMaxWidth = 2048

const ImageSection = () => {
  const [imageId, setImageId] = useState(null)
  const [loading, setLoading] = useState("")
  const [file, setFile] = useState(null)

  const imgSrc = useImageObject(imageId)

  const [imageCanister] = useCanister("image")

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"]
    },
    onDrop: async acceptedFiles => {
      if (acceptedFiles.length > 0) {
        try {
          const firstFile = acceptedFiles[0]
          const newFile = await resizeImage(firstFile, ImageMaxWidth)
          setFile(newFile)
        } catch (error) {
          console.error(error)
        }
      }
    }
  })

  async function submitImage() {
    if (file == null) {
      return
    }

    setLoading("Submitting...")
    setImageId(null)

    const fileArray = await fileToCanisterBinaryStoreFormat(file)
    const newImageId = await imageCanister.create(fileArray)
    setImageId(newImageId)

    setLoading("")
  }

  return (
    <div>
      <section>
        <h2>Image</h2>
        <label htmlFor="name">Upload Image: &nbsp;</label>
        <button {...getRootProps({ className: "dropzone" })}>
          Pick a Image
          <input {...getInputProps()} />
        </button>
        <button onClick={submitImage}>Submit</button>
      </section>
      <section>
        <div>{loading}</div>
        <label>Image loaded from canister: &nbsp;</label>
        {imgSrc && <img src={imgSrc} alt="canister-image" />}
      </section>
    </div>
  )
}

export { ImageSection }