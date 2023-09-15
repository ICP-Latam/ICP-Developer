import { useCanister, useConnect } from "@connect2ic/react";
import React, { useState } from "react";

const IcpSocial = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState("");
    const [social] = useCanister("social");

    const {principal} = useConnect();

    const refreshPosts = async () => {
        setLoading("Loading...");
        try {
            const result = await social.getPosts();
            setPosts(result.sort((a, b) => parseInt(a[0]) - parseInt(b[0])));  // Ordenar posts por ID
            setLoading("Done");
        } catch {
            setLoading("Error happened fetching posts list");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading("Loading...");
        await social.createPost(e.target[0].value);
        await refreshPosts();
    }

    const handleRefresh = async (e) => {
        e.preventDefault();
        await refreshPosts();
    }

    return(
        <div className="flex items-center justify-center flex-col p-4 w-full">
            <h1 className="h1 text-center border-b border-gray-500 pb-2">Hi {principal ? principal : ", connect with Internet Identity to continue"}!</h1>
            {/* Create post section */}
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between w-96 items-center border mt-4 border-gray-500 p-5 space-x-2">
                    <div className="space-y-2">
                        <p>What are you thinking about?</p>
                        <input required className="border border-gray-500" type="text"/>
                    </div>
                    <button type="submit" className="p-2 rounded-sm bg-black text-white text-lg font-bold">Create</button>
                </div>
            </form>

            <p className="mx-2">{loading}</p>

            {/* Post section */}
            <div className="w-96 mt-4 space-y-2">
                <h2 className="h2 font-bold text-xl text-start">Posts</h2>
                <button className="w-full bg-black text-white p-2 font-bold" onClick={handleRefresh}>Refresh</button>
                {posts.map((post) => {
                    console.log(post[0])
                    return(<div className="border border-gray-500 p-2" key={post[0]}>
                            <p>Post {post[0]}: {post[1].message}</p>
                        </div>);
                })}
            </div>
        </div>
    )
}

export {IcpSocial}