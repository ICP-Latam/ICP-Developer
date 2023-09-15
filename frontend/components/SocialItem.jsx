import { useCanister } from "@connect2ic/react";

import { arrayBufferToImgSrc } from "../utils/image";
import React, { useState } from "react";

const ImageMaxWidth = 2048

const SocialItem = (props) => {
    const { post, refresh } = props;
    const [social] = useCanister("social");

    const [loading, setLoading] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState(post[1].message);
    const [visible, setVisible] = useState(false);

    const [update, setUpdate] = useState(false);

    const handleUpdate = async (event) => {
        event.preventDefault();

        setLoading("Loading...");
        try {
            await social.updatePost(post[0], message);
            await refresh();
            setLoading("");
        } catch(e) {
            setLoading("There was an error.");
            console.log(e);
        } finally {
            setVisible(false);
        }
    }

    const handleDelete = async (event) => {
        event.preventDefault();

        setLoading("Loading...");
        try {
            await social.deletePost(post[0]);
            await refresh();
            setLoading("");
        } catch(e) {
            setLoading("There was an error.");
            console.log(e);
        } finally {
            setVisible(false);
        }
    }

    return(
        <div className="border border-gray-500 p-2">
            <p className="border-b border-gray-500"><strong>Posted by: </strong>{post[1].creator}</p>
            <div className="mb-2">
                <p>{post[1].message}</p>
                <img width="368" src={arrayBufferToImgSrc(post[1].image)}/>
            </div>
            <div className={`${visible ? `flex` : `hidden`} flex-col items-center justify center w-full space-y-2 my-2`}>
                <input className="border border-gray-500 px-2 w-full" type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
                <button className="w-full bg-gray-950 hover:bg-gray-900 text-white p-2 font-bold" onClick={handleUpdate}>Update</button>
            </div>
            <p>{loading}</p>
            <div className={`${visible ? `hidden` : `flex`} items-center justify center w-full space-x-2 mt-2"`}>
                <button className="w-full bg-gray-950 hover:bg-gray-900 text-white p-2 font-bold" onClick={() => setVisible(true)}>Edit</button>
                <button className="w-full bg-gray-950 hover:bg-gray-900 text-white p-2 font-bold" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}

export {SocialItem}