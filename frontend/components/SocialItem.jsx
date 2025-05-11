import React, { useState } from "react";
import { arrayBufferToImgSrc } from "../utils/image";

const ImageMaxWidth = 2048

const SocialItem = (props) => {
    const { id, data, refresh, actorSocial } = props;
    const [loading, setLoading] = useState("");
    const [message, setMessage] = useState(data.message);
    const [visible, setVisible] = useState(false);

    const image = imageFormat(data.image) ? data.image : nat8ToImage(data.image)

//////////////////////////// IMAGE FORMAT //////////////////////////////////////////
    function imageFormat(str) {
    return typeof str === 'string' && 
            (str.startsWith('http://') || 
            str.startsWith('https://'))
    }

    function nat8ToImage(imageData) {
        const arr = JSON.parse(imageData)
        return arrayBufferToImgSrc(arr)
    }

////////////////////////// POST FUNCTIONS ////////////////////////////////////////////
    const handleUpdate = async (event) => {
        event.preventDefault();
        setLoading("Loading...");
        try {
            await actorSocial.updatePost(id, message);
            await refresh();
            setLoading("");
        } catch(e) {
            setLoading("There was an error.");
            console.log(e);
        } finally {
            setVisible(false);
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        setLoading("Loading...");
        try {
            await actorSocial.deletePost(id);
            await refresh();
            setLoading("");
        } catch(e) {
            setLoading("There was an error.");
            console.log(e);
        } finally {
            setVisible(false);
        }
    };

    return(
        <div className="border border-gray-500 p-2">
            <p className="border-b border-gray-500"> <strong>Posted by: </strong>{data.creator.toText()} </p>
            <div className="mb-2">
                <p>{data.message}</p>
                <img width="368" src={image} alt={`${data.message} by ${data.creator.toText()}`}/>
            </div>
            <div className={`${visible ? `flex` : `hidden`} flex-col items-center justify center w-full space-y-2 my-2`}>
                <input className="border border-gray-500 px-2 w-full" type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className="w-full bg-gray-950 hover:bg-gray-900 text-white p-2 font-bold" onClick={handleUpdate}>Update</button>
            </div>
            <p>{loading}</p>
            <div className={`${visible ? `hidden` : `flex`} items-center justify center w-full space-x-2 mt-2`}>
                <button className="w-full bg-gray-950 hover:bg-gray-900 text-white p-2 font-bold" onClick={() => setVisible(true)}>Edit</button>
                <button className="w-full bg-gray-950 hover:bg-gray-900 text-white p-2 font-bold" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}


export {SocialItem}