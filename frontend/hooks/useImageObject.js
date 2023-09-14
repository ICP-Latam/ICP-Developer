import { useState, useEffect } from "react"
import { useCanister } from "@connect2ic/react"
import { arrayBufferToImgSrc } from "../utils/image"

export const useImageObject = imageId => {
  const [imgSrc, setImgSrc] = useState("")
  const [imgId, setImgId] = useState("")

  const [image] = useCanister("image");

  useEffect(() => {
    async function fetchImage() {
      if (imageId && imageId != "") {
        if (imageId == imgId) {
          // return existing src
          return imgSrc
        }

        const imageSource = await loadImage(imageId)

        // Make sure to revoke the data uris to avoid memory leaks
        if (imgSrc && imgSrc != "") URL.revokeObjectURL(imgSrc)

        setImgSrc(imageSource)
        setImgId(imageId)
      } else {
        setImgSrc(null)
      }
    }

    fetchImage()
  }, [imageId])

  const loadImage = async (imageId) => {
    const result = await image.getImageById(imageId);

    if (result.length == 0) {
        return null
      }
    
      const imageArray = result[0]
      const imageSource = arrayBufferToImgSrc(imageArray)
      return imageSource
  }

  return imgSrc
}
