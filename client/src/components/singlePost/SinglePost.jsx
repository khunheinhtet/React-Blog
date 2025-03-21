import './singlePost.css'
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import { config } from "../../config/config";

export default function SinglePost() {

    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [post, setPost] = useState({});
    const PF = "http://localhost:5000/images/";
    const { user } = useContext(Context);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [updateMode, setUpdateMode] = useState(false);
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
      const getPost = async () => {
        const res = await axios.get(`${config.apiBaseUrl}/api/posts/` + path,
          {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        setPost(res.data);
        setTitle(res.data.title);
        setDesc(res.data.desc);
      };
      getPost();
    }, [path, accessToken]);
  
    const handleDelete = async () => {
      try {
        await axios.delete(`${config.apiBaseUrl}/api/posts/${post._id}`, {headers: {Authorization: `Bearer ${accessToken}`}},
          {
          data: { username: user.username },
          }
        );
        window.location.replace("/");
      } catch (err) {}
    };
    const handleUpdate = async () => {
      try {
        await axios.put(`${config.apiBaseUrl}/api/posts/${post._id}`, {headers: {Authorization: `Bearer ${accessToken}`}},
           {
          username: user.username,
          title,
          desc,
        });
        setUpdateMode(false)
      } catch (err) {}
    };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && (
          <img src={PF + post.photo} alt="" className="singlePostImg" />
        )}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.username === user?.username && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link to={`/?user=${post.username}`} className="link">
              <b> {post.username}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
    </div>
  )
}
