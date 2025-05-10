import React, { useCallback, useEffect, useState } from "react";
import { SocialItem } from "./SocialItem";

// local and production

const IcpSocial = (props) => {
    
    const social = props.actorSocial
    const refreshTrigger = props.refreshTrigger

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState("");


    const refreshPosts = useCallback(async () => {
        setLoading("Loading...");
        try {
          const result = await social.getPosts();
          setPosts(result.sort((a, b) => parseInt(a[0]) - parseInt(b[0])));
          setLoading("Done");
        } catch(e) {
          console.error(e);
          setLoading("Error happened fetching posts list");
        }
      }, [social]);


    useEffect(() => {
        refreshPosts();
      }, [refreshTrigger, refreshPosts]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading("Loading...");
        console.log(social)
        await social.createPost(e.target[0].value, e.target[1].value);
        await refreshPosts();
    }

    const handleRefresh = async () => {
        await refreshPosts();
    }

    return(
        <div className="flex items-center justify-center flex-col p-4 w-full">
            <h1 className="h1 text-center border-b border-gray-500 pb-2">Hi {props.principal ? props.principal : ", connect with Internet Identity to continue"}!</h1>
            {/* Create post section */}
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center border mt-4 border-gray-500 p-5 space-x-2 w-96">
                    <div className="flex flex-col space-y-2 w-full">
                    <label htmlFor="message">What are you thinking about?</label>
                    <input id="message" required className="border border-gray-500 px-2" type="text"/>
                   
                    <label htmlFor="message">Insert image URL</label>
                    <input id="message" required className="border border-gray-500 px-2" type="text"/>

                    <button type="submit" className="w-full p-2 rounded-sm bg-gray-950 hover:bg-gray-900 text-white text-lg font-bold">
                        Create
                    </button>
                    </div>
                </div>
                </form>

            <p className="mx-2">{loading}</p>

            {/* Post section */}
            <div className="mt-4 space-y-2 w-96">
                <h2 className="h2 font-bold text-xl text-start">Posts</h2>
                <button className="w-full bg-gray-950 hover:bg-gray-900 text-white p-2 font-bold" onClick={handleRefresh}>Refresh</button>
                {posts.map(([id, data]) => {
                    return (
                        <SocialItem
                            key={id}
                            id={id}
                            data={data}
                            refresh={handleRefresh}
                            actorSocial={props.actorSocial}
                        />
                    );
                })}

            </div>
        </div>
    )
}

export {IcpSocial}