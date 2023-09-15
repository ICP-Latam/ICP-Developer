import { useCanister, useConnect } from "@connect2ic/react";
import { resizeImage, fileToCanisterBinaryStoreFormat } from "../utils/image"
import { useDropzone } from "react-dropzone"

import React, { useEffect, useState } from "react";
import { SocialItem } from "./SocialItem";

const ImageMaxWidth = 2048

const IcpSocial = () => {
    const [social] = useCanister("social");
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState("");
    const [file, setFile] = useState(null);

    const {principal} = useConnect();

    useEffect(() => {
        refreshPosts();  // Llama a refreshPosts cuando el componente se monta
    }, []);

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

    const refreshPosts = async () => {
        setLoading("Loading...");
        try {
            const result = await social.getPosts();
            setPosts(result.sort((a, b) => parseInt(a[0]) - parseInt(b[0])));  // Ordenar posts por ID
            setLoading("Done");
        } catch(e) {
            console.log(e);
            setLoading("Error happened fetching posts list");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file == null) {
            return
        }

        setLoading("Loading...");
        const fileArray = await fileToCanisterBinaryStoreFormat(file)

        await social.createPost(e.target[0].value, fileArray);
        await refreshPosts();
    }

    const handleRefresh = async () => {
        await refreshPosts();
    }

    return(
        <div className="flex items-center justify-center flex-col p-4 w-full">
            <h1 className="h1 text-center border-b border-gray-500 pb-2">Hi {principal ? principal : ", connect with Internet Identity to continue"}!</h1>
            {/* Create post section */}
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center border mt-4 border-gray-500 p-5 space-x-2 w-96">
                    <div className="flex flex-col space-y-2 w-full">
                        <label htmlFor="message">What are you thinking about?</label>
                        <input id="message" required className="border border-gray-500 px-2" type="text"/>
                        <button className="w-full" {...getRootProps({ className: "dropzone" })}>
                            <p className="bg-gray-950 hover:bg-gray-900 text-white p-2">Pick an image</p>
                            <input required {...getInputProps()} />
                        </button>
                        <p className="mt-2 border-b border-gray-500">{file ? file.name : "No file selected"}</p>
                        <button type="submit" className="w-full p-2 rounded-sm bg-gray-950 hover:bg-gray-900 text-white text-lg font-bold">Create</button>
                    </div>
                    
                </div>
            </form>

            <p className="mx-2">{loading}</p>

            {/* Post section */}
            <div className="mt-4 space-y-2 w-96">
                <h2 className="h2 font-bold text-xl text-start">Posts</h2>
                <button className="w-full bg-gray-950 hover:bg-gray-900 text-white p-2 font-bold" onClick={handleRefresh}>Refresh</button>
                {posts.map((post) => {
                    return(<SocialItem key={post[0]} post={post} refresh={handleRefresh} />);
                })}
            </div>
        </div>
    )
}

export {IcpSocial}