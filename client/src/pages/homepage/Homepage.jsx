import './homepage.css'
import Header from '../../components/header/Header'
import SideBar from '../../components/sidebar/SideBar'
import Posts from '../../components/posts/Posts'
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";
import { config } from "../../config/config";

export default function Homepage() {
  const [posts, setPosts] = useState([]);
  const { search } = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`${config.apiBaseUrl}/api/posts` + search, {headers: {Authorization: `Bearer ${accessToken}`}});
      setPosts(res.data);
    };
    fetchPosts();
  }, [search, accessToken]);

  return (
    <>
        <Header/>
        <div className='home'>
            <Posts posts={posts}/>
            <SideBar/>
        </div>
    </>
  )
}
